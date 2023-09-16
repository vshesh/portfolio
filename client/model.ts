import { parse } from "./exprparser"
import * as R from 'ramda'
import { sptq, SPTInput } from './metalog'

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


// --------------------------------------------------------------------------


export class Model {
  formulas: ["=", string, ASTBranch][];
  derived_vars: string[];
  inputs: string[];

  public constructor(formula: string) {
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



export class Scenario {
  id: string
  name: string
  description: string = "";

  idea?: Idea // parent idea this scenario is estimating. 
  assessor?: Person // person who did the estimates for this idea. 

  private _model!: Model;
  inputs: { [_: string]: SPTInput }
  rationales!: { [_: string]: { low: string, high: string } }

  // derived data only
  // technically should be private
  samples!: number[]

  constructor(model: Model, inputs: { [_: string]: SPTInput } = {}, name: string = "") {
    // this is just to make the ts compiler happy
    // the values are actually set when the model is set
    this.inputs = inputs;

    this.name = name;
    this.model = model; // note calls set model below, ts doesn't check this control flow.
    this.id = name + (Math.random() + 1).toString(36).slice(-7)
  }

  public get model() { return this._model; }

  public set model(m: Model) {
    console.log('setting model')
    this._model = m;
    this.inputs = Object.assign(
      R.fromPairs(this.model.inputs.map(
        (i) => [i, { alpha: 0.1, low: 0, med: 5, high: 10, min: undefined, max: undefined }])),
      this.inputs);
    this.rationales = Object.assign(
      R.fromPairs(this.model.inputs.map(
        (i) => [i, { low: "", high: "" }]
      )),
      this.rationales)
    this.update_samples();
  }

  protected update_samples() {
    this.samples = R.pluck(R.last(this.model.derived_vars)!, this.sample(10000)).sort((a, b) => a - b);
  }

  set(name: string, value: SPTInput, rationale?: { low: string, high: string }) {
    this.inputs[name] = value;
    this.update_samples()
    if (rationale) {
      this.rationales[name] = rationale;
    }
    console.log('new samples', R.mean(this.samples), R.median(this.samples), this.inputs, this.model)
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
      (_) => this.model.compute(R.map(x => sptq(x)(Math.random()), this.inputs)))
  }

  quantileF() {
    // there will never be an input that is an empty string, just a hack 
    // to deal with the typescript complier being not okay with undefined 
    // as an index type.
    return (q: number) => q >= 0 && q <= 1 ? this.samples[Math.floor(q * this.samples.length)] : NaN
  }

  quantile(n: number): number {
    return R.findIndex(x => x > n, this.samples) / this.samples.length
  }

  /** In reality sensitivity is a jacobian matrix (gradient of many variables), 
   * this is a crude approximation of sensitivity 
   * *around* the `med` point for each of the variables. 
   */
  sensitivity(around: 'med' | 'low' | 'high' = 'med'): { variable: string, value: [number, number, number] }[] {
    if (!this.has_all_inputs()) return [];
    const basepoint = (s: SPTInput) => ({ med: 0.5, low: s.alpha, high: 1 - s.alpha })[around]!
    return this.model.inputs.map(i => ({
      variable: i, value: [0.1, 0.5, 0.9].map(q =>
        this.model.compute(R.fromPairs(this.model.inputs.map(
          x => [x, sptq(this.inputs[x]!)(x === i ? q : basepoint(this.inputs[x]))]
        )))[R.last(this.model.derived_vars)!]
      ) as [number, number, number]
    }))
  }
}

export function* getScenariosForIdea(idea: Idea, scenarios: Iterable<Scenario>) {
  for (let scenario of scenarios) {
    if (scenario.idea && scenario.idea.name === idea.name && scenario.idea.proposer === idea.proposer) {
      yield scenario
    }
  }
}

export interface Idea {
  name: string;
  description: string;
  proposer?: Person;
}

export interface Person {
  name: string; 
  email: string; 
  color: string;
}