// @flow

import type { LoopbackGraphql } from '../lib/loopback-graphql';

import type { RandomServiceDescriptionQuery } from './graphql-types';
import RandomServiceDescriptionGraphql from './RandomServiceDescription.graphql';

type ServiceDescription = {
  name: string,
  code: string,
  description: string,
};

export default async function randomServiceDescription(
  loopbackGraphql: LoopbackGraphql
): Promise<ServiceDescription> {
  const response: RandomServiceDescriptionQuery = await loopbackGraphql(
    RandomServiceDescriptionGraphql
  );
  return response.randomServiceDescription;
}
