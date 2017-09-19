// @flow
/* eslint no-console: 0 */

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
      { code, descriptions }: SubmitDescriptionsArgs
    ): Promise<boolean> {
      console.log(`Submitting descriptions for ${code}`, descriptions);
      return true;
    },

    async reportConfusingService(
      root: mixed,
      { code }: { code: string }
    ): Promise<boolean> {
      console.log(`Service ${code} is confusing`);
      return true;
    },
  },
};
