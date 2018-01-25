// @flow

import NProgress from 'nprogress';
import type Router from 'next/router';

export default class RouterListener {
  router: ?Router = null;
  ga: any = null;
  routeStartMs: number;

  attach(router: Router, ga: any) {
    this.router = router;
    this.ga = ga;

    router.onRouteChangeStart = this.routeChangeStart;
    router.onRouteChangeComplete = this.routeChangeComplete;
    router.onRouteChangeError = this.routeChangeError;

    NProgress.configure({ showSpinner: false });
  }

  detach() {
    if (this.router) {
      this.router.onRouteChangeStart = null;
      this.router.onRouteChangeComplete = null;
      this.router.onRouteChangeError = null;
    }

    this.router = null;
  }

  routeChangeStart = (url: string) => {
    NProgress.start();

    const { ga } = this;

    if (ga) {
      ga('set', 'page', url);
    }

    this.routeStartMs = Date.now();
  };

  routeChangeComplete = (url: string) => {
    NProgress.done();

    const { ga } = this;

    // we do a setTimeout so that the new title renders by the time we
    // want to see it
    setTimeout(() => {
      if (ga) {
        ga('send', 'pageview');
        ga(
          'send',
          'timing',
          'Router',
          'routeChange',
          Date.now() - this.routeStartMs,
          url
        );
      }
    }, 0);
  };

  routeChangeError = () => {
    NProgress.done();

    const { ga } = this;

    if (ga) {
      ga(
        'set',
        'page',
        window.location.pathname + (window.location.search || '')
      );
    }
  };
}
