// @flow

type Category = 'Form';

// class to wrap Google Analylitcs for sending events
export default class SiteAnalytics {
  ga: ?Function;

  constructor(ga: ?Function) {
    this.ga = ga;
  }

  sendEvent(
    eventCategory: Category,
    eventAction: string,
    eventLabel?: string,
    eventValue?: ?number
  ) {
    const { ga } = this;

    if (!ga) {
      return;
    }

    ga('send', {
      hitType: 'event',
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
    });
  }
}
