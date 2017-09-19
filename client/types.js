// @flow

import type { RandomServiceDescriptionQuery } from './queries/graphql-types';

export type ServiceDescription = $PropertyType<
  RandomServiceDescriptionQuery,
  'randomServiceDescription'
>;
