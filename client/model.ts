import { parse } from "./exprparser"
import * as R from 'ramda'
import { sptq, SPTInput } from './metalog'
import { IndexedSet, map } from "./db"

// --------------------
// Formula stuff 
// --------------------

// this ArrayTree stuff should be its own file/library
type ArrayBranch<B, L> = [B, ...(L | ArrayBranch<B, L>)[]]
type ArrayTree<B, L> = L | ArrayBranch<B, L>
export type ASTBranch = ArrayBranch<string, string | number>
export type ASTTree = ArrayTree<string, string | number>

export function isLeaf<B, L>(a: ArrayTree<B, L>): a is L { return !(a instanceof Array) }
export function branch<B, L>(a: ArrayBranch<B, L>): ArrayTree<B, L>[] {
  const [b, ...rest] = a
  return rest;
}

function value<B, L>(a: ArrayBranch<B, L>): B { return a[0] }

function* extract<B, L>(
  branch: (a: ArrayBranch<B, L>) => ArrayTree<B, L>[],
  pred: (a: ArrayTree<B, L>) => boolean,
  a: ArrayTree<B, L>): Generator<B | L> {
  if (isLeaf(a) && pred(a)) yield a
  if (!isLeaf(a)) {
    for (const suba of branch(a)) {
      yield* extract(branch, pred, suba)
    }
    if (pred(a)) yield value(a)
  }
}

function asStatement(expr: ASTBranch[]): ["=", string, ASTBranch][] {
  return expr as ["=", string, ASTBranch][];
}

export function compute(formula: ASTTree, inputs: { [s: string]: number }): number {
  if (isLeaf(formula)) {
    if (typeof formula === 'string') {
      // @ts-ignore
      return inputs[formula] ?? (/[A-Z]+/.test(formula) ? (Math[formula] as number) : undefined)
    }
    return formula as number
  }
  let f: (...args: number[]) => number = ({
    '+': (x: number, y: number) => x + y,
    '-': (x: number, y: number) => x - y,
    '*': (x: number, y: number) => x * y,
    '/': (x: number, y: number) => x / y
    // @ts-ignore 
  })[value(formula)] ?? Math[value(formula)]

  if (R.type(f) === 'Undefined') throw Error(`did not recognize function ${f} in ${formula}`)
  // can throw error if f is not a function
  return f(...branch(formula).map(x => compute(x, inputs)))
}

export class Model {
  formulas: ["=", string, ASTBranch][];
  derived_vars: string[];
  inputs: string[];
  name: string; // id 

  public constructor(formula: string, name?: string) {
    this.name = name ?? formula;
    this.formulas = asStatement(parse(formula, {}) as ASTBranch[]);
    this.derived_vars = this.formulas.map(x => x[1]);
    console.log(this.derived_vars);
    this.inputs = R.uniq(R.chain((f) => Array.from(extract(
      branch,
      (a) => isLeaf(a) && typeof a === 'string' && !R.includes(a, this.derived_vars),
      f
    )) as string[], this.formulas))
  }

  compute(inputs: { [s: string]: number }): { [s: string]: number } {
    let ii = Object.assign({}, inputs);
    for (const formula of this.formulas) {
      const value = compute(formula[2], ii)
      ii[formula[1] as string] = value;
    }
    return ii;
  }

  formulaString(): string {
    return this.formulas.map(f => `${f[1]} = ${Model.formulaToString(f[2])}`).join('\n')
  }

  static formulaToString(formula: ASTTree): string {
    if (isLeaf(formula)) { return `${formula}` };
    const children = formula.slice(1).map(Model.formulaToString)
    if (!(/\w+/.test(formula[0]))) {
      const term = R.intersperse(formula[0], children).join(" ")
      if (formula[0] === '+' || formula[0] === '-') {
        return `(${term})`
      }
      return term;
    } else {
      return `${formula[0]}(${R.intersperse(",", children)})`
    }
  }
}

// --------------------------------------------------------------------------


export type ModelInput<T, R> = {
  name: string;
  units?: string;
  // what this input is measuring.
  description: string;
  rationales: R;
  // values needed to describe the quantity
  estimate: T
}

// represets a uncertain quantity that has a range of possibliities.
export type UncertainQuantity = ModelInput<SPTInput, {low: string, high: string}>;
// represents a known quantity with a fixed value
export type CertainQuantity = ModelInput<number, {comments: string}>
export type Quantity = UncertainQuantity | CertainQuantity;

// every reasonable complexity program has a half-baked implementation of multiple dispatch
// this is annoying but necessary.
// inv_q means inverse quantile function.
// could consider extending to normal distributions, but those have infinite tails which doesn't make
// sense for estimating values. 
function inv_q(q: Quantity): (_:number) => number
function inv_q(q: (Quantity)['estimate']): (_:number) => number
function inv_q(q: Quantity | (Quantity)['estimate']) {
  // @ts-ignore
  if (typeof q === 'object' && Object.hasOwn(q, 'estimate')) {
    // @ts-ignore
    return inv_q(q.estimate!);
  }
  // @ts-ignore
  return typeof q === 'number' ? (_:number) => q : sptq(q)
}

// represents a single proof point in a phase of development
export type ProofPoint = ModelInput<number, {criteria: string, comments: string}>;
// so that we can refer to them together.
export type Input = UncertainQuantity | ProofPoint

export class SPTModel {
  _model!: Model
  inputs: {[s: string]: Quantity}
  private _samples!: number[]

  constructor(formula: string, inputs?: Iterable<Quantity>) {
    this.inputs = !!inputs ? R.fromPairs(Array.from(inputs).map(x => [x.name, x])) : {};
    this.model = new Model(formula);
  }

  set(name: string, value: Quantity) {
    this.inputs[name] = value;
    this.update_samples()
    console.log('new samples', R.mean(this.samples), R.median(this.samples), this.inputs, this.model)
  }

  public get model() {return this._model}
  public set model(model:Model) {
    console.log('setting model')
    this._model = model;
    this.inputs = Object.assign(this.model.inputs.map(
        (i) => ({
          name: i, 
          description: "", 
          rationales: {low: '', high: ''}, 
          estimate: { alpha: 0.1, low: 0, med: 5, high: 10, min: undefined, max: undefined }
        })
      )
    , this.inputs)
    this.update_samples();
  }

  // you can read samples, but not write them
  get samples() { return this._samples;}

  protected update_samples() {
    this._samples = R.pluck(R.last(this.model.derived_vars)!, this.sample(10000)).sort((a, b) => a - b);
  }

  protected has_all_inputs() {
    for (let i of this.model.inputs) {
      if (!(this.inputs[i])) {
        console.log(`Warning: Not all inputs are present. Need [${this.model.inputs}], have [${R.keys(this.inputs)}]`)
        return false;
      }
    }
    return true;
  }

  sample(n: number): { [s: string]: number }[] {
    if (!this.has_all_inputs()) return []
    return R.range(0, n).map(
      (_) => this.model.compute(
        R.map(x => inv_q(x.estimate)(Math.random()), this.inputs)
      ))
  }

  quantileF() {
    return (q: number) => q >= 0 && q <= 1 ? this.samples[Math.floor(q * this.samples.length)] : NaN
  }

  quantile(n: number): number {
    return R.findIndex(x => x > n, this.samples) / this.samples.length
  }

  /** In reality sensitivity is a jacobian matrix (gradient of many variables), 
   * this is a crude approximation of sensitivity 
   * *around* the `med` point for each of the variables. 

   * the concept falls apart for nonlinear relationships, especially
   * when some variable contributes to both cost and value in the model formula.
   * I have had situations where a variable is optimized in the middle of the 
   * distribution instead of at the ends. 
   */
  sensitivity(around: 'med' | 'low' | 'high' = 'med'): { variable: string, value: [number, number, number] }[] {
    if (!this.has_all_inputs()) return [];

    const basepoint = (s: SPTInput | number) => typeof s === 'number' ? 0 : ({ med: 0.5, low: s.alpha, high: 1 - s.alpha })[around]!
    return this.model.inputs.map(i => ({
      variable: i, 
      value: R.tap(x => console.log('value', i, x), [0.1, 0.5, 0.9].map(q => 
        this.model.compute( R.fromPairs(this.model.inputs.map(
          x => {
            const estimate = this.inputs[x].estimate!;
            const value = inv_q(estimate)(x === i ? q : basepoint(estimate))
            return [x, value]
          }
        )))[R.last(this.model.derived_vars)!])
      ) as [number, number, number]
    }))
  }

  serialize() {
    return {
      inputs: Object.values(this.inputs),
      formula: this.model.formulaString()
    }
  }

  static deserialize(data: {formula: string, inputs: Quantity[]}) {
    return new SPTModel(data.formula, data.inputs)
  }
}


export class Phase {
  name: string
  description?: string
  proof_points: {[_:string]: ProofPoint}
  cost: SPTModel

  constructor(name: string, description?: string, proof_points?: Iterable<ProofPoint>) {
    this.name = name; 
    this.description = description || "";
    this.proof_points = !!proof_points ? R.fromPairs(Array.from(proof_points).map(x => [x.name, x])) : {};;
    this.cost = new SPTModel('value = devtime * devcost')
  }

  public chanceOfSuccess(){
    let p = 1; 
    for (const pp of Object.values(this.proof_points)) {
      p *= pp.estimate;
    }
    return p;
  }

  serialize() {
    return {
      name: this.name,
      description: this.description,
      proof_points: Object.values(this.proof_points),
      cost: this.cost.serialize()
    }
  }

  static deserialize(data: ReturnType<Phase['serialize']>) {
    let p = new Phase(data.name, data.description, data.proof_points)
    p.cost = SPTModel.deserialize(data.cost)
    return p;
  }
}

export class Roadmap {
  phases: Phase[]

  constructor(phases?: Iterable<Phase>) {
    this.phases = Array.from(phases ?? [])
  } 

  public chanceOfSuccess() {
    let p = 1;
    for (const phase of this.phases) {
      p *= phase.chanceOfSuccess()
    }
    return p;
  }

  serialize() {
    return {phases: this.phases.map(x => x.serialize())}
  }

  static deserialize(data: ReturnType<Roadmap['serialize']>) {
    return new Roadmap(data.phases.map(Phase.deserialize))
  }
}


export class Scenario {
  id: string
  name: string
  description: string = "";

  idea?: Idea['id'] // parent idea this scenario is estimating. 
  assessor?: Person['id'] // person who did the estimates for this idea. 

  opportunity: SPTModel;
  roadmap: Roadmap;

  constructor(formula: string, name: string = "New Scenario", idea?: Idea['id']) {
    // this is just to make the ts compiler happy
    // the values are actually set when the model is set

    this.name = name;
    this.id = makeId(name);
    this.idea = idea;

    this.opportunity = new SPTModel(formula)
    this.roadmap = new Roadmap();
  }

  serialize() {
    return {
      name: this.name, 
      id: this.id, 
      description: this.description,
      idea: this.idea, 
      assessor: this.assessor,
      opportunity: this.opportunity.serialize(),
      roadmap: this.roadmap.serialize()
    }
  }

  static deserialize(data: ReturnType<Scenario['serialize']>) {
    let s = new Scenario(data.opportunity.formula, data.name, data.idea)
    s.assessor = data.assessor
    s.id = data.id
    s.description = data.description
    s.opportunity = SPTModel.deserialize(data.opportunity)
    s.roadmap = Roadmap.deserialize(data.roadmap)
    return s;
  }
}

export class Idea {
  name: string;
  description: string;
  proposer?: Person['id'];
  id: string;

  public constructor(name: string, description?: string, proposer?: Person['id']) {
    this.id = makeId(name)
    this.name = name; 
    this.description = description ?? ""; 
    this.proposer = proposer; 
  }

  serialize() {
    return R.map(R.identity, this)
  }

  static deserialize(i: Idea) {
    let idea = new Idea(i.name, i.description, i.proposer)
    idea.id = i.id;
    return idea;
  }
}

export interface Person {
  id: string;
  name: string; 
  email: string; 
  color: string;
}

function makeId(name: string) {
  return name.replace(/\s/, '-') + '--' + (Math.random() + 1).toString(36).slice(-7)
}