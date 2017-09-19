// @flow

import _ from 'lodash';
import type { Context } from '.';
import type { Service } from '../services/Open311';

export const Schema = `
type ServiceDescription {
  name: String!
  code: String!
  description: String!
}

type Query {
  randomServiceDescription: ServiceDescription!
}
`;

type ServiceDescription = {
  name: string,
  code: string,
  description: string,
};

export const resolvers = {
  Query: {
    randomServiceDescription: async (
      root: mixed,
      args: mixed,
      { open311 }: Context
    ): Promise<ServiceDescription> =>
      _(await open311.services())
        .map(
          ({
            service_code,
            service_name,
            description,
          }: Service): ServiceDescription => ({
            name: service_name || service_code,
            code: service_code,
            description: description || '',
          })
        )
        .sample(),
  },
};
