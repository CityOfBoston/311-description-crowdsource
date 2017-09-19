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
          <title>BOS:311 — Thank You</title>
        </Head>

        <div className="b-c">
          <div className="sh sh--y">
            <h2 className="sh-title">Thank you!</h2>
          </div>

          <p className="t--intro">
            Your help will aid us in making the new BOS:311 a great experience
            for the people of Boston.
          </p>

          <div className="g">
            <div className="g--6">
              <p className="t--info">
                Want to write some more? Every description helps.
              </p>
            </div>

            <div className="g--6" css={`align-self: center;`}>
              <div className="ta-c">
                <Link href="/form">
                  <a className="btn">Let’s keep going!</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
