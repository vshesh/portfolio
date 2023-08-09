import { parse } from "./exprparser"
import * as R from 'ramda'

export type SPTInput = {
  alpha: number,
  low: number, 
  med: number, 
  high: number,
  min?: number, 
  max?: undefined
} | {
  alpha: number, 
  low: number, 
  med: number, 
  high: number,
  min: number, 
  max: number
}

export function isSPTInput(x:{[_:string]:number | undefined}): x is SPTInput {
  return R.all(y => R.has(y, x), [
    'alpha',
    'low',
    'med',
    'high'
  ]) && (R.has('max', x) && R.has('min', x) || !R.has('max', x))
}

type ArrayBranch<B, L> = [B, ...(L | ArrayBranch<B, L>)[]]
type ArrayTree<B, L> = L | ArrayBranch<B, L>
export type ASTBranch = ArrayBranch<string, string | number>
export type ASTTree = ArrayTree<string, string | number>

function isLeaf<B,L>(a:ArrayTree<B, L>): a is L { return !(a instanceof Array) }
function branch<B,L>(a:ArrayBranch<B, L>): ArrayTree<B, L>[] { 
  const [b, ...rest] = a
  return rest;
}

function value<B,L>(a:ArrayBranch<B, L>): B { return a[0] }

function* extract<B,L>(
  branch: (a:ArrayBranch<B, L>) => ArrayTree<B, L>[], 
  pred: (a:ArrayTree<B, L>) => boolean, 
  a: ArrayTree<B,L>): Generator<B | L> {
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

export function compute(formula: ASTTree, inputs: {[s:string]: number}): number {
  if (isLeaf(formula)) {
    if (typeof formula === 'string') {
      // @ts-ignore
      return inputs[formula] ?? (/[A-Z]+/.test(formula) ? (Math[formula] as number) : undefined)
    }
    return formula as number
  }
  let f: (...args:number[]) => number  = ({
    '+': (x:number, y:number) => x+y, 
    '-': (x:number, y:number) => x-y, 
    '*': (x:number, y:number) => x*y, 
    '/': (x:number, y:number) => x/y
    // @ts-ignore 
  })[value(formula)] ?? Math[value(formula)]

  if (R.type(f) === 'Undefined') throw Error(`did not recognize function ${f} in ${formula}`)
  // can throw error if f is not a function
  return f(...branch(formula).map(x => compute(x, inputs)))
}

export class Model {
  formulas: ["=", string, ASTBranch][];
  derived_vars: string[]; 
  inputs:string[]; 

  public constructor(formula: string) {
    this.formulas = asStatement(parse(formula, {}));
    this.derived_vars = this.formulas.map(x => x[1]) as string[];
    this.inputs = R.chain((f) => Array.from(extract(
      branch,
      (a) => isLeaf(a)  && typeof a === 'string' &&  !R.includes(a, this.derived_vars),
      f
    )) as string[], this.formulas)
  }

  compute(inputs: {[s:string]: number}): {[s:string]: number} {
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

  static formulaToString(formula:ASTTree): string {
    if (isLeaf(formula)) {return `${formula}`};
    const children = formula.slice(1).map(Model.formulaToString)
    if (!(/\w+/.test(formula[0]))) {
      return R.intersperse(formula[0], children).join(" ")
    } else {
      return `${formula[0]}(${R.intersperse(",", children)})`
    }
  }
}

export class Scenario {
  private _model!: Model; 
  inputs!: {[_:string]: SPTInput}
  samples!: number[]
  name: string

  constructor(model: Model, inputs: {[_:string]: SPTInput} = {}, name: string = "") {
    this.model = model;
    this.name = name;
  }

  public get model() { return this._model; }
  
  public set model(m: Model) {
    this._model = m; 
    this.inputs = Object.assign(
      R.fromPairs(this.model.inputs.map(
        (i) => [i, {alpha: 0.1, low: 0, med: 5, high: 10, min: undefined, max :undefined}])), 
      this.inputs);
    this.update_samples();
  }

  protected update_samples() {
    this.samples = R.sortBy(R.identity, R.pluck(R.last(this.model.derived_vars)!, this.sample(10000)));
  }

  set(name: string, value: SPTInput) {
    this.inputs[name] = value;
    this.update_samples()
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

  sample(n:number): {[s:string]: number}[] {
    if (!this.has_all_inputs()) return []
    return R.range(0,n).map(
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
  sensitivity(around: 'med' | 'low' | 'high' = 'med'): {variable: string, value: [number, number, number]}[] {
    if (!this.has_all_inputs()) return []; 
    const basepoint = (s: SPTInput) => ({med:0.5, low: s.alpha, high:1-s.alpha})[around]!
    return this.model.inputs.map(i => ({variable: i, value: [0.1, 0.5, 0.9].map(q => 
      this.model.compute(R.fromPairs(this.model.inputs.map(
        x => [x, sptq(this.inputs[x]!)(x === i ? q : basepoint(this.inputs[x])  )]
      )))[R.last(this.model.derived_vars)!]
    ) as [number, number, number] }))
  }
}



















/**
 * Metalog Distributions & SPT Metalog Distribution Functions
 */
const log = Math.log
const exp = Math.exp

// only handles up to 4 terms because we are using only 3 for SPT
export function mq(a1:number, a2:number, a3 = 0, a4 = 0): (_:number) => number {
  return (y) => a1 + a2 * log(y/(1-y)) + a3 * (y-0.5) * log(y/ (1-y)) + a4 * (y-0.5)
}

// e for 'exists'
const e = <T>(x?:T) : x is T => x !== undefined && x != null 

function spt_coeffs({
  alpha, 
  low, med, high, 
  min, max
}: SPTInput): [number, number, number] {
  if (e(max) && !e(min)) throw Error('spt_coeffs: if you define max, need to also define min.') 

  if (!e(min) && !e(max)) {
    return [
      med, 
      (high-low)/2/log(1/alpha-1), 
      (high+low-2*med)/(1-2*alpha)/log(1/alpha-1)
    ]
  } else if (!e(max) && e(min)) {
    return [
      log(med-min),
      0.5 * log((high-min)/(low-min))/log(1/alpha-1),
      log((high-min)*(low-min)/(med-min)^2) / ((1-2*alpha)*log((1/alpha-1)))
    ]
  } else if (e(max) && e(min)) {
      const t = (x: number) => (x-min)/(max-x) // logit transform 
      let a1 = log(t(med))
      let a2 = 0.5 * log(t(high)/t(low)) / log(1/alpha-1)
      let a3 = log(t(high)*t(low)/t(med)^2) / (1-2*alpha) / log(1/alpha-1)
      return [a1, a2, a3]
  }
  throw Error(`Must pass a valid SPT configuration. ${({alpha, low, med, high, min, max})} doesn't qualify`)
}

export function sptq({
  alpha, 
  low, med, high, 
  min, max 
}: SPTInput) {

  if (!e(min) && !e(max)) {
    return mq(...spt_coeffs({low, med, high, alpha}))
  } else if (!e(max) && e(min)) {
    let [a1, a2, a3] = spt_coeffs({alpha, low, med, high, min})
    return (y:number) => y === 0 ? min : min + exp(mq(a1, a2, a3)(y))
  } else if (e(max) && e(min)) {
    let [a1, a2, a3] = spt_coeffs({alpha, low, med, high, min, max})
    return (y:number) => y === 0 ? min : y === 1 ? max : (
      min + max * exp(mq(a1,a2,a3)(y))) / (1 + exp(mq(a1,a2,a3)(y)))
  } else {
    throw Error('sptq: if you define max, need to also define min.') 
  }
}
