// @flow

import type { LoopbackGraphql } from '../lib/loopback-graphql';
import type {
  ReportConfusingServiceMutationVariables,
  ReportConfusingServiceMutation,
} from './graphql-types';
import ReportConfusingServiceGraphql from './ReportConfusingService.graphql';

export default async function reportConfusingService(
  loopbackGraphql: LoopbackGraphql,
  code: string
): Promise<boolean> {
  const vars: ReportConfusingServiceMutationVariables = { code };

  const mutation: ReportConfusingServiceMutation = await loopbackGraphql(
    ReportConfusingServiceGraphql,
    vars
  );

  return mutation.reportConfusingService;
}
