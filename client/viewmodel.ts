import { IndexedSet, map } from "./db";
import { Idea, Scenario } from "./model";
import m from 'mithril';
import * as R from 'ramda';

export class IdeaT extends IndexedSet<string, Idea> {
  id(i: Idea) {return i.id;}
}

export class ScenarioT extends IndexedSet<string, Scenario> {
  id(s: Scenario) {return s.id; }
  public constructor(iterable?: Iterable<Scenario>) {
    super(iterable) 
    this.addIndex(s => s.idea, 'idea')
  }
}

export interface State {
  ideas: IdeaT, 
  scenarios: ScenarioT
}

export function isState(s: any): s is State {
  return R.is(Object, s) && R.is(Object, s.ideas) && R.is(Object, s.scenarios)
}


export function serialize(db: State) {
  return {
    ideas: map(db.ideas, (idea) => idea.serialize()),
    scenarios: map(db.scenarios, (scenario) => scenario.serialize())
  }
}

export class Actions {
  static save(DB: State) {
    const data = serialize(DB);
    console.log('[INFO] Actions.save', data);
    m.request({
      method: 'PUT',
      url: '/save',
      body: data
    }).then(data => {
      return data;
    })
  }

  static load() {
    return m.request({method: 'GET', url: '/load'}).then((data) => {
      console.log('[INFO] Actions.load: Data received ', data);
      const result = {
        // @ts-ignore
        ideas: new IdeaT(data.ideas.map(Idea.deserialize)),
        // @ts-ignore
        scenarios: new ScenarioT(data.scenarios.map(Scenario.deserialize))
      };
      console.log('[INFO] Actions.load: Parsed result', result);
      return result;
    })
  }


  static download(filename: string, contents: State): any
  static download(filename: string, contents: string): any
  static download(filename: string, contents: string | State) {
    // @ts-ignore document is not showing up
    var D = document;
    var element = D.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(isState(contents) ? JSON.stringify(serialize(contents), null, 2) : contents));
    element.setAttribute('download', filename);
    element.style.display = 'none';

    D.body.appendChild(element);
    element.click();
    D.body.removeChild(element);
  }

  // converts given contents into a new DB object and returns it. 
  static upload(contents: string): State {
    const data = JSON.parse(contents);
    return {
      ideas: new IdeaT(data.ideas.map(Idea.deserialize)),
      scenarios: new ScenarioT(data.scenarios.map(Scenario.deserialize))
    }
  }
}
