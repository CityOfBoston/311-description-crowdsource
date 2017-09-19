// @flow

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Props = {};

export default class IndexPage extends React.Component<Props> {
  render() {
    return (
      <div className="b">
        <Head>
          <title>BOS:311 — Train the New BOS:311</title>
        </Head>

        <div className="b-c">
          <div className="sh sh--y">
            <h2 className="sh-title">Help teach the new BOS:311</h2>
          </div>

          <div className="m-v400 t--intro">
            The City of Boston is working on a new website for {' '}
            <a href="https://311.boston.gov/">BOS:311</a>. This new site will
            use machine learning to help route your cases, but we need your help
            before we can launch.
          </div>

          <div className="g">
            <div className="g--6" css={`font-size: 18px; line-height: 1.5`}>
              <p>
                We need you to help train the new algorithm by describing
                hypothetical 311 cases in your own words. For example, if we
                give you “Broken Sidewalk,” you could say “the sidewalk in front
                of my house is cracked,” or “a tree is pushing up the bricks
                along Charles St.”
              </p>

              <p>
                Every case type you describe will help us make the new BOS:311
                that much better for the people of Boston!
              </p>

              <p>
                <Link href="/about">
                  <a>Learn more about this project</a>
                </Link>
              </p>
            </div>
            <div className="g--6" css={`align-self: center;`}>
              <div className="ta-c">
                <Link prefetch={process.browser} href="/form">
                  <a className="btn">Let’s get started!</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
