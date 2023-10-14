import m from 'mithril';
import {MainView, IdeaView, ScenarioView} from './views/views'
import {State, Actions, IdeaT, ScenarioT} from './viewmodel'

let DB: State; 

Actions.load().then(data => {
  DB = data;
  console.log('[INFO] Initial DB is: ', DB);

  //@ts-ignore(2584) vscode ts can't find the dom library but everything works...
  m.route(document.getElementById('app'), '/', {
    '/': MainView(DB), 
    '/idea/:id': IdeaView(DB), 
    '/scenario/:id': ScenarioView(DB), 
  })
})

