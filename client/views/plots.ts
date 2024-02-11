import * as Plot from '@observablehq/plot';
import * as R from 'ramda'
import m from 'mithril'
import { Idea, Scenario } from '../model';

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
        sort: {y: {value: 'data', reverse: true, reduce: (d: {value: [number, number, number]}[]) => 
          // this looks too complicated for what it is
          // just taking the size of the range for each element and 
          // taking the max one.
          R.reduce(R.max, -Infinity, R.map(x => Math.abs(x.value[2] - x.value[0]), d))
        }}, 
        fillOpacity: 0.8,
        fill: d => Math.abs(d.value[2] - d.value[0]),
        x1: d => Math.min(...d.value),
        x2: d => Math.max(...d.value),
      }),
      Plot.tickX([0], { stroke: 'white', x: (d) => d }),
      Plot.tickX([data[0].value[1]], { stroke: 'white', strokeDasharray: '3 2', x: (d) => d }),
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

function innovationchart(data: Scenario[], markStyle: 'simple' | 'glyph' = 'glyph', position: 'mean' | 'median' = 'median') {
  let marks: Plot.Markish[] = [];

  // get the x-coordinate that this scenario's 'glyph' will be plotted at. 
  // based on the position parameter that determines where we plot the quantity.
  const x = (d:Scenario) => position === 'median' ? d.opportunity.quantileF()(0.5) : position === 'mean' ? R.mean(d.opportunity.samples) : NaN;

  switch (markStyle) {
    case 'simple': marks = [
      Plot.dot(data, {
        x: (d: Scenario) => x(d),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        fill: (d: Scenario) => d.assessor?.color || 'grey',
        symbol: 'circle-filled',
        r: 10
      }),
      Plot.text(data, {
        text: d => d.assessor?.name.split(' ').slice(0, 2).map((x: string[]) => x[0]) || '',
        x: (d: Scenario) => x(d),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        fill: '#111'
      })
    ]; break;

    case 'glyph':
      // primarily uses a line to show the median value of the idea, plus: 
      // shows a rectangle of fixed size, filled in with the loss percentage 
      // and shifted off the mean (center of the rectangle is moved right or left) based on mean quantile.
      // in one glyph we are able to show both downsize/upside and loss%/gain% positioned at the median of the idea.

      // of course it requires understanding that the fixed size does not mean equal uncertainty. The bigger ideas have a much bigger range of possibilities. 
      // this graphic has just "value" (represented as position) and "shape" (compressed into the rectangle glyph).

      // encoding size as well gets hairy (scale size of rectangle by size of median or something) and it may become hard to see the shape of smaller ideas.
      // perhaps a heterogeneous representation is best - this glyph thing is a good comparator for larger ideas, and most bread and butter ideas do not have 
      // a significant downside. They're fairly feasible. 
      const max: number = R.reduce<number, number>(R.max, 0, data.map(x => Math.abs(x.opportunity.quantileF()(0.5))));
      const size = 0.04 * max; // half the size of the overall rectangle including loss & gain.

      // calculate position of separation between loss portion and gain portion. 
      const separation = (d: Scenario) => -size + 2 * size * (R.filter(x => x < 0, d.opportunity.samples).length / d.opportunity.samples.length);
      // how much to push the rectangle as a whole past the median line. the max is if the mean is 100% quantile which would be completely over the line.
      const offset = (d: Scenario) => (d.opportunity.quantile(R.mean(d.opportunity.samples)) - 0.5) * 2 * size
      marks = [
        Plot.rect(data, {
          x1: (d: Scenario) => offset(d) + x(d) - size,
          x2: (d: Scenario) => offset(d) + x(d) + separation(d),
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1,
          fill: "#a00"
        }),
        Plot.rect(data, {
          x1: (d: Scenario) => offset(d) + x(d) + separation(d),
          x2: (d: Scenario) => offset(d) + x(d) + size,
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1,
          fill: "#48a"
        }),
        Plot.ruleX(data, {
          x: (d) => x(d),
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1.5,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1.5
        }),
        Plot.dot(data, {
          x: (d) => x(d) + offset(d),
          y: (d) => d.roadmap.chanceOfSuccess() * 100,
          fill: 'black',
          r: 2
        })
      ]; break;
  }
  return Plot.plot({
    style: {
      'background-color': '#111',
      'color': 'white',
    },
    y: {
      domain: [0, 100]
    },
    marks: [
      Plot.ruleX([0],{
        strokeWidth: 4,
        stroke: 'grey',
        opacity: 0.5
      }),
      ...marks,
    ]
  })
}


/**
 * Creates a chart that shows the ranges for each scenario's opportunity plotted
 * Roughly a box-whisker plot with an extra dot for the mean. 
 * Highlights the 10%, median, 90% and mean values of the distribution. 

 * Conceptually similar to the innovation chart, but different enough that it's worth separating. 

 * @param data 
 * @param iqr_range quantiles for the beginning and end of the quantiles that are being plotted. defaults to a box-whisker plot. 
 * @returns 
 */
export function opportunitychart(data: Scenario[], iqr_range: [number, number] = [0.25, 0.75]) {
  return Plot.plot({
    style: {
      'background-color': '#111',
      'color': 'white',
    },
    y: {
      domain: [0, 100]
    },
    // TODO jitter y values so that projects don't overlap.
    marks: [
      Plot.ruleY(data, {
        x1: (d: Scenario) => d.opportunity.quantileF()(0.1),
        x2: (d: Scenario) => d.opportunity.quantileF()(0.9),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        stroke: (d: Scenario) => d.id
      }),

      Plot.rect(data, {
        x1: (d: Scenario) => d.opportunity.quantileF()(0.25),
        x2: (d: Scenario) => d.opportunity.quantileF()(0.75),
        y1: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100 - 1.5,
        y2: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100 + 1.5,
        fill: (d: Scenario) => d.id,
        title: (d) => d.name
      }),

      Plot.dot(data, {
        x: (d: Scenario) => d.opportunity.quantileF()(0.5),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        stroke: (d: Scenario) => '#111',
      }),


      // this filter thing is a hack
      // basically i can't figure out how to conditionally
      // set the fill to a hardcoded color 
      // so i have to separate the channel based values
      // from the constant ones. 
      // TODO fix this
      Plot.dot(data.filter(d => { const meanq = d.opportunity.quantile(R.mean(d.opportunity.samples)); return 0.25 > meanq || 0.75 < meanq }), {
        x: (d: Scenario) => R.mean(d.opportunity.samples),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        symbol: "circle-filled",
        r: 3,
        fill: (d: Scenario) => {
          const meanq = d.opportunity.quantile(R.mean(d.opportunity.samples));
          return d.id
        },
      }),

      // this is the copy for the constant value fill
      // only the fill and the filter criteria are different
      Plot.dot(data.filter(d => { const meanq = d.opportunity.quantile(R.mean(d.opportunity.samples)); return 0.25 < meanq && meanq < 0.75 }), {
        x: (d: Scenario) => R.mean(d.opportunity.samples),
        y: (d: Scenario) => d.roadmap.chanceOfSuccess() * 100,
        symbol: "circle-filled",
        r: 3,
        fill: '#111',
      })

    ]
  })
}

export function InnovationChart(data: Scenario[], markStyle: Parameters<typeof innovationchart>[1] = 'glyph') {
  return {
    oncreate: function (vnode: m.VnodeDOM) {
      vnode.dom.append(innovationchart(data, markStyle));
    },
    view: (vnode: m.VnodeDOM) => m('div.innovation-chart')
  }
}
