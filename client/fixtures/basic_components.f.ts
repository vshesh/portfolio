
import { SPTInputView, LabeledNumber, FixedInputView, PersonBubble, AssessmentInputsView, AssessmentOutputsView } from "../views/components";
import * as fc from 'fast-check'
import { Fixtures } from "./fixtures";
import { Assessment } from "../model";


export const LabeledNumberStories: Fixtures<typeof LabeledNumber> = {
  name: 'LabeledNumber',
  component: LabeledNumber,
  stories: [
    {
      name: "Simple Labeled Number",
      attrs: {
        label: "Sample Label",
        number: fc.sample(fc.float({min: -1e9, max: 1e9}))[0]
      }
    },
    {
      name: "Dollar Value",
      attrs: {
        label: "Total Cost of Ownership",
        number: fc.sample(fc.float({min: -1e9, max: 1e9}))[0],
        preunit: '$',
        precision: 2
      }
    },
    {
      name: "Percentage",
      attrs: {
        number: fc.sample(fc.float({min: 0, max: 100}))[0],
        label: "Mean Quantile",
        postunit: '%'
      }
    }
  ]
}

export const SPTInputStories: Fixtures<typeof SPTInputView> = {
  name: 'SPTInputView',
  component: SPTInputView,
  stories: [
    {
      name: "Starting condition",
      attrs: {
        name: "variable",
        input: {
          alpha: 0.1,
          low: 0,
          med: 5,
          high: 10
        },
        update: (x) => console.log(x)
      }
    }
  ]
}


export const FixedInputStories: Fixtures<typeof FixedInputView> = {
  name: 'FixedInputView',
  component: FixedInputView,
  stories: [
    {
      name: "Starting condition",
      attrs: {
        name: "variable",
        input: fc.sample(fc.integer({min: -10000, max: 100000}))[0],
        update: (x) => console.log(x)
      }
    }
  ]
}

export const PersonBubbleStories: Fixtures<typeof PersonBubble> = {
  name: 'PersonBubble',
  component: PersonBubble,
  stories: [
    {
      name: "Basic two-word name",
      attrs: {
        name: "John James",
        color: "#444"
      }
    },
    {
      name: "Latin American 4-part name",
      attrs: {
        name: "Arturo Federico Gonzales Montero",
        color: "#444"
      }
    },
    {
      name: "Non-ASCII Initials",
      attrs: {
        name: "Éduardo Cabron",
        color: "#444"
      }
    },
    {
      name: "Non-latin alphabet",
      attrs: {
        name: "विशेष गुप्ता",
        color: "#444"
      }
    }

  ]
}


export const AssessmentInputsViewStories: Fixtures<typeof AssessmentInputsView> = {
  name: 'AssessmentInputsView',
  component: AssessmentInputsView,
  stories: [
    {
      name: "Basic",
      attrs: {
        assessment: new Assessment('value = price * reach', {
          price: {
            name: 'price',
            description: "price of product",
            estimate: {
              alpha: 0.1,
              low: 5,
              med: 10,
              high: 15
            },
            rationales: {low: '', high: ''}
          },
          reach: {
            name: 'reach',
            description: "# of customers",
            estimate: {
              alpha: 0.1,
              low: 5000,
              med: 8000,
              high: 15000
            },
            rationales: {low: '', high: ''}
          }
        }),
        update: (x) => console.log(x)
      }
    }
  ]
}

export const AssessmentOutputsViewStories: Fixtures<typeof AssessmentOutputsView> = {
  name: 'AssessmentOutputsView',
  component: AssessmentOutputsView,
  stories: [
    {
      name: "Basic",
      style: {
        'max-width': '350px'
      },
      attrs: {
        assessment: new Assessment('value = price * reach', {
          price: {
            name: 'price',
            description: "price of product",
            estimate: {
              alpha: 0.1,
              low: 5,
              med: 10,
              high: 15
            },
            rationales: {low: '', high: ''}
          },
          reach: {
            name: 'reach',
            description: "# of customers",
            estimate: {
              alpha: 0.1,
              low: 5000,
              med: 8000,
              high: 15000
            },
            rationales: {low: '', high: ''}
          }
        })
      }
    }
  ]
}

