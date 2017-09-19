// @flow

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

type Props = {};

export default class AboutPage extends React.Component<Props> {
  render() {
    return (
      <div className="b">
        <Head>
          <title>BOS:311 — About this Project</title>
        </Head>

        <div className="b-c">
          <div className="sh sh--y">
            <Link href="/">
              <a>
                <h2 className="sh-title">About this Project</h2>
              </a>
            </Link>
          </div>
          <div className="g">
            <div className="g--6" css={`font-size: 18px; line-height: 1.5`}>
              <p>
                The City of Boston is redesigning its 311 web interface, and we
                need your help! One major new change will be that rather than
                requiring the user to guess which of the dozens of internal case
                types their issue fits into, we’re going to instead ask them to
                simply tell us in their own words what’s wrong, in a sentence or
                less. We’ll then use a predictive model to suggest a few case
                types that we the issue might fall under, and the user can click
                on one to be taken to the right form.
              </p>

              <p>
                The model we’re building functions basically like a search
                engine, but is customized for this specific application. It will
                be created from a training dataset of how other users have
                describes their own issues in the past, from which the model
                learns what words and phrases are most common when talking about
                different case types. We’ll improve the model over time by
                adding more examples to that training dataset, and the model
                will even adapt to changes in the pattern of incoming cases —
                for example, by recognizing that snow-related case types
                typically come in batches (<i>i.e.</i>, during and after a
                storm), and thus automatically making those suggestions more
                likely to be shown when we’ve received a spike in snow cases.
              </p>

              <p>
                The one problem with this idea? Because the system doesn’t exist
                yet, we don’t actually have a training dataset of case
                descriptions to start from. We could substitute users’ general
                case descriptions from the current system, but that wouldn’t
                cover every case type or be exactly what we’re looking for, so
                we need more. And that’s where you come in!
              </p>

              <p>
                On this site, we’ll present a series of case types that we have
                in our system, and want you to give us examples in your own
                words of how you would describe a real-world situation where
                you’d submit a case. So for example, for the case type:
              </p>

              <p>“DEAD ANIMAL PICK-UP”</p>

              <p>you might describe a case of this type by saying:</p>

              <p>“There’s a dead squirrel in front of my house” </p>

              <p>or:</p>

              <p>
                “A stray cat died in the alleyway and it’s starting to stink”
              </p>

              <p>
                To get started, click the “Take me to the form” button below.
                You will be shown a name and definition for a randomly-chosen
                service request type, then asked to provide up to 3 examples of
                ways you would describe a case of that type. Don’t worry about
                grammar, spelling, or any of that — we just want a variety of
                examples of what people would say on a web form — and you don’t
                need to fill out all 3 if you can’t think anything. Also, if you
                don’t understand what the case type definition means, just click
                “Submit” and move on to the next one.
              </p>

              <p>
                After submitting your examples, you can stop, or get another
                case type to describe. We ask that users spend about 10 minutes
                on this, but if you find it interesting and want to do more,
                that’s great!
              </p>

              <p>
                Thanks in advance for your help making 311 better. Now, let’s
                get started!
              </p>
            </div>

            <div
              className="g--6"
              css={`align-self: flex-end; padding-bottom: 2rem;`}
            >
              <div className="ta-c">
                <Link href="/form">
                  <a className="btn">Take me to the form!</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
