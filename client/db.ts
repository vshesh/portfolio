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
import { where } from 'ramda';
import { HighlightSpanKind } from 'typescript';

// index where we aren't sure if it's a 1:1 mapping
type Index<I, Id, T> = {id: (t: T) => I, index: Map<I, Set<Id>>}




export abstract class IndexedSet<Id, T> {
  // note the difference here - object is a Map<Id, T> meaning only 
  // one object can have one ID. 
  // indexes do not have to be unique! 
  objects: Map<Id, T>;
  // this "any" rankles, is there a way to say "infer this"
  indexes: {[name: string]: Index<any, Id, T>}

  constructor() {
    this.objects = new Map() 
    this.indexes = {}
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
  get(id: Id): [T]
  // intention: call like this get({index_name: value})
  // making a typescript type that accepts one dynamic key is possible
  // but very hard, because it blurs into dependently typed language 
  // stuff, so i will just use convention here. 
  get(onekey: { [s: string]: any }): T[]
  get({ name, value }: { name: string, value: any }): T[]
  get(arg: Id | {[s: string]: any} | { name: string, value: any }) {
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
      return [R.clone(this.objects.get(arg))]
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
    return this.objects[Symbol.iterator]
  }
}

function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, where: (a: T1, b: T2) => boolean): IndexedSet<[I1, I2], [T1, T2]>
function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, match: [string, string]): IndexedSet<[I1, I2], [T1, T2]>
function join<I1, T1, I2, T2>(set1: IndexedSet<I1, T1>, set2: IndexedSet<I2, T2>, match: [string, string] | ((a: T1, b: T2) => boolean)): IndexedSet<[I1, I2], [T1, T2]> {
  
  const final = new (class extends IndexedSet<[I1, I2], [T1, T2]> {
    id([t1, t2]: [T1, T2]): [I1, I2] { return [set1.id(t1), set2.id(t2)] }
  })

  if (R.is(Array, match) && where.length === 2) {
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
      if (where(x[1], y[1])) final.add([x[1], y[1]])
    }
  }
  return final;
}  

interface Person {
  id: number | string, 
  name: string 
}

interface Book {
  owner: number | string // person 
  name: string,
  id: number | string 
}


function testIndexedSet() {
  const i = new (class PersonT extends IndexedSet<number | string, Person> {
    id(p: Person) { return p.id}
  })

  i.add({id: 1, name: "A"})
  i.addIndex((x:{name: string}) => x.name, 'name')
  console.log(i.get({name: 'A'}))

  const i2 = new (class BookT extends IndexedSet<number | string, Book> {
    id(p: Book) { return p.id}
  })
  i2.addIndex(R.prop('owner'), 'owner')
  i2.add({id: 12312, name: 'a;sdfksdf', owner: 1})
  i2.add({id: 23413, name: 'DWEasdfwere', owner: 1})
  i2.add({id: 350423, name: 'eqerqr3', owner: 2})

  console.log(join(i, i2, ['id', 'owner']))
}

// testIndexedSet()

// probably don't need this class in hindsight since
// TS allows returning [T] as a type for get above so it's easy to unpack
// maybe someone wants to clearly have a 1:1 mapping only but other than that
// no need for this. 


// index where we know it's 1:1 mapping
// type SingleIndex<I, Id, T> = { id: (t: T) => I, index: Map<I, Id> }



// // concept: multiple 1:1 indexes for a particular data type. 
// // in other words, more than one key on the same data 
// export class MultiKeySet<Id, T> {
//   objects: Map<Id, T>
//   id: (t: T) => Id
//   // this any type in the Index is annoying but I can't think of another solution
//   indexes: { [name: string]: SingleIndex<any, Id, T> }

//   constructor(id: (t: T) => Id) {
//     this.objects = new Map()
//     this.id = id
//     this.indexes = {}
//   }

//   add(object: T) {
//     this.objects.set(this.id(object), object)
//     R.map(i => i.index.set(i.id(object), this.id(object)), this.indexes)
//   }

//   remove(object: T) {
//     this.objects.delete(this.id(object))
//     R.map(i => i.index.delete(i.id(object)), this.indexes)
//   }

//   get(id: Id): T | undefined
//   // intention: call like this get({index_name: value})
//   // making a typescript type that accepts one dynamic key is possible
//   // but very hard, because it blurs into dependently typed language 
//   // stuff, so i will just use convention here. 
//   get(onekey: { [s: string]: any }): T | undefined
//   get({ name, value }: { name: string, value: any }): T | undefined
//   get(arg: Id | {[s: string]: any} | { name: string, value: any }) {
//    const test = (x: any): x is Id => typeof x !== 'object';
//     if (!test(arg)) {
//       if (Object.keys(arg).length === 1) {
//         const name = Object.keys(arg)[0];
//         const id = this.indexes[name].index.get((arg as {[s:string]: any})[name])
//         return id && this.objects.get(id)
//       } else {
//         const {name, value} = arg
//         const id = this.indexes[name].index.get(value)
//         return id && this.objects.get(id)
//       }
//     } else {
//       // single value, should resolve directly to an object.
//       return this.objects.get(arg)
//     }
//   }

//   addIndex<I>(id: (t: T) => I, name?: string) {
//     let m = new Map();
//     for (let [k, v] of this.objects.entries()) {
//       m.set(id(v), k)
//     }
//     this.indexes[name ?? id.name] = { id, index: m }
//   }

//   removeIndex(name: string) {
//     delete this.indexes[name]
//   }
// }

