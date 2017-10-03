// @flow

import type { LoopbackGraphql } from '../lib/loopback-graphql';
import type { ServiceDescription } from '../types';

import type { RandomServiceDescriptionQuery } from './graphql-types';
import RandomServiceDescriptionGraphql from './RandomServiceDescription.graphql';

export default async function randomServiceDescription(
  loopbackGraphql: LoopbackGraphql
): Promise<ServiceDescription> {
  const response: RandomServiceDescriptionQuery = await loopbackGraphql(
    RandomServiceDescriptionGraphql
  );
  return response.randomServiceDescription;
}
