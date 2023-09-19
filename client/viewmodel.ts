import { IndexedSet, map } from "./db";
import { Idea, Scenario } from "./model";
import m from 'mithril';

export class IdeaT extends IndexedSet<string, Idea> {
  id(i: Idea) {return i.id;}
}

export class ScenarioT extends IndexedSet<string, Scenario> {
  id(s: Scenario) {return s.id; }
  public constructor(iterable: Iterable<Scenario>) {
    super(iterable) 
    this.addIndex(s => s.idea, 'idea')
  }
}

export interface State {
  ideas: IdeaT, 
  scenarios: ScenarioT
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
}
