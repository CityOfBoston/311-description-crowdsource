// @flow

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { getDependencies, type ClientContext } from './app';
import loadStats from './queries/load-stats';

import type { Stats } from './types';
import AppLayout from './AppLayout';

type InitialProps = {|
  stats: ?Stats,
|};

type Props = {|
  ...InitialProps,
|};

export default class IndexPage extends React.Component<Props> {
  static async getInitialProps(ctx: ClientContext): Promise<InitialProps> {
    const { loopbackGraphql } = getDependencies(ctx);

    try {
      return {
        stats: await loadStats(loopbackGraphql),
      };
    } catch (e) {
      return {
        stats: null,
      };
    }
  }

  render() {
    const { stats } = this.props;

    return (
      <AppLayout>
        <div className="b">
          <Head>
            <title>BOS:311 — Teach the New BOS:311</title>
          </Head>

          <div className="b-c">
            <div className="sh sh--y">
              <h2 className="sh-title">Help teach the new BOS:311</h2>
            </div>

            <div className="m-v400 t--intro">
              The City of Boston is working on a new website for {' '}
              <a href="https://311.boston.gov/">BOS:311</a>. This new site will
              use automated text analysis to help route your cases. But, we need
              your help before we can launch.
            </div>

            <div className="g">
              <div className="g--8" css={`font-size: 18px; line-height: 1.5`}>
                <p>
                  We need you to help train the new algorithm by describing
                  hypothetical 311 cases in your own words. For example, if we
                  show you “Broken Sidewalk,” you could say:
                </p>

                <ul className="ul">
                  <li>“The sidewalk in front of my house is cracked,” or</li>
                  <li>“a tree is pushing up the bricks along Charles St.”</li>
                </ul>

                <p>
                  Every case type you describe will help us make the new BOS:311
                  that much better for the people of Boston!
                </p>

                <p>
                  <Link href="/about">
                    <a>Learn more about this project</a>
                  </Link>{' '}
                  and see more detailed instructions.
                </p>
              </div>

              <div
                className="g--4"
                css={`display: flex; flex: 1; flex-direction: column; justify-content: space-between; padding: 3rem 0;`}
              >
                {stats && (
                  <div className="ta-c">
                    <div
                      className="t--sans p-a200"
                      style={{ fontWeight: 'bold', fontSize: '28px' }}
                    >
                      {stats.total}
                    </div>{' '}
                    <span className="t--sans tt-u">
                      descriptions collected<br /> so far
                    </span>
                  </div>
                )}
                <div className="ta-c ">
                  <Link
                    prefetch={process.browser && !window.NO_NEXT_PREFETCH}
                    href="/form"
                  >
                    <a className="btn">Let’s get started!</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}
