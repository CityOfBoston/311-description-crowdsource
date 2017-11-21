// @flow

import type { LoopbackGraphql } from '../lib/loopback-graphql';
import type { Stats } from '../types';

import type { LoadStatsQuery } from './graphql-types';
import LoadStatsGraphql from './LoadStats.graphql';

export default async function loadStats(
  loopbackGraphql: LoopbackGraphql
): Promise<Stats> {
  const response: LoadStatsQuery = await loopbackGraphql(LoadStatsGraphql);
  return response.stats;
}
