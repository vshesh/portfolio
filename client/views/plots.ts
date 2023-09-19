import * as Plot from '@observablehq/plot';
import * as R from 'ramda'
import m from 'mithril'

function cdfplot(f: (n: number) => number) {
  let data = R.range(1, 100).map(x => [f(x / 100), x / 100]);
  return Plot.plot({
    marginTop: 50,
    marginBottom: 50,
    style: {
      'background-color': '#111',
      'color': 'white',
      'font-size': '110%'
    },
    x: {
      label: 'value',
      tickFormat: '~s'
    },
    y: {
      label: 'quantile',
      grid: true,
      ticks: R.range(0, 11).map(x => x / 10)
      
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
export function CDFPlot(f: (n: number) => number) {
  return {
    oncreate: function (vnode: m.VnodeDOM) {
      vnode.dom.append(cdfplot(f));
    },

    view: function (vnode: m.VnodeDOM) {
      return m('div.cdf-plot')
    }
  }
}

function tornadoplot(data: { variable: string, value: [number, number, number] }[]) {
  return Plot.plot({
    marginLeft: 120,
    marginBottom: 50,
    style: {
      'background-color': '#111',
      'color': 'white',
      'font-size': '130%'
    },
    x: {
      label: 'opportunity',
      tickFormat: '~s',
    },
    y: { label: '' }, 
    color: {
      scheme: 'Greens',
    },
    marks: [
      Plot.barX(data, {
        y: 'variable',
        fillOpacity: 0.8,
        fill: d => Math.abs(d.value[2] - d.value[0]), 
        x1: d => Math.min(...d.value),
        x2: d => Math.max(...d.value),
      }),
      Plot.tickX([0], {stroke: 'white', x: (d) => d}),
      Plot.tickX([data[0].value[1]], {stroke: 'white', strokeDasharray: '3 2', x: (d) => d}),
    ]
  })
}

export function TornadoPlot(data: { variable: string, value: [number, number, number] }[]) {
  return {
    oncreate: function (vnode: m.VnodeDOM) {
      vnode.dom.append(tornadoplot(data))
    },
    view: function (vnode: m.VnodeDOM) {
      return m('div.tornado-plot')
    }
  }
}

