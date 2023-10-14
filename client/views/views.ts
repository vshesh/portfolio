import m from 'mithril';
import * as R from 'ramda';
import { State, Actions } from '../viewmodel';
import { Idea, Formula, Scenario, Assessment, Roadmap, Quantity, isCertain } from '../model';
import { CDFPlot, TornadoPlot } from './plots';
import {map} from '../db'
import { CE, LabeledNumber, FormulaText, InputView, FormulaInputView } from './components';

export function MainView(db: State) {
  return {
    view: ({attrs: {}}) => 
      m('div.main-view', 
        m('div.nav-bar', 
          m('button.save', {onclick: () => Actions.save(db)}, 'Save')),
        m('h1.title', 'DA Product Valuations'),
          map(db.ideas, idea => 
          m('div.idea-summary', {onclick: () => {console.log('clicked'); m.route.set(`/idea/:id`, {id: idea.id})}},
            m('h3.name', idea.name), 
            m('p.description', idea.description), 
            m('p.proposer', idea.proposer ?? ""))), 
        m('button', {onclick: () => {db.ideas.add(new Idea('New Idea', 'Fill in a description'))}}, '+ Add Idea'))
  }
}


export function IdeaView(db: State) {
  return {
    view({attrs: {id}}: {attrs: {id: string}}) {
      const idea = db.ideas.get(id)!;
      return m('div.idea-view', m(CE, {selector: 'h1.title', value: idea.name, onchange: (name: string) => db.ideas.upsert(Object.assign(idea, {name: name}))}), m('p.description', idea.description), m('p.proposer', idea.proposer ?? ""), 
        m('div.scenarios', db.scenarios.get({'idea': id}).map(s => m(ScenarioSummary, {scenario: s, update: (s) => db.scenarios.upsert(s)})), 
        m('div.scenario-summary.new', { onclick: () => db.scenarios.add(new Scenario('value = price * reach', 'New Scenario', idea.id)) }, m('span', '+ Add Scenario'))))
    }
  }
}


const OpportunitySummary = {
  view({attrs: {opportunity, update}}: {attrs: {opportunity: Assessment, update: (o: Quantity) => any}}) {
    return m('div.opportunity', 
      m('div.outputs',
        m('div.stats',
          m(LabeledNumber, {number: R.mean(opportunity.samples), label: "Mean"}),
          m(LabeledNumber, {postunit: '%', number: 100 * opportunity.quantile(R.mean(opportunity.samples)), label: "MeanQ"}),
          m(LabeledNumber, {number: R.median(opportunity.samples), label: 'Median'}),
          m(LabeledNumber, {postunit: '%', number: 100* R.filter(x => x < 0, opportunity.samples).length / opportunity.samples.length, label: 'Loss Chance'})),
        m(CDFPlot(opportunity.quantileF())),
        m(TornadoPlot(opportunity.sensitivity()))
      ),
      m('div.inputs',
        m(FormulaText, { formula: opportunity.model.formulaString(), update: (s: string) => {opportunity.model = new Formula(s);} }),
        m('div.spts',
          opportunity.model.inputs.map(
            x => { 
              let input = opportunity.inputs[x];
              return m(InputView, {
                name: x,
                input: input.estimate,
                update: (values: typeof input.estimate) => {
                  input.estimate = values;
                  update(input)
                }
              }) 
            }
          )))
    )
  }
}

const ScenarioSummary = {
  view: ({ attrs: { scenario, update } }: { attrs: { scenario: Scenario, update: (s: Scenario) => any } }) => {
    return m('div.scenario-summary',
      m('div.top-bar',
        m(CE, {selector: 'span.name', onchange: (s: string) => {scenario.name = s; update(scenario)}, value: scenario.name}),
        m('button', m('a', { href: `#!/scenario/${scenario.id}` }, '>'))),
      m(OpportunitySummary, {opportunity: scenario.opportunity, update: (q) => {scenario.opportunity.set(q.name, q); update(scenario)}})  
    )
  }
}


export const OpportunityView = {
  view({attrs: {opportunity, update}}: {attrs: {opportunity: Assessment, update: (o: Assessment) => any}}) {
      return m('div.opportunity', 
        m(FormulaText, { formula: opportunity.model.formulaString(), update: (s: string) => {opportunity.model = new Formula(s)} }),
        m(FormulaInputView, {  opportunity }),
        m('div.rationales', 
          R.map(input => !isCertain(input) && m('div.input-rationale', 
              m(FormulaText, {title: 'Rationale for Low Side', formula: input.rationales.low, update: (s) => { opportunity.patch(input.name, {rationales: {low: s}}); update(opportunity) }}),
              m(InputView, {
                name: input.name,
                input: input.estimate,
                update: (values) => {opportunity.patch(input.name, {estimate: values}); update(opportunity)}
              }),
              m(FormulaText, {title: 'Rationale for High Side', formula: input.rationales.high, update: (s) => { opportunity.patch(input.name, {rationales: {low: s}}); update(opportunity) }}),
            ), opportunity.inputs))
        )
  }
} 

export function ScenarioView(db: State) {
  return {
    view({attrs: {id}}: {attrs: {id: Scenario['id']}}) {
      const scenario = db.scenarios.get(id)!;
      return m("div.scenario",
        m('h1.name[contenteditable=true]', m.trust(scenario.name)),
        m(OpportunityView, {opportunity: scenario.opportunity, update: (o) => {
          /* opportunity is modified in place, no need for `scenario.opportunity = o` here.*/ 
          db.scenarios.upsert(scenario)}}))
    }
  }
}

