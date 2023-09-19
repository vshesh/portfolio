/**
 Super lightweight table interface that allows for lookups by multiple indexes
 Also serializes nicely to JSON so that it can be saved and loaded. 
 */


// Why do this? In the default way of doing client side models
// there is a lot of nested layers of data
// some container concept will contain smaller concepts and so on
// this becomes a headache when you later decide you want to 
// show some view indexed another way. 

// I guess this would eventually lead to something like 
// IndexedDB but those APIs seemed too dense to be worth it. 
// I needed something ridiculously small and this works and it's less 
// than 200 lines of code. 
// no super reactivity, events, promises, observables, or any other fanciness. 
// also no optimization, nd-array, tensors, or any of that complexity. 
// just a very dumb implementation of tables. 

// TODO: implement indexes that store more than one object per key (like a real db)
// TODO: implement filter (slow, non indexed scan)
// TODO: implement 'default' join between tables using property <=> table name magic 


import * as R from 'ramda'

// index where we aren't sure if it's a 1:1 mapping
type Index<I, Id, T> = {id: (t: T) => I, index: Map<I, Set<Id>>}


export function map<A,B>(iterable: Iterable<A>, f: (a: A) => B) {
  const l = []
  for (const item of iterable) {
    l.push(f(item))
  }
  return l
}


// This function as data thing really doesn't work well with OO sometimes
// In Java there is a pattern where you extend a class in place, and that 
// is how this class is meant to be used. You can make a new class and
// give it a name and an id function right there.

// the more functional approach would be to store name and id on the class
// and use them that way. That was getting complicated because then I had
// to pass all that stuff in and it wasn't easy to type the name variable. 

// with classes there may be a ClassName<typeof something> in TS that
// cleans that up.
export abstract class IndexedSet<Id, T> {
  // note the difference here - object is a Map<Id, T> meaning only 
  // one object can have one ID. 
  // indexes do not have to be unique! 
  objects: Map<Id, T>;
  // this "any" rankles, is there a way to say "infer this"
  indexes: {[name: string]: Index<any, Id, T>}

  constructor(iterable: Iterable<T> = []) {
    this.objects = new Map() 
    this.indexes = {}
    for (const item of iterable) {
      this.add(item)
    }
  }

  abstract id(t:T): Id 

  // currently also overwrites any other object with the same key.
  // Ids should be unique for all T 
  add(object: T) {
    if (!!this.objects.get(this.id(object))) { throw new Error(`While trying to add ${object}: Object with id ${this.id(object)} already exists in db: ${this.objects.get(this.id(object))}.`)}
    this.objects.set(this.id(object), object)
    R.map(i => i.index.get(i.id(object)) ? i.index.get(i.id(object))?.add(this.id(object)) : i.index.set(i.id(object), new Set([this.id(object)])), this.indexes)
    return this;
  }

  // replaces or adds an object to the db.
  // add will throw if the object already exists. 
  upsert(object: T) {
    // if this needed to be more complicated it would somehow 
    // "move" the object in the index without deleting it
    // but I don't think I have that much control in JS.
    if (!!this.objects.get(this.id(object))) {
      this.remove(object)
    } 
    return this.add(object)
  }

  remove(object: T) {
    this.objects.delete(this.id(object))
    R.map(i => i.index.get(i.id(object))?.delete(this.id(object)), this.indexes)
    return this
  }

  // this is harder than it looks, if you change the underlying data 
  // you have to reindex the thing somehow. 
  // no clean way to implement that without observing all the changes 
  // yourself, which is I guess why reactivity exists in the first place 
  // in all these app frameworks.
  // in a database they track changes to the rows and do those updates
  // automatically.

  // easy solution - immutability. 
  // get returns a copy of the information that you can modify 
  // and replace if you wish. Hence the R.clone calls in the return statements.
  get(id: Id): T | undefined
  // intention: call like this get({index_name: value})
  // making a typescript type that accepts one dynamic key is possible
  // but very hard, because it blurs into dependently typed language 
  // stuff, so i will just use convention here. 
  get(onekey: { [s: string]: any }): T[]
  get({ name, value }: { name: string, value: any }): T[]
  get(arg: Id | {[s: string]: any} | { name: string, value: any }): T | undefined | T[] {
   const test = (x: any): x is Id => typeof x !== 'object';
    if (!test(arg)) {
      if (Object.keys(arg).length === 1) {
        const name = Object.keys(arg)[0];
        if (name.toLowerCase() === 'id') return this.get((arg as {[s: string]: Id}) [name])
        const id = this.indexes[name].index.get((arg as {[s:string]: any})[name]) ?? new Set()
        return Array.from(id).map(x => R.clone(this.objects.get(x)!))
      } else {
        const {name, value} = arg
        const id = this.indexes[name].index.get(value) ?? new Set()
        return Array.from(id).map(x => R.clone(this.objects.get(x)!))
      }
    } else {
      // single value, should resolve directly to an object.
      return R.clone(this.objects.get(arg))
    }
  }

  addIndex<I>(id: (t: T) => I, name?: string) {
    if (!(name ?? id.name)){ throw Error(`New index being added, but no valid name found. id function has name \`${id.name}\` and name is \`${name}\``)}
    if ((name ?? id.name).toLowerCase() === 'id') throw Error(`Either name \`${name}\` or id function name \`${name}\` is some variant of 'id'. Do not do this.`)

    let m = new Map();
    for (let [k, v] of this.objects.entries()) {
      m.get(id(v)) ? m.get(id(v)).add(k) : m.set(id(v), new Set([k]))
    }
    this.indexes[name ?? id.name] = { id, index: m }
  }

  removeIndex(name: string) {
    delete this.indexes[name]
  }

  [Symbol.iterator]() {
    return this.objects.values()
  }
}

// TODO(vishesh): return a object with class-based names instead of an array
function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, where: (a: T1, b: T2) => boolean): IndexedSet<[I1, I2], [T1, T2]>
function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, match: [string, string]): IndexedSet<[I1, I2], [T1, T2]>
function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, match: [string, string] | ((a: T1, b: T2) => boolean)): IndexedSet<[I1, I2], [T1, T2]> {
  
  const final = new (class extends IndexedSet<[I1, I2], [T1, T2]> {
    id([t1, t2]: [T1, T2]): [I1, I2] { return [set1.id(t1), set2.id(t2)] }
  })

  if (R.is(Array, match) && match.length === 2) {
    // these are equivalent indexes and a waste of space to store both separately
    // todo(vishesh): make IndexedSet more complicated to allow aliases 
    // at some point it will actually turn into a db... 
    final.addIndex(match[0].toLowerCase() === 'id' ? ([x,y]) => set1.id(x) : ([x, y]) => set1.indexes[match[0]].id(x), `${set1.constructor.name.replace(/T$/, '').toLowerCase()}.${match[0]}`)
    final.addIndex(match[1].toLowerCase() === 'id' ? ([x,y]) => set2.id(y) :([x,y]) => set2.indexes[match[1]].id(y), `${set2.constructor.name.replace(/T$/, '').toLowerCase()}.${match[1]}`)
    // fast index match version: 
    // in most instances indexes are 1:1, so this will be fast... 

    for (const k of match[0].toLowerCase() === 'id' ? set1.objects.keys() : set1.indexes[match[0]].index.keys()) {
      const items = set1.get({[match[0]]: k})
      for (const v2 of set2.get({[match[1]]: k})) {
        items.map(i => final.add([i, v2]))
      }
    }

    return final;     
  }
  // regular, slow join 
  for (const x of set1.objects) {
    for (const y of set2.objects) {
      if (match(x[1], y[1])) final.add([x[1], y[1]])
    }
  }
  return final;
}  

