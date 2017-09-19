// @flow

import React, { type ComponentType as ReactComponentType } from 'react';
import { hydrate } from 'emotion';
import type { Context } from 'next';
import Router from 'next/router';

import RouterListener from './lib/RouterListener';
import SiteAnalytics from './lib/SiteAnalytics';
import makeLoopbackGraphql, {
  type LoopbackGraphql,
} from './lib/loopback-graphql';

import type { RequestAdditions } from '../server/lib/request-additions';

if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.styleIds);
}

export type ClientDependencies = {
  loopbackGraphql: LoopbackGraphql,
  siteAnalytics: SiteAnalytics,
};

let browserInited = false;
let browserDependencies: ClientDependencies;

function maybeInitBrowserLibraries() {
  if (browserInited || !process.browser) {
    return;
  }

  browserInited = true;

  const routerListener = new RouterListener();
  routerListener.attach(Router, window.ga);
}

function makeDependencies(req: ?RequestAdditions): ClientDependencies {
  if (process.browser && browserDependencies) {
    return browserDependencies;
  }

  const loopbackGraphql = makeLoopbackGraphql(req);

  const siteAnalytics = new SiteAnalytics();
  if (typeof window !== 'undefined') {
    siteAnalytics.attach(window.ga);
  }

  const dependencies: ClientDependencies = {
    loopbackGraphql,
    siteAnalytics,
  };

  if (process.browser) {
    browserDependencies = dependencies;
  }

  return dependencies;
}

export default function<Props: {}>(
  Component: ReactComponentType<(Props & ClientDependencies) | Props>
): ReactComponentType<Props> {
  maybeInitBrowserLibraries();

  return class Page extends React.Component<Props> {
    loopbackGraphql: LoopbackGraphql = makeLoopbackGraphql();

    static getInitialProps(ctx: Context<RequestAdditions>) {
      const req: ?RequestAdditions = ctx.req;

      const dependencies = makeDependencies(req);

      if (typeof Component.getInitialProps === 'function') {
        return Component.getInitialProps(ctx, dependencies);
      } else {
        return {};
      }
    }

    render() {
      const dependencies = makeDependencies();

      const props: any = {
        ...dependencies,
        ...this.props,
      };

      return <Component {...props} />;
    }
  };
}
