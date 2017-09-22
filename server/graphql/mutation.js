// @flow
/* eslint no-console: 0 */

import type { Context } from '.';

export const Schema = `
type Mutation {
  submitDescriptions (
    code: String!
    descriptions: [String!]!
  ): Boolean!

  reportConfusingService (
    code: String!
  ): Boolean!
}
`;

type SubmitDescriptionsArgs = {|
  code: string,
  descriptions: Array<string>,
|};

export const resolvers = {
  Mutation: {
    async submitDescriptions(
      root: mixed,
      { code, descriptions }: SubmitDescriptionsArgs,
      { reporting }: Context
    ): Promise<boolean> {
      await reporting.submitDescriptions(code, descriptions);
      return true;
    },

    async reportConfusingService(
      root: mixed,
      { code }: { code: string },
      { reporting }: Context
    ): Promise<boolean> {
      await reporting.reportConfusion(code);
      return true;
    },
  },
};
