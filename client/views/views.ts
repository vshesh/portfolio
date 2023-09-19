import m from 'mithril';
import * as R from 'ramda';
import { State, Actions } from '../viewmodel';
import { SPTInput } from '../metalog';
import { ASTTree, Idea, isLeaf, Model, Scenario } from '../model';
import { CDFPlot, TornadoPlot } from './plots';
import {map} from '../db'

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
      return m('div.idea-view', m('h1.title', idea.name), m('p.description', idea.description), m('p.proposer', idea.proposer ?? ""), 
        m('div.scenarios', db.scenarios.get({'idea': id}).map(s => m(ScenarioSummary, {scenario: s, update: (s) => db.scenarios.upsert(s)})), 
        m('div.scenario-summary.new', { onclick: () => db.scenarios.add(new Scenario(new Model('value = price * reach'), 'New Scenario', idea.id)) }, m('span', '+ Add Scenario'))))
    }
  }
}

const CE = {
  // @ts-ignore
  view: ({attrs: {selector, onchange, value}}) => {
    // @ts-ignore
    return m(selector, {contentEditable: true, onblur: (e) => onchange(e.target.innerText)}, m.trust(value))
  }
}

const LabeledNumber = {
  view: ({attrs: {label, number}}) => {
    return m('span.labeled-number', m('span.label', label), m('span.number', number.toLocaleString('en-US', {maximumFractionDigits: 0})))
  }
}

const ScenarioSummary = {
  view: ({ attrs: { scenario, update } }: { attrs: { scenario: Scenario, update: (s: Scenario) => any } }) => {
    return m('div.scenario-summary',
      m('div.top-bar',
        m(CE, {selector: 'span.name', onchange: (s: string) => {scenario.name = s; update(scenario)}, value: scenario.name}),
        m('button', m('a', { href: `#!/scenario/${scenario.id}` }, '>'))),
      m('div.outputs',
        m('div.stats',
          m(LabeledNumber, {number: R.mean(scenario.samples), label: "Mean"}),
          m(LabeledNumber, {number: scenario.quantile(R.mean(scenario.samples)), label: "MeanQ"}),
          m(LabeledNumber, {number: R.median(scenario.samples), label: 'Median'}),
          m(LabeledNumber, {number: 100* R.filter(x => x < 0, scenario.samples).length / scenario.samples.length, label: 'Loss Chance'})),
        m(CDFPlot(scenario.quantileF())),
        m(TornadoPlot(scenario.sensitivity()))
      ),
      m('div.inputs',
        m(FormulaText, { formula: scenario.model.formulaString(), update: (s: string) => {scenario.model = new Model(s); update(scenario)} }),
        m('div.spts',
          scenario.model.inputs.map(
            x => m(SPTInputView, {
              name: x,
              input: scenario.inputs[x],
              update: (values: SPTInput) => {scenario.set(x, values); update(scenario)}
            })))),
      )
  }
}


const SPTInputView = {
  view: ({ attrs: { name, input, update, simple } }: { attrs: { name: string, input: SPTInput, update: (v: SPTInput) => unknown , simple?: boolean} }) =>
    m('div.spt-input',
      m('h4', name),
      m('div.input-stack',
        ((simple ? ['low', 'med', 'high'] : ['min', 'low', 'med', 'high', 'max']) as (keyof SPTInput)[]).map(q =>
          m('input', {
            type: 'number', value: input[q],
            oninput: (e: { target: { value: string } }) => update(Object.assign(input, {
              [q]: e.target.value ? /-?\d+(\.\d*)?([eE]\d+)?/.test(e.target.value) ? +e.target.value : input[q] : null
            }))
          })),
      )
    )
}


const PersonBubble = {
  view: ({attrs: {name, color}}: {attrs: {name: string, color: string}}) => {
    return m('span.person-bubble', {title: name, style: {'background-color': color, color: '#eee'}},  m('span', name.split(' ').slice(0,2).map(x => x[0])))
  }
}


export function ScenarioView(db: State) {
  return {
    view({attrs: {id}}: {attrs: {id: Scenario['id']}}) {
      const scenario = db.scenarios.get(id)!;
      return m("div.scenario",
        m('h1.name[contenteditable=true]', m.trust(scenario.name)),
        m(FormulaText, { formula: scenario.model.formulaString(), update: (s: string) => {scenario.model = new Model(s)} }),
        m(FormulaInputView, {  scenario }),
        m('div.rationales', 
          scenario.model.inputs.map(input => 
            m('div.input-rationale', 
              m(FormulaText, {title: 'Rationale for Low Side', formula: scenario.rationales[input].low, update: (s) => {scenario.rationales[input].low = s; db.scenarios.upsert(scenario)}}),
              m(SPTInputView, {
                name: input,
                input: scenario.inputs[input],
                update: (values: SPTInput) => {scenario.set(input, values); db.scenarios.upsert(scenario)}
              }),
              m(FormulaText, {title: 'Rationale for High Side', formula: scenario.rationales[input].high, update: (s) => {scenario.rationales[input].high = s; db.scenarios.upsert(scenario)}}),
            ))))      
    }
  }
}

// FORMULA views

const FormulaText = {
  view({ attrs: { formula, update, title } }: { attrs: { formula: string, title?: string, update: (s: string) => any } }) {
    return m('div.formula',
      m('p', title ?? 'Formula:'),
      m('textarea', { onblur: (e: { target: { value: string } }) => update(e.target.value) }, formula))
  }
}


const FormulaInputView = {
  view({ attrs: { scenario } }: { attrs: {  scenario: Scenario } }) {
    return m('div.formula-input-view',
      scenario.model.formulas.map(
        f => m('div.formula-view', m('span.variable', f[1]), m('span.equals', `=`), this.construct(f[2], scenario))
      )
    )
  },

  construct(formula: ASTTree, scenario: Scenario ): m.Vnode<any, any> {
    if (isLeaf(formula)) {
      if (typeof formula === 'number') {
        return m('span.number', `${formula}`)
      } else {
        if (R.includes(formula, scenario.model.derived_vars)) {
          return m('span.variable', `${formula}`);
        }
        return m(SPTInputView, {
          name: formula,
          // in this case formula is a variable name
          input: scenario.inputs[formula],
          update: (v) => {scenario.set(formula, v)}
        })
      }
    };
    const children = formula.slice(1).map(x => this.construct(x, scenario))
    if (!(/\w+/.test(formula[0]))) {
      // @ts-ignore (R.intersperse is typed wrong!)
      const term = R.intersperse(m('span.operator', { '+': '+', '-': '-', '*': '×', '/': '÷' }[formula[0]]), children)
      if (formula[0] === '+' || formula[0] === '-') {
        return m('span.factor', m('span.open-bracket', ``), ...term, m('span.closed-bracket', ``))
      }
      return m('span.factor', ...term);
    } else {
      // @ts-ignore (R.intersperse is typed wrong!)
      return m('span.function', m('span.variable', `${formula[0]}`), m('span.open-bracket'), ...R.intersperse(",", children), m('span.closed-bracket'))
    }
  }
}

