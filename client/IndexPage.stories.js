// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import fullPageDecorator from '../storybook/full-page-decorator';

import IndexPage from './IndexPage';

storiesOf('IndexPage', module)
  .addDecorator(fullPageDecorator)
  .add('index page', () => <IndexPage />);
