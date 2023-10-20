import m from 'mithril';

// supertype of mithril components, at least as I write them.
type ViewFunction = {view: ({attrs: x}: {attrs: any}) => any}
type Attrs<T extends ViewFunction > = Parameters<(T)['view']>[0]['attrs']

export interface Fixture<T extends ViewFunction> {
  component: T,
  name: string,
  attrs: Attrs<T>,
}

export interface Fixtures<T extends ViewFunction> {
  name: string,
  component: T,
  stories: {name: string, style?: {[s: string]: string}, attrs: Attrs<T>}[]
}

export const ShowFixtures = {
  view<T extends ViewFunction>({attrs}: {attrs: Fixtures<T>}) {
    return m('div.fixture', 
      m('h1.title', attrs.name),
      m('div.stories', 
        attrs.stories.map(story => m('div.story', m('h3.story-name', story.name), m('div.rendering', {style: story.style ?? undefined}, m(attrs.component, story.attrs)))))
    )
  }
}

