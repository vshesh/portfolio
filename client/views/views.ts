import m from 'mithril';
import * as R from 'ramda';
import { State } from '../viewmodel';
import { Idea, Formula, Scenario, Assessment, Roadmap, Quantity, isCertain } from '../model';
import { map } from '../db'
import { CE, FormulaText, InputView, FormulaInputView, AssessmentOutputsView, AssessmentInputsView, QuantityHeader, QuantityView, Tabs, RoadmapView } from './components';



export function MainView(db: State) {
  return {
    view: ({ attrs: { } }) =>
      m('div.main-view',
        m('h1.title', 'DA Product Valuations'),
        map(db.ideas, idea =>
          m('div.idea-summary', { onclick: () => { console.log('clicked'); m.route.set(`/idea/:id`, { id: idea.id }) } },
            m('h3.name', idea.name),
            m('p.description', idea.description),
            m('p.proposer', idea.proposer ?? ""))),
        m('button', { onclick: () => { db.ideas.add(new Idea('New Idea', 'Fill in a description')) } }, '+ Add Idea'))
  }
}


export function IdeaView(db: State) {
  return {
    view({ attrs: { id } }: { attrs: { id: string } }) {
      const idea = db.ideas.get(id)!;
      return m('div.idea-view', m(CE, { selector: 'h1.title', value: idea.name, onchange: (name: string) => db.ideas.upsert(Object.assign(idea, { name: name })) }), m('p.description', idea.description), m('p.proposer', idea.proposer ?? ""),
        m('div.scenarios', db.scenarios.get({ 'idea': id }).map(s => m(ScenarioSummary, { scenario: s, update: (s) => db.scenarios.upsert(s) })),
          m('div.scenario-summary.new', { onclick: () => db.scenarios.add(new Scenario('value = price * reach', 'New Scenario', idea.id)) }, m('span', '+ Add Scenario'))))
    }
  }
}


const OpportunitySummary = {
  view({ attrs: { opportunity, update } }: { attrs: { opportunity: Assessment, update: (o: Quantity) => any } }) {
    return m('div.opportunity',
      m(AssessmentOutputsView, { assessment: opportunity }),
      m('div.inputs',
        m(AssessmentInputsView, { assessment: opportunity, update }))
    )
  }
}


const ScenarioSummary = {
  view: ({ attrs: { scenario, update } }: { attrs: { scenario: Scenario, update: (s: Scenario) => any } }) => {
    return m('div.scenario-summary',
      m('div.top-bar',
        m(CE, { selector: 'span.name', onchange: (s: string) => { scenario.name = s; update(scenario) }, value: scenario.name }),
        m('button', m('a', { href: `#!/scenario/${scenario.id}` }, '>'))),
      m(OpportunitySummary, { opportunity: scenario.opportunity, update: (q) => { scenario.opportunity.set(q.name, q); update(scenario) } })
    )
  }
}


export const OpportunityView = {
  view({ attrs: { assessment, update } }: { attrs: { assessment: Assessment, update: (o: Assessment) => any } }) {
    return m('div.opportunity',
      m(FormulaText, { formula: assessment.model.formulaString(), update: (s: string) => { assessment.model = new Formula(s) } }),
      m(FormulaInputView, { assessment }),
      m('div.rationales',
        R.map(input => !isCertain(input) && m('div.input-rationale',
          m(QuantityView, { quantity: input, update: (quantity, prop, value) => { assessment.patch(input.name, { [prop]: value }) } }),
        ), R.values(assessment.inputs)))
    )
  }
}

export function ScenarioView(db: State) {
  return {
    view({ attrs: { id } }: { attrs: { id: Scenario['id'] } }) {
      const scenario = db.scenarios.get(id)!;
      return m("div.scenario",
        m(CE, { selector: 'h1.name', value: scenario.name, onchange: (s: string) => { scenario.name = s; db.scenarios.upsert(scenario) } }),
        m(CE, { selector: 'div.description', value: scenario.description, onchange: (s: string) => { scenario.description = s; db.scenarios.upsert(scenario) } }),
        m(Tabs(), {
          'Roadmap': m(RoadmapView, {
            roadmap: scenario.roadmap, 
            update: (r) => {scenario.roadmap = r; db.scenarios.upsert(scenario)}
          }),
          'Opportunity': m(OpportunityView, {
            assessment: scenario.opportunity, update: (o) => {
              /* opportunity is modified in place, no need for `scenario.opportunity = o` here.*/
              db.scenarios.upsert(scenario)
            }
          }),
        })
      )
    }
  }
}

