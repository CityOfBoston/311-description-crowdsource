// @flow
/* eslint no-console: 0 */

import Hapi from 'hapi';
import Good from 'good';
import next from 'next';
import Boom from 'boom';
import Inert from 'inert';
import Path from 'path';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';

import { nextHandler, nextDefaultHandler } from './lib/next-handlers';
import addRequestAdditions from './lib/request-additions';
import { opbeatWrapGraphqlOptions } from './lib/opbeat-graphql';

import schema from './graphql';
import type { Context } from './graphql';

import Open311 from './services/Open311';

const port = parseInt(process.env.PORT || '3000', 10);

export default async function start({ opbeat }: any) {
  const server = new Hapi.Server();
  const app = next({
    dev: process.env.NODE_ENV !== 'production',
  });

  const nextAppPreparation = app.prepare();

  server.connection({ port }, '0.0.0.0');

  server.auth.scheme(
    'headerKeys',
    (s, { keys, header }: { header: string, keys: string[] }) => ({
      authenticate: (request, reply) => {
        const key = request.headers[header.toLowerCase()];
        if (!key) {
          reply(Boom.unauthorized(`Missing ${header} header`));
        } else if (keys.indexOf(key) === -1) {
          reply(Boom.unauthorized(`Key ${key} is not a valid key`));
        } else {
          reply.continue({ credentials: key });
        }
      },
    })
  );

  server.auth.strategy('apiKey', 'headerKeys', {
    header: 'X-API-KEY',
    keys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
  });

  server.register({
    register: Good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [
              {
                // Keep our health checks from appearing in logs
                response: { exclude: 'health' },
                log: '*',
              },
            ],
          },
          {
            module: 'good-console',
            args: [
              {
                color: process.env.NODE_ENV !== 'production',
              },
            ],
          },
          'stdout',
        ],
      },
    },
  });

  server.register(Inert);

  server.register({
    register: graphqlHapi,
    options: {
      path: '/graphql',
      // We use a function here so that all of our services are request-scoped
      // and can cache within the same query but not leak to others.
      graphqlOptions: opbeatWrapGraphqlOptions(opbeat, () => ({
        schema,
        context: ({
          open311: new Open311(
            process.env.PROD_311_ENDPOINT,
            process.env.PROD_311_KEY,
            opbeat
          ),
          opbeat,
        }: Context),
      })),
      route: {
        cors: true,
        auth: 'apiKey',
      },
    },
  });

  server.register({
    register: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql',
        passHeader: `'X-API-KEY': '${process.env.WEB_API_KEY || ''}'`,
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/{p*}',
    handler: addRequestAdditions(nextHandler(app)),
  });

  server.route({
    method: 'GET',
    path: '/_next/{p*}',
    handler: nextDefaultHandler(app),
  });

  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: (request, reply) => reply.file('static/favicon.ico'),
  });

  server.route({
    method: 'GET',
    path: '/assets/{path*}',
    handler: (request, reply) => {
      if (!request.params.path || request.params.path.indexOf('..') !== -1) {
        return reply(Boom.forbidden());
      }

      const p = Path.join(
        'static',
        'assets',
        ...request.params.path.split('/')
      );
      return reply
        .file(p)
        .header('Cache-Control', 'public, max-age=3600, s-maxage=600');
    },
  });

  server.route({
    method: 'GET',
    path: '/admin/ok',
    handler: (request, reply) => reply('ok'),
    config: {
      // mark this as a health check so that it doesn’t get logged
      tags: ['health'],
    },
  });

  await nextAppPreparation;

  await server.start();
  console.log(`> Ready on http://localhost:${port}`);
}
