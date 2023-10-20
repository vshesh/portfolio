import m from 'mithril';
import {MainView, IdeaView, ScenarioView} from './views/views'
import {State, Actions, IdeaT, ScenarioT} from './viewmodel'

let DB: State; 


const Frame =  (...views: any[]) => ({
    view: ({attrs}: {attrs: any}) => 
      m('div.app', m('div.nav-bar', 
        m('button.save', {onclick: () => Actions.save(DB)}, 'Save')), 
        ...views.map(x => m(x, attrs)))
  })

Actions.load().then(data => {
  DB = data;
  console.log('[INFO] Initial DB is: ', DB);

  //@ts-ignore(2584) vscode ts can't find the dom library but everything works...
  m.route(document.getElementById('app'), '/', {
    //@ts-ignore the mithril types library has some poor type narrowing in more complex use cases,
    // like vnode children cases.
    '/': Frame(MainView(DB)),
    '/idea/:id': Frame(IdeaView(DB)),
    '/scenario/:id': Frame(ScenarioView(DB)),
  })
})

