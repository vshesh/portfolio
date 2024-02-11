import m from 'mithril';
import { MainView, IdeaView, ScenarioView } from './views/views'
import { State, Actions, IdeaT, ScenarioT } from './viewmodel'

let DB: State = {
  ideas: null,
  scenarios: null
};

const StartPage = {
  view: () => {
      return m('div.start-view',
        m('input[type=file]', {
          onchange: (e) => {
            e.target.files[0].text().then((data: string) => {
              DB = Actions.upload(data)
              console.log("Initial DB", DB);
              m.redraw();
            })
          }
        }))
  }
}

const Frame = (...views: any[]) => ({
  view: ({ attrs }: { attrs: any }) => {
    return m('div.app', m('div.nav-bar',
    m('button.save', { onclick: () => Actions.download('db.json', DB) }, 'Save')),
      ...views.map(x => m(x, attrs)))
  }
})

//@ts-ignore(2584) vscode ts can't find the dom library but everything works...
m.route(document.getElementById('app'), '/', {
  //@ts-ignore the mithril types library has some poor type narrowing in more complex use cases,
  // like vnode children cases.
  '/': {view: () => DB.ideas && DB.scenarios ? m(Frame(MainView(DB))) : m(StartPage)},
  '/idea/:id': Frame(IdeaView(DB)),
  '/scenario/:id': Frame(ScenarioView(DB)),
})

