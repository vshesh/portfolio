import { meiosisSetup } from 'meiosis-setup';
import { MeiosisCell, MeiosisViewComponent } from 'meiosis-setup/types';
import m from 'mithril';
import { SPTInput } from './metalog';
import { Scenario, Model, ASTTree, isLeaf, branch } from './model'
import * as Plot from '@observablehq/plot';
import * as R from 'ramda';
import meiosisTracer from 'meiosis-tracer';

interface State {
  models: { [name: string]: Model },
  scenarios: Scenario[]
}

const actions = {
  add_scenario(cell: MeiosisCell<State>) {
    return cell.update({ scenarios: (s: Scenario[]) => R.concat(s, [R.clone(R.last(s)!)]) })
  },
  scenario: {
    update_inputs(cell: MeiosisCell<State>, scenario: Scenario, input: string, values: SPTInput) {
      scenario.set(input, values)
    },
    update_formula(cell: MeiosisCell<State>, scenario: Scenario, formula: string) {
      console.log('action: update_formula')
      scenario.model = new Model(formula);
    },
    update_name(cell: MeiosisCell<State>, scenario: Scenario, name: string) {
      scenario.name = name;
    }
  }
};

const FormulaText = {
  view({ attrs: { formula, update } }: { attrs: { formula: string, update: (s: string) => any } }) {
    return m('div.formula',
      m('p', 'Formula:'),
      m('textarea', { onblur: (e: { target: { value: string } }) => update(e.target.value) }, formula))
  }
}

const ScenarioView = {
  view: ({ attrs: { scenario, cell } }: { attrs: { scenario: Scenario, cell: MeiosisCell<State> } }) => {
    return m('div.scenario',
      m('div.inputs',
        m('p', "Name: ",
          m('input', { type: 'field', oninput: (e: { target: { value: string } }) => actions.scenario.update_name(cell, scenario, e.target.value) }, scenario.name),
          m('button', m('a', { href: `#!/scenario/${scenario.id}` }, 'Inspect'))),
        m(FormulaText, { formula: scenario.model.formulaString(), update: (s: string) => actions.scenario.update_formula(cell, scenario, s) }),
        m('div.spts',
          scenario.model.inputs.map(
            x => m(SPTInputView, {
              name: x,
              input: scenario.inputs[x],
              update: (values: SPTInput) => actions.scenario.update_inputs(cell, scenario, x, values)
            })))),
      m('div.outputs',
        m('div.stats',
          m('p', 'Mean: ', R.mean(scenario.samples).toFixed(2)),
          m('p', 'MeanQ: ', scenario.quantile(R.mean(scenario.samples)).toFixed(2)),
          m('p', 'Median: ', R.median(scenario.samples).toFixed(2))),
        m(CDFPlot(scenario.quantileF())),
        m(TornadoPlot(scenario.sensitivity()))
      ))
  }
}

const SPTInputView = {
  view: ({ attrs: { name, input, update } }: { attrs: { name: string, input: SPTInput, update: (v: SPTInput) => unknown } }) =>
    m('div.spt-input',
      m('h4', name),
      m('div.input-stack',
        (['min', 'low', 'med', 'high', 'max'] as (keyof SPTInput)[]).map(q =>
          m('input', {
            type: 'number', value: input[q],
            oninput: (e: { target: { value: string } }) => update(Object.assign(input, {
              [q]: e.target.value ? /-?\d+(\.\d*)?([eE]\d+)?/.test(e.target.value) ? +e.target.value : input[q] : null
            }))
          })),
      )
    )
}


function cdfplot(f: (n: number) => number) {
  let data = R.range(1, 100).map(x => [f(x / 100), x / 100]);
  return Plot.plot({
    x: {
      label: 'value'
    },
    y: {
      label: 'quantile',
      grid: true,
      ticks: R.range(0, 11).map(x => x / 10),
    },
    marks: [
      Plot.lineY(data, { x: d => d[0], y: d => d[1], stroke: 'grey' }),
      Plot.ruleY([0.1, 0.5, 0.9], { y: d => d, x1: f(0.01), x2: d => f(d), stroke: 'lightgreen' }),
      Plot.ruleX([0.1, 0.5, 0.9], { x: d => f(d), y1: 0, y2: d => d, stroke: 'lightgreen' })
    ]
  })
}

// f is a quantile function that maps the range [0,1] to the distribution. 
// f: "given a quantile return the corresponding value in the distribution"
function CDFPlot(f: (n: number) => number) {
  return {
    oncreate: function (vnode: m.VnodeDOM) {
      const chart = cdfplot(f);
      vnode.dom.append(chart);
    },

    view: function (vnode: m.VnodeDOM) {
      return m('div.cdf-plot')
    }
  }
}

function TornadoPlot(data: { variable: string, value: [number, number, number] }[]) {
  return {
    oncreate: function (vnode: m.VnodeDOM) {
      vnode.dom.append(tornadoplot(data))
    },
    view: function (vnode: m.VnodeDOM) {
      return m('div.tornado-plot')
    }
  }
}

function tornadoplot(data: { variable: string, value: [number, number, number] }[]) {
  return Plot.plot({
    marginLeft: 80,
    x: {
      label: 'value'
    },
    y: { label: '' },
    marks: [
      Plot.barX(R.sortBy(d => Math.abs(d.value[2] - d.value[0]), data), {
        y: 'variable',
        fillOpacity: 0.5,
        fill: 'grey',
        //fill: d => Math.abs(d.value[2] - d.value[0]), 
        x1: d => d.value[0],
        x2: d => d.value[2],
      }),
      Plot.ruleX([data[0].value[1]])
    ]
  })
}

const app: MeiosisViewComponent<State> = {
  initial: {
    models: R.map(x => new Model(x), {
      'maker-wtp-model': `
      reach = endusers * (1 - cann)
      tlift = reach * (lift * wtp - cost)
      devtime = (0.25 + log(endusers) / log(120) * ntools * tptool)
      value = nmakers * (ntools * tlift - (devtime * devcost + devlic))`,
      'basic-wtp-model': "value = reach * (wtp * price - cost) - fixed_cost"
    }),
    scenarios: [new Scenario(new Model(`
      reach = endusers * (1 - cann)
      tlift = reach * (lift * wtp - cost)
      devtime = (0.25 + log(endusers) / log(120) * ntools * tptool)
      value = nmakers * (ntools * tlift - (devtime * devcost + devlic))`))]
  },
  view: (cell) =>
    m('div.app',
      m('h1', 'DA Product Value Scenarios'),
      m('div.scenarios',
        cell.state.scenarios.map(s => m(ScenarioView, { cell: cell, scenario: s })),
        m('div.scenario.new', { onclick: () => actions.add_scenario(cell) }, m('span', '+ Add Scenario')))
    )
};

const ScenarioFocus = {
  view: ({ attrs: { cell, id } }: { attrs: { cell: MeiosisCell<State>, id: string } }) => {
    const scenario = R.find(x => x.id === id, cell.getState().scenarios)!
    return m("div.scenario-focus",
      m('h1.name[contenteditable=true]', m.trust(scenario.name)),
      m(FormulaText, { formula: scenario.model.formulaString(), update: (s: string) => actions.scenario.update_formula(cell, scenario, s) }),
      m(FormulaInputView, { cell, scenario }))
  }
}

const FormulaInputView = {
  view({ attrs: { cell, scenario } }: { attrs: { cell: MeiosisCell<State>, scenario: Scenario } }) {
    return m('div.formula-input-view',
      scenario.model.formulas.map(
        f => m('div.formula-view', m('span.variable', f[1]), m('span.equals', `=`), this.construct(f[2], scenario, cell))
      )
    )
  },

  construct(formula: ASTTree, scenario: Scenario, cell: MeiosisCell<State>): m.Vnode<any, any> {
    if (isLeaf(formula)) {
      if (typeof formula === 'number') {
        return m('span.number', `${formula}`)
      } else {
        if (R.includes(formula, scenario.model.derived_vars)) {
          return m('span.variable', `${formula}`);
        }
        return m(SPTInputView, {
          name: formula,
          // in this case formula is a variable
          input: scenario.inputs[formula],
          update: (v) => actions.scenario.update_inputs(cell, scenario, formula, v)
        })
      }
    };
    const children = formula.slice(1).map(x => this.construct(x, scenario, cell))
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


const cells = meiosisSetup<State>({ app });

// meiosisTracer({ selector: "#tracer", streams: [cells().states] })

// @ts-ignore (TS can't find document and HTMLElement even though lib dom is included.)
m.route(document.getElementById('app') as HTMLElement, '/', {
  '/': {
    view: () => app.view(cells())
  },
  '/scenario/:id': {
    view: (vnode) => m(ScenarioFocus, { cell: cells(), id: vnode.attrs.id })
  }
});

