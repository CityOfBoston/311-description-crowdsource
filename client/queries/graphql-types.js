/* @flow */
//  This file was automatically generated and should not be edited.

export type RandomServiceDescriptionQuery = {|
  randomServiceDescription: {|
    name: string,
    code: string,
    description: string,
  |},
|};

export type ReportConfusingServiceMutationVariables = {|
  code: string,
|};

export type ReportConfusingServiceMutation = {|
  reportConfusingService: boolean,
|};

export type SubmitDescriptionsMutationVariables = {|
  code: string,
  descriptions: Array< string >,
|};

export type SubmitDescriptionsMutation = {|
  submitDescriptions: boolean,
|};