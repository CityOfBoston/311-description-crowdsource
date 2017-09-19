// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import fullPageDecorator from '../storybook/full-page-decorator';

import { Content as FormPageContent } from './FormPage';

const SERVICE_DESCRIPTION = {
  name: 'Dead Animal Pick-up on Public Way',
  description: 'Remove a dead animal from a public street or sidewalk.',
  code: 'PUDEADANML',
};

storiesOf('FormPage', module)
  .addDecorator(fullPageDecorator)
  .add('initial form', () => (
    <FormPageContent
      submitDescriptions={action('submitDescriptions')}
      reportConfusingService={action('reportConfusingService')}
      serviceDescription={SERVICE_DESCRIPTION}
      loading={false}
    />
  ))
  .add('loading', () => (
    <FormPageContent
      submitDescriptions={action('submitDescriptions')}
      reportConfusingService={action('reportConfusingService')}
      serviceDescription={SERVICE_DESCRIPTION}
      loading={true}
    />
  ))
  .add('error', () => (
    <FormPageContent
      submitDescriptions={action('submitDescriptions')}
      reportConfusingService={action('reportConfusingService')}
      serviceDescription={SERVICE_DESCRIPTION}
      loading={false}
      error={
        'Unfortunately, we could not save those descriptions. Please try again!'
      }
    />
  ));
