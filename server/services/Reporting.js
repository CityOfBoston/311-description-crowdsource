// @flow

import 'isomorphic-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

type Understanding = 'CLEAR' | 'CONFUSING';

type Report = {|
  case_type: string,
  user_understanding: Understanding,
  user_description: Array<string>,
|};

type StatsResult = {|
  counts: Array<{|
    case_type: string,
    case_type_id: string,
    count: number,
    source: string,
  |}>,
  // ISO date
  created: string,
  total: number,
|};

export type Stats = {|
  total: number,
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

  async stats(): Promise<Stats> {
    const transaction =
      this.opbeat &&
      this.opbeat.startTransaction('training_data_summary', 'Analytics');

    try {
      const response = await fetch(`${this.endpointUri}training_data_summary`, {
        method: 'GET',
        agent: this.agent,
      });

      const stats: StatsResult = await response.json();

      return {
        total: stats.total,
      };
    } finally {
      if (transaction) {
        transaction.end();
      }
    }
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

      await fetch(`${this.endpointUri}crowd_source_description`, {
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

      await fetch(`${this.endpointUri}crowd_source_description`, {
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
