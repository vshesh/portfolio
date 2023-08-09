import { meiosisSetup } from 'meiosis-setup';
import { MeiosisCell, MeiosisViewComponent } from 'meiosis-setup/types';
import m from 'mithril';
import {Scenario, Model, SPTInput} from './model'
import * as Plot from '@observablehq/plot';
import * as R from 'ramda';

interface State {
  models: {[name:string]: Model},
  scenarios: Scenario[]
}

const actions = {
  scenario: {
    update_inputs(cell: MeiosisCell<State>, scenario: Scenario, input: string, values: SPTInput) {
      scenario.set(input, values)
    },
    update_formula(cell: MeiosisCell<State>, scenario: Scenario, formula: string) {
      scenario.model = new Model(formula);
    },
    update_name(cell: MeiosisCell<State>, scenario: Scenario, name: string ){
      scenario.name = name;
    }
  }
};

const ScenarioView = {
  view: ({attrs: {scenario, cell}}: {attrs: {scenario: Scenario, cell: MeiosisCell<State>}}) => {
    return m('div.scenario',
      m('div.inputs', 
        m('p', "Name: ", m('input', {type: 'field', oninput: (e) => actions.scenario.update_name(cell, scenario, e.innerText)}, scenario.name)),
        m('div.formula', 
          m('p', 'Formula:'),
          m('textarea', {onblur: (e) => actions.scenario.update_formula(cell, scenario, e.target.value)}, scenario.model.formulaString())),
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
  view: ({attrs: {name, input, update}}: {attrs: {name: string, input: SPTInput, update: (v: SPTInput) => unknown}}) =>
    m('div.spt-input', 
      m('h4', name),
      m('div.input-stack',
        (['min', 'low', 'med', 'high', 'max'] as (keyof SPTInput)[]).map(q => 
          m('input', {type: 'number', value: input[q], oninput: (e) => update(Object.assign(input, {[q]: +e.target.value}))})),
      )
    )
}


function cdfplot(f: (n:number) => number) {
  let data = R.range(1,100).map(x => [f(x/100), x/100]);
  return Plot.plot({
    x: {
      label: 'value'
    },
    y: {
      label: 'quantile',
      grid: true,
      ticks: R.range(0,11).map(x => x/10),
    },
    marks: [
      Plot.lineY(data, {x: d => d[0], y: d => d[1], stroke: 'grey'}),
      Plot.ruleY([0.1, 0.5, 0.9], {y: d => d, x1: f(0.01), x2: d => f(d), stroke: 'lightgreen'}),
      Plot.ruleX([0.1, 0.5, 0.9], {x: d => f(d), y1: 0, y2: d => d, stroke: 'lightgreen'})
    ]
  })
}

// f is a quantile function that maps the range [0,1] to the distribution. 
// f: "given a quantile return the corresponding value in the distribution"
function CDFPlot(f: (n:number) => number) {
  return {
    oncreate: function(vnode: m.VnodeDOM) {
      const chart = cdfplot(f);
      vnode.dom.append(chart);
    },

    view: function (vnode: m.VnodeDOM) {
      return m('div.cdf-plot')
    }
  }
}

function TornadoPlot(data: {variable: string, value: [number, number, number]}[]) {
  return {
    oncreate: function(vnode: m.VnodeDOM) {
      vnode.dom.append(tornadoplot(data))
    },
    view: function (vnode: m.VnodeDOM) {
      return m('div.tornado-plot')
    }
  }
}

function tornadoplot(data: {variable: string, value: [number, number, number]}[]) {
  return Plot.plot({
    x: {
      label: 'value'
    }, 
    y: {label: ''},
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
    models: {},
    scenarios: [new Scenario(new Model("value = reach * (wtp * price - cost)"))]
  },
  view: (cell) =>
    m('div.app',
      m('h1', 'DA Product Value Scenarios'),
      m('div.scenarios',
        cell.state.scenarios.map(s => m(ScenarioView, {cell: cell, scenario: s}))),
    )
};

const cells = meiosisSetup<State>({ app });

m.mount(document.getElementById('app') as HTMLElement, {
  view: () => app.view(cells())
});
