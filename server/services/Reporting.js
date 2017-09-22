// @flow

import 'isomorphic-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

type Understanding = 'CLEAR' | 'CONFUSING';

type Report = {|
  case_type: string,
  user_understanding: Understanding,
  user_description: Array<string>,
|};

export default class Reporting {
  agent: any;
  endpointUri: string;
  opbeat: any;

  constructor(endpointUri: ?string, opbeat: any) {
    if (!endpointUri) {
      throw new Error('Missing reporting endpoint URI');
    }

    if (process.env.http_proxy) {
      this.agent = new HttpsProxyAgent(process.env.http_proxy);
    }

    this.endpointUri = endpointUri;
    this.opbeat = opbeat;
  }

  async submitDescriptions(
    code: string,
    descriptions: Array<string>
  ): Promise<void> {
    const transaction =
      this.opbeat &&
      this.opbeat.startTransaction(
        'crowd_source_description clear',
        'Analytics'
      );

    try {
      const report: Report = {
        case_type: code,
        user_understanding: 'CLEAR',
        user_description: descriptions,
      };

      await fetch(this.endpointUri, {
        method: 'POST',
        body: JSON.stringify(report),
        agent: this.agent,
      });
    } finally {
      if (transaction) {
        transaction.end();
      }
    }
  }

  async reportConfusion(code: string): Promise<void> {
    const transaction =
      this.opbeat &&
      this.opbeat.startTransaction(
        'crowd_source_description confusing',
        'Analytics'
      );

    try {
      const report: Report = {
        case_type: code,
        user_understanding: 'CONFUSING',
        user_description: [],
      };

      await fetch(this.endpointUri, {
        method: 'POST',
        body: JSON.stringify(report),
        agent: this.agent,
      });
    } finally {
      if (transaction) {
        transaction.end();
      }
    }
  }
}
