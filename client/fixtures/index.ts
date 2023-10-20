import m from 'mithril'
import * as R from 'ramda'
import * as fixtures from './basic_components.f'
import {ShowFixtures} from './fixtures'

  //@ts-ignore
  m.mount(document.getElementById('app'), {
    view() {
      console.log('fixtures', R.values(fixtures))
      return m('div.storybook', 
      m('div.sidebar', m('div.nav-bar', R.values(fixtures).map(x => m('div.nav-item', x.name)))),
      m('div.main-panel',
      R.values(fixtures).map(
        fixture => m(ShowFixtures, fixture)
      )))
    }
  })
