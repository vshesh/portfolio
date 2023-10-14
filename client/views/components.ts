import m from 'mithril';
import * as R from 'ramda';
import { SPTInput } from '../metalog';
import { ASTTree, isLeaf, Assessment } from '../model';





// FORMULA views
export const FormulaText = {
  view({ attrs: { formula, update, title } }: { attrs: { formula: string; title?: string; update: (s: string) => any; }; }) {
    return m('div.formula',
      m('p', title ?? 'Formula:'),
      m('textarea', { onblur: (e: { target: { value: string; }; }) => update(e.target.value) }, formula));
  }
};


/**
 * Shows Formula Input View
 */
export const FormulaInputView = {
  view({ attrs: { opportunity } }: { attrs: { opportunity: Assessment; }; }) {
    return m('div.formula-input-view',
      opportunity.model.formulas.map(
        f => m('div.formula-view', m('span.variable', f[1]), m('span.equals', `=`), this.construct(f[2], opportunity))
      )
    );
  },

  construct(formula: ASTTree, opportunity: Assessment): m.Vnode<any, any> {
    if (isLeaf(formula)) {
      if (typeof formula === 'number') {
        return m('span.number', `${formula}`);
      } else {
        if (R.includes(formula, opportunity.model.derived_vars)) {
          return m('span.variable', `${formula}`);
        }
        return m(InputView, {
          name: formula,
          // in this case formula is a variable name
          input: opportunity.inputs[formula].estimate,
          update: (v) => opportunity.patch(formula, { estimate: v })
        });
      }
    };
    const children = formula.slice(1).map(x => this.construct(x, opportunity));
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








// INPUT Views 

const SPTInputView = {
  view({ attrs: { name, input, update, simple } }: { attrs: { name: string; input: SPTInput; update: (v: SPTInput) => any; simple?: boolean; }; }) {
    return m('div.spt-input',
      m('h4', name),
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
const FixedInputView = {
  view: ({ attrs: { name, input, update, simple } }: { attrs: { name: string; input: number; update: (v: number) => any; simple?: boolean; }; }) => m('div.spt-input',
    m('h4', name),
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
const PersonBubble = {
  view: ({ attrs: { name, color } }: { attrs: { name: string; color: string; }; }) => {
    return m('span.person-bubble', { title: name, style: { 'background-color': color, color: '#eee' } }, m('span', name.split(' ').slice(0, 2).map(x => x[0])));
  }
};
export const LabeledNumber = {
  view: ({ attrs: { label = '', number = 0, precision = 0, postunit = '', preunit = '' } }) => {
    return m('span.labeled-number', m('span.label', label), m('span.number', preunit, number.toLocaleString('en-US', { maximumFractionDigits: precision }), postunit));
  }
};
