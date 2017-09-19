// @flow

import 'isomorphic-fetch';
import URLSearchParams from 'url-search-params';
import url from 'url';
import HttpsProxyAgent from 'https-proxy-agent';

// types taken from Open311
export type Service = {|
  service_code: string,
  service_name: ?string,
  description: ?string,
  metadata: boolean,
  type: 'realtime' | 'batch' | 'blackbox',
  keywords: ?string,
  group: string,
|};

async function processResponse(res): Promise<any> {
  if (res.status === 404) {
    return null;
  } else if (!res.ok) {
    let message;

    if (
      (res.headers.get('content-type') || '').startsWith('application/json')
    ) {
      const firstError = (await res.json())[0];
      message =
        firstError.message || firstError.description || 'Open311 server error';
    } else {
      message = await res.text();
    }

    throw new Error(message);
  }

  return res.json();
}

/**
 * Service wrapper around our Open311 endpoint. Expected to be created fresh
 * for each request.
 *
 * Supports an HTTP proxy set via the $http_proxy env variable.
 *
 * Documentation: https://bos311.api-docs.io/
 */
export default class Open311 {
  agent: any;
  opbeat: any;
  endpoint: string;
  apiKey: ?string;

  constructor(endpoint: ?string, apiKey: ?string, opbeat: any) {
    if (!endpoint) {
      throw new Error('Must specify an Open311 endpoint');
    }

    this.endpoint = endpoint;
    this.apiKey = apiKey;

    this.opbeat = opbeat;

    if (process.env.http_proxy) {
      this.agent = new HttpsProxyAgent(process.env.http_proxy);
    }
  }

  url(path: string) {
    return url.resolve(this.endpoint, path);
  }

  services = async (): Promise<Service[]> => {
    const transaction =
      this.opbeat && this.opbeat.startTransaction('services', 'Open311');
    const params = new URLSearchParams();
    if (this.apiKey) {
      params.append('api_key', this.apiKey);
    }

    const response = await fetch(
      this.url(`services.json?${params.toString()}`),
      {
        agent: this.agent,
      }
    );

    const out = (await processResponse(response)) || [];
    if (transaction) {
      transaction.end();
    }
    return out;
  };
}
