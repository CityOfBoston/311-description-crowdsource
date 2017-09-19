// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import fullPageDecorator from '../storybook/full-page-decorator';

import AboutPage from './AboutPage';

storiesOf('AboutPage', module)
  .addDecorator(fullPageDecorator)
  .add('about page', () => <AboutPage />);
