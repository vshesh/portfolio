import m from 'mithril'
import * as R from 'ramda'
import * as fixtures from './basic_components'
import {ShowFixtures} from './fixtures'

//@ts-ignore
m.mount(document.getElementById('storybook'), {
  view() {
    console.log('fixtures', R.values(fixtures))
    return m('div.storybook', R.values(fixtures).map(
      fixture => m('div.fixture', m(ShowFixtures, R.tap(x => console.log(x), fixture)))
    ))
  }
})
