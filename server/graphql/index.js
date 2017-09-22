// @flow

import { makeExecutableSchema } from 'graphql-tools';

import { Schema as QuerySchema, resolvers as queryResolvers } from './query';
import {
  Schema as MutationSchema,
  resolvers as mutationResolvers,
} from './mutation';

import type Open311 from '../services/Open311';
import type Reporting from '../services/Reporting';

export type Context = {|
  open311: Open311,
  reporting: Reporting,
  opbeat: any,
|};

const SchemaDefinition = `
schema {
  query: Query,
  mutation: Mutation,
}
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition, QuerySchema, MutationSchema],
  resolvers: {
    ...queryResolvers,
    ...mutationResolvers,
  },
  allowUndefinedInResolve: false,
});
