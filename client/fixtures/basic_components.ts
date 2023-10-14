
import { LabeledNumber } from "../views/components";
import * as fc from 'fast-check'
import { Fixtures } from "./fixtures";


export const LabeledNumberStories: Fixtures<typeof LabeledNumber> = {
  name: 'LabeledNumber',
  component: LabeledNumber,
  stories: [
    {
      name: "Simple Labeled Number",
      attrs: {
        number: fc.sample(fc.float())[0]
      }
    }
  ]
}