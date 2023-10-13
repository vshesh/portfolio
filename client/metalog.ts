import * as R from 'ramda';

/**
 * Metalog Distributions & SPT Metalog Distribution Functions
 */
const log = Math.log
const exp = Math.exp


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


// TODO: 
// - add feasibility constraints
// - support more than 3 params in the main function
// - move formula and sampling functions here instead of having them in the model.