import m from 'mithril';
import * as R from 'ramda';
import { SPTInput } from '../metalog';
import { ASTTree, isLeaf, Assessment, Formula, Quantity, ModelInput, CertainQuantity, UncertainQuantity, isCertain, Phase, ProofPoint, Roadmap } from '../model';
import { CDFPlot, TornadoPlot } from './plots';



// Assessment Views
// there are 3 parts of an assessment: model, inputs, & sampled values.
// sampled values have a variety of views (including the charts, and statistics).
// the inputs consist of the formula and the inputs associated with it. 
// at minimum you have to be able to edit the formula and also change the inputs.
// more complex version is to show an input with all its rationales etc. 

// some things are not easily supported, like changing the name of the input. 

export const AssessmentOutputsView = {
  view({ attrs: { assessment } }: { attrs: { assessment: Assessment } }) {
    return m('div.assessment-outputs',
      m(AssessmentStatsView, { assessment }),
      m(CDFPlot(assessment.quantileF())),
      m(TornadoPlot(assessment.sensitivity()))
    )
  }
}

export const AssessmentStatsView = {
  view({ attrs: { assessment } }: { attrs: { assessment: Assessment } }) {
    return m('div.stats',
      m(LabeledNumber, { number: R.mean(assessment.samples), label: "Mean" }),
      m(LabeledNumber, { postunit: '%', number: 100 * assessment.quantile(R.mean(assessment.samples)), label: "MeanQ" }),
      m(LabeledNumber, { number: R.median(assessment.samples), label: 'Median' }),
      m(LabeledNumber, { postunit: '%', number: 100 * R.filter(x => x < 0, assessment.samples).length / assessment.samples.length, label: 'Loss Chance' }))
  }
}

export const AssessmentInputsView = {
  view({ attrs: { assessment, update } }: { attrs: { assessment: Assessment, update: (a: Quantity) => any } }) {
    return m('div.asssessment-inputs',
      // bare minimum inputs, nothing fancy.
      // can also use fancier FormulaInputView or QuantityView to show more detail + edting options.
      m(FormulaText, { formula: assessment.model.formulaString(), update: (s: string) => { assessment.model = new Formula(s); } }),
      m(InputsListView, { assessment, update })
    )
  }
}

// FORMULA views

/**
 * Shows a text box where you can edit the formula.
 * Formula is parsed on blur so that intermediate keystrokes do not trigger errors.
 */
export const FormulaText = {
  view({ attrs: { formula, update, title } }: { attrs: { formula: string; title?: string; update: (s: string) => any; }; }) {
    return m('div.formula',
      m('p', title ?? 'Formula:'),
      m('textarea', { onblur: (e: { target: { value: string; }; }) => update(e.target.value) }, formula));
  }
};


/**
 * displays inputs inline in the formula
 * cannot use this to edit the formula itself, only the values in place. 
 * can be a nicer way to edit than looking for individual values in a list
 * and mapping them to a separate formula present somewhere else. 
 */
export const FormulaInputView = {
  // TODO change call sites to use assement instead of opportunity. 
  view({ attrs: { assessment } }: { attrs: { assessment: Assessment; }; }) {
    return m('div.formula-input-view',
      assessment.model.formulas.map(
        f => m('div.formula-view', m('span.variable', f[1]), m('span.equals', `=`), this.construct(f[2], assessment))
      )
    );
  },

  construct(formula: ASTTree, assessment: Assessment): m.Vnode<any, any> {
    if (isLeaf(formula)) {
      if (typeof formula === 'number') {
        return m('span.number', `${formula}`);
      } else {
        if (R.includes(formula, assessment.model.derived_vars)) {
          return m('span.variable', `${formula}`);
        }
        return m(InputView, {
          name: formula,
          // in this case formula is a variable name
          input: assessment.inputs[formula].estimate,
          update: (v) => assessment.patch(formula, { estimate: v })
        });
      }
    };
    const children = formula.slice(1).map(x => this.construct(x, assessment));
    if (!(/\w+/.test(formula[0]))) {
      // @ts-ignore (R.intersperse is typed wrong!)
      const term = R.intersperse(m('span.operator', { '+': '+', '-': '-', '*': '×', '/': '÷' }[formula[0]]), children);
      if (formula[0] === '+' || formula[0] === '-') {
        return m('span.factor', m('span.open-bracket', ``), ...term, m('span.closed-bracket', ``));
      }
      return m('span.factor', ...term);
    } else {
      // @ts-ignore (R.intersperse is typed wrong!)
      return m('span.function', m('span.variable', `${formula[0]}`), m('span.open-bracket'), ...R.intersperse(",", children), m('span.closed-bracket'));
    }
  }
};



// Roadmap views

export const RoadmapView = {
  view({ attrs: { roadmap, update } }: { attrs: { roadmap: Roadmap, update: (r: Roadmap) => any } }) {
    return m('div.roadmap',
      m('span.success-chance', roadmap.chanceOfSuccess()),
      roadmap.phases.map((phase, i) => m(PhaseView, { phase, update: (p: Phase) => { roadmap.phases[i] = p; update(roadmap) } })),
      m('span.add-button', {onclick: () => {roadmap.phases.push(new Phase('Untitled Phase')); update(roadmap)}}, 'Add Phase')
    )
  }
}

// Phase views

export const PhaseView = {
  view({ attrs: { phase, update } }: { attrs: { phase: Phase, update: (p: Phase) => any } }) {
    return m('div.phase',
      m('h4.name', phase.name),
      m(LabeledNumber, { label: "Chance of Success", number: phase.chanceOfSuccess() }),
      m(AssessmentStatsView, { assessment: phase.cost }),
      m('textarea', { value: phase.description, onblur: (e) => {phase.description = e.target.innerText; update(phase)} }),
    )
  }
}

export const ProofPointView = {
  view({ attrs: { proof_point, update } }: { attrs: { proof_point: ProofPoint, update: (pp: ProofPoint) => any } }) {
    return m('div.proof-point',
      m('div.bar', m('span.name', proof_point.name), m('span.chance', proof_point.estimate)),
      m('textarea.criteria', proof_point.description), m('textarea.comments', proof_point.rationales.comments),
    )
  }
}


// Quantity Views

export const QuantityView = {
  view<Q extends ModelInput<any, any>>({ attrs: { quantity, update } }: { attrs: { quantity: Q, update: <P extends keyof Q>(q: Q, prop: P, value: Q[P]) => any } }) {
    // @ts-ignore
    return m(isCertain(quantity) ? FixedQuantityView : UncertainQuantityView, { quantity, update })
  }
}

export const UncertainQuantityView = {
  view({ attrs: { quantity, update } }: { attrs: { quantity: UncertainQuantity, update: <P extends keyof UncertainQuantity>(q: UncertainQuantity, prop: P, value: UncertainQuantity[P]) => any } }) {
    return m(QuantityHeader, { quantity, update },
      // show rationales and estimates
      m('textarea', { value: quantity.rationales.low, placeholder: "Explain reasons for low estimate here...", onblur: (s: string) => update(quantity, 'rationales', { low: s, high: quantity.rationales.high }) }),
      m(SPTInputView, { input: quantity.estimate, update: (n) => update(quantity, 'estimate', n) }),
      m('textarea', { value: quantity.rationales.high, placeholder: "Explain reasons for high estimate here...", onblur: (s: string) => update(quantity, 'rationales', { low: quantity.rationales.low, high: s }) }),
    )
  }
}

export const FixedQuantityView = {
  view({ attrs: { quantity, update } }: { attrs: { quantity: CertainQuantity, update: <P extends keyof CertainQuantity>(q: CertainQuantity, prop: P, value: CertainQuantity[P]) => any } }) {
    return m(QuantityHeader, { quantity, update },
      // show rationales and estimates
      m('textarea', { value: quantity.rationales.comments, placeholder: "Add comments here...", onblur: (s: string) => update(quantity, 'rationales', { comments: s }) }),
      m(FixedInputView, { input: quantity.estimate, update: (n) => update(quantity, 'estimate', n) }))
  }
}

// TODO allow switching between Fixed and Unceratin quantities and their corresponding input types. 
// there needs to be a "Quantity" view for that or similar, I guess. 
export const QuantityHeader = {
  view<Q extends ModelInput<any, any>>({ children, attrs: { quantity, update } }: { children?: m.VnodeDOM['children'], attrs: { quantity: Q, update: <P extends keyof Q>(q: Q, prop: P, value: Q[P]) => any } }) {
    // ideally you could update any part of the quantity here. 
    // will not make any edits to the variable here, will rely on update to do the whole update. 
    // this is a dumb view component. 

    // TODO, will use this on the main ScenarioView page to show inputs & rationales and to allow editing.
    return m('div.quantity',
      m(CE, { selector: 'span.name', onchange: (s: string) => update(quantity, 'name', s), value: quantity.name }),
      m('input.description', { type: "text", onblur: (e: { target: { value: string } }) => update(quantity, 'description', e.target.value) }, quantity.description),
      m(CE, { selector: 'span.units', value: quantity.units, onchange: (s: string) => update(quantity, 'units', s) }),
      // let parent decide on how to show the rationales and numeric inputs
      children
    )
  }
}


// INPUT Views 
export const InputsListView = {
  // shows all inputs in an assessment in a list (based on defined inputs variables in the model)
  view({ attrs: { assessment, update } }: { attrs: { assessment: Assessment, update: (q: Quantity) => any } }) {
    return m('div.spts',
      assessment.model.inputs.map(
        x => {
          let input = assessment.inputs[x];
          return m(InputView, {
            name: x,
            input: input.estimate,
            update: (values: typeof input.estimate) => {
              input.estimate = values;
              update(input)
            }
          })
        }
      )
    )
  }
}

// these next three go together 

export const SPTInputView = {
  view({ attrs: { name, input, update, simple } }: { attrs: { name?: string; input: SPTInput; update: (v: SPTInput) => any; simple?: boolean; }; }) {
    return m('div.spt-input',
      name && m('h4', name),
      m('div.input-stack',
        ((simple ? ['low', 'med', 'high'] : ['min', 'low', 'med', 'high', 'max']) as (keyof SPTInput)[]).map(q => m('input', {
          type: 'number', value: input[q],
          oninput: (e: { target: { value: string; }; }) => update(Object.assign(input, {
            [q]: e.target.value ? /-?\d+(\.\d*)?([eE]\d+)?/.test(e.target.value) ? +e.target.value : input[q] : null
          }))
        }))
      )
    );
  }
};
export const FixedInputView = {
  view: ({ attrs: { name, input, update, simple } }: { attrs: { name?: string; input: number; update: (v: number) => any; simple?: boolean; }; }) => m('div.spt-input',
    name && m('h4', name),
    m('div.input-stack',
      m('input', {
        type: 'number', value: input,
        oninput: (e: { target: { value: string; }; }) => update(e.target.value && /-?\d+(\.\d*)?([eE]\d+)?/.test(e.target.value) ? +e.target.value : input)
      })
    )
  )
};
export const InputView = {
  view: <T extends number | SPTInput>({ attrs }: { attrs: { name: string; input: T; update: (v: T) => any; simple?: boolean; }; }) =>
    // @ts-ignore
    typeof attrs.input === 'number' ? m(FixedInputView, attrs) : m(SPTInputView, attrs)
};









// Generic Components
export const CE = {
  // @ts-ignore
  view: ({ attrs: { selector, onchange, value } }) => {
    // @ts-ignore
    return m(selector, { contentEditable: true, onblur: (e) => onchange(e.target.innerText) }, m.trust(value));
  }
};
export const PersonBubble = {
  view: ({ attrs: { name, color } }: { attrs: { name: string; color: string; }; }) => {
    return m('span.person-bubble', { title: name, style: { 'background-color': color, color: '#eee' } }, m('span', name.split(' ').slice(0, 2).map(x => x[0])));
  }
};
export const LabeledNumber = {
  view: ({ attrs: { label = '', number = 0, precision = 0, postunit = '', preunit = '' } }) => {
    return m('span.labeled-number', m('span.label', label), m('span.number', preunit, number.toLocaleString('en-US', { maximumFractionDigits: precision }), postunit));
  }
};


export function Tabs() {
  let selected: string | null = null;
  return {
    view: <V extends m.VnodeDOM<any, any>>({ attrs }: { attrs: { [s: string]: V } }) => {
      console.log('selected tab is ', selected)
      return m('div.tabs',
        m('div.tab-bar', Object.keys(attrs).map(name => m('span.tab-name', {
          onclick: () => {
            console.log(`selected is, ${selected}`)
            selected = name;
            console.log(`${name} tab clicked; ${selected} tab selected`);
          }
        }, name))),
        m('div.tab-content', attrs[selected ?? Object.keys(attrs)[0]])
      )
    }
  }
} 