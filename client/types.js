// @flow

import type {
  RandomServiceDescriptionQuery,
  LoadStatsQuery,
} from './queries/graphql-types';

export type ServiceDescription = $PropertyType<
  RandomServiceDescriptionQuery,
  'randomServiceDescription'
>;

export type Stats = $PropertyType<LoadStatsQuery, 'stats'>;
