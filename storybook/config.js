import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import HeadManager from 'next/dist/client/head-manager';
import { configure, addDecorator } from '@storybook/react';

import '@storybook/addon-actions/register';

import styleTags from '../client/common/style-tags';

if (typeof window !== 'undefined') {
  window.NO_NEXT_PREFETCH = true;
}

const headManager = new HeadManager();

const DEFAULT_STYLE = `
  body, html {
    background-color: #eee;
  }
`;

class Wrapper extends React.Component {
  static propTypes = {
    headManager: PropTypes.any,
    children: PropTypes.any,
  };

  static childContextTypes = {
    headManager: PropTypes.object,
    router: PropTypes.object,
  };

  getChildContext() {
    return {
      headManager: this.props.headManager,
      router: Router,
    };
  }

  render() {
    return (
      <div>
        <Head>{styleTags(DEFAULT_STYLE)}</Head>

        {this.props.children}
      </div>
    );
  }
}

// Mock out Jest so we can import tests into storybook for their dummy data
global.jest = {
  mock: () => {},
  fn: () => {},
};
global.test = () => {};
global.it = () => {};
global.beforeEach = () => {};
global.afterEach = () => {};
global.describe = () => {};

const storiesContext = require.context('../client', true, /.stories.js$/);

function loadStories() {
  storiesContext.keys().forEach(filename => storiesContext(filename));
}

// Need to move data-emotion to the end the way it is in prod, so that its rules
// overwrite the patterns library.
addDecorator(story => {
  window.setTimeout(() => {
    document
      .querySelector('head')
      .appendChild(document.querySelector('style[data-emotion]'));
  }, 0);
  return story();
});

addDecorator(story => {
  if (window.parent) {
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ =
      window.parent.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  return <Wrapper headManager={headManager}>{story()}</Wrapper>;
});

configure(loadStories, module);

if (typeof window === 'object') {
  window.__storybook_stories__ = require('@storybook/react').getStorybook();
}
