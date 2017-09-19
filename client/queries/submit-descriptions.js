// @flow

import type { LoopbackGraphql } from '../lib/loopback-graphql';
import type {
  SubmitDescriptionsMutationVariables,
  SubmitDescriptionsMutation,
} from './graphql-types';
import SubmitDescriptionsGraphql from './SubmitDescriptions.graphql';

export default async function submitDescriptions(
  loopbackGraphql: LoopbackGraphql,
  code: string,
  descriptions: Array<string>
): Promise<boolean> {
  const vars: SubmitDescriptionsMutationVariables = {
    code,
    descriptions,
  };

  const mutation: SubmitDescriptionsMutation = await loopbackGraphql(
    SubmitDescriptionsGraphql,
    vars
  );

  return mutation.submitDescriptions;
}
