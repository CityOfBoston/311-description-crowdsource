// @flow

import { hydrate } from 'emotion';
import Router from 'next/router';
import type { Context as NextContext } from 'next';

import RouterListener from './lib/RouterListener';
import SiteAnalytics from './lib/SiteAnalytics';
import makeLoopbackGraphql, {
  type LoopbackGraphql,
} from './lib/loopback-graphql';

import type { RequestAdditions } from '../server/lib/request-additions';

export type ClientContext = NextContext<RequestAdditions>;

export type ClientDependencies = {
  loopbackGraphql: LoopbackGraphql,
  siteAnalytics: SiteAnalytics,
};

let browserInited = false;
let browserDependencies: ClientDependencies;

// Browser-only setup
export function initBrowser() {
  if (browserInited) {
    return;
  }

  browserInited = true;

  hydrate(window.__NEXT_DATA__.styleIds);

  const routerListener = new RouterListener();
  routerListener.attach(Router, window.ga);
}

// Works on both server and browser. Memoizes on browser, so these dependencies
// will share state across pages.
export function getDependencies(ctx?: ClientContext): ClientDependencies {
  if (process.browser && browserDependencies) {
    return browserDependencies;
  }

  // req will exist only when this function is called for getInitialProps on the
  // server.
  const req = ctx && ctx.req;
  const loopbackGraphql = makeLoopbackGraphql(req);
  const siteAnalytics = new SiteAnalytics(
    typeof window !== 'undefined' ? window.ga : null
  );

  const dependencies: ClientDependencies = {
    loopbackGraphql,
    siteAnalytics,
  };

  if (process.browser) {
    browserDependencies = dependencies;
  }

  return dependencies;
}
