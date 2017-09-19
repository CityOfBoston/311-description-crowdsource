// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import fullPageDecorator from '../storybook/full-page-decorator';

import ThanksPage from './ThanksPage';

storiesOf('ThanksPage', module)
  .addDecorator(fullPageDecorator)
  .add('index page', () => <ThanksPage />);
