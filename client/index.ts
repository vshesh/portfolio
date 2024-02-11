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

            //@ts-ignore(2584) vscode ts can't find the dom library but everything works...
            m.route(document.getElementById('app'), '/', {
              //@ts-ignore the mithril types library has some poor type narrowing in more complex use cases,
              // like vnode children cases.
              '/': Frame(MainView(DB)),
              '/idea/:id': Frame(IdeaView(DB)),
              '/scenario/:id': Frame(ScenarioView(DB)),
            })

          })
        }
      }),
      // TODO(vishesh) not good design, figure out  how to do this properly
      m('button', {onclick: (e) => {
            DB = {
              ideas: new IdeaT(),
              scenarios: new ScenarioT()
            }
            //@ts-ignore(2584) vscode ts can't find the dom library but everything works...
            m.route(document.getElementById('app'), '/', {
              //@ts-ignore the mithril types library has some poor type narrowing in more complex use cases,
              // like vnode children cases.
              '/': Frame(MainView(DB)),
              '/idea/:id': Frame(IdeaView(DB)),
              '/scenario/:id': Frame(ScenarioView(DB)),
            })
      }}, 'Start New')
    )
  }
}

const Frame = (...views: any[]) => ({
  view: ({ attrs }: { attrs: any }) => {
    return m('div.app', m('div.nav-bar',
      m('button.save', { onclick: () => Actions.download('db.json', DB) }, 'Save')),
      ...views.map(x => m(x, attrs)))
  }
})

m.mount(document.getElementById('app'), StartPage);

