// @flow

import React, {
  type ComponentType as ReactComponentType,
  type Element as ReactElement,
} from 'react';
import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import { css } from 'emotion';

import {
  getDependencies,
  type ClientContext,
  type ClientDependencies,
} from './app';

import randomServiceDescription from './queries/random-service-description';
import submitDescriptions from './queries/submit-descriptions';
import reportConfusingService from './queries/report-confusing-service';

import type { ServiceDescription } from './types';

import AppLayout from './AppLayout';

const SERVICE_DESCRIPTION_STYLE = css({
  backgroundColor: '#f3f3f3',
});

const HELP_LIST_ITEM_STYLE = css({
  margin: '.77777rem 0 !important',
});

type InitialProps = {|
  serviceDescription: ServiceDescription,
|};

type ContentProps = {
  ...InitialProps,
  submitDescriptions: (descriptions: Array<string>) => mixed,
  reportConfusingService: () => mixed,
  loading: boolean,
  error?: ?string,
};

type ContentState = {|
  description1: string,
  description2: string,
  description3: string,
|};

export class Content extends React.Component<ContentProps, ContentState> {
  state = {
    description1: '',
    description2: '',
    description3: '',
  };

  canSubmit(): boolean {
    const { loading } = this.props;
    const { description1, description2, description3 } = this.state;

    return (
      !loading &&
      [description1, description2, description3].filter(d => !!d).length > 0
    );
  }

  submit = (ev: SyntheticInputEvent<*>) => {
    const { submitDescriptions } = this.props;
    const { description1, description2, description3 } = this.state;

    ev.preventDefault();

    if (!this.canSubmit()) {
      return;
    }

    submitDescriptions(
      [description1, description2, description3].filter(d => !!d)
    );
  };

  handleDescriptionChange = (num: number, ev: SyntheticInputEvent<*>) => {
    this.setState({
      [`description${num}`]: ev.target.value,
    });
  };

  handleConfusingServiceClick = (ev: SyntheticInputEvent<*>) => {
    const { reportConfusingService } = this.props;

    ev.preventDefault();

    reportConfusingService();
  };

  render() {
    const { serviceDescription, error } = this.props;

    return (
      <AppLayout>
        {() => (
          <div className="b">
            <Head>
              <title>BOS:311 — Describe a Service</title>
            </Head>

            <div className="b-c">
              <div className="sh sh--y">
                <Link href="/">
                  <a>
                    <h2 className="sh-title">Help teach the new BOS:311</h2>
                  </a>
                </Link>
              </div>

              <div className="t--intro m-v300">
                Please make up 3 situations that could be solved by reporting:
              </div>

              <div className={`p-a500 m-v500 ${SERVICE_DESCRIPTION_STYLE}`}>
                <div className="t--intro">
                  <strong>{serviceDescription.name}</strong>
                </div>
                <div className="t--info">{serviceDescription.description}</div>

                <div
                  className="t--info "
                  css={'text-align: right; font-size: 16px'}
                >
                  <a
                    href="javascript:void(0)"
                    onClick={this.handleConfusingServiceClick}
                  >
                    I don’t understand this service
                  </a>
                </div>
              </div>

              <div className="g">
                <div className="g--6">
                  {this.renderBox(1)}
                  {this.renderBox(2)}
                  {this.renderBox(3)}
                </div>

                <div className="g--6" css={'padding-top: 2rem'}>
                  <ul className="ul" css={'font-size: 18px; line-height: 1.3;'}>
                    <li className={`${HELP_LIST_ITEM_STYLE}`}>
                      Describe each scenario as if you were typing an answer to
                      the question “what can we help with?”
                    </li>

                    <li className={`${HELP_LIST_ITEM_STYLE}`}>
                      Use different words for each description. For example, if
                      you say “crack in the road” for one, use “hole in the
                      street” for another.
                    </li>

                    <li className={`${HELP_LIST_ITEM_STYLE}`}>
                      Don’t worry too much about grammar or spelling. Be
                      natural!
                    </li>

                    <li className={`${HELP_LIST_ITEM_STYLE}`}>
                      If you can’t come up with 3 different ones, that’s okay!
                      Write as much as you can, and then click submit.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="g">
                <div className="g--4" css={`align-self: center`}>
                  {error && <span className="t--info t--err">{error}</span>}
                </div>

                <div className="g--2">
                  <button
                    type="submit"
                    className="btn"
                    css="width: 100%"
                    disabled={!this.canSubmit()}
                    onClick={this.submit}
                  >
                    Submit
                  </button>
                </div>
              </div>

              <p className="t--subinfo" style={{ marginTop: '8rem' }}>
                The City of Boston may use, distribute, reproduce, modify,
                adapt, and publicly display content you submit for the purpose
                of improving City services and related efforts. Submitted
                content is also subject to the provisions of{' '}
                <a
                  href="http://www.sec.state.ma.us/pre/preinformation.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Massachusetts Public Records Law
                </a>{' '}
                and may be publicly released as open data under a{' '}
                <a
                  href="https://opendatacommons.org/licenses/pddl/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Public Domain Dedication and License
                </a>.
              </p>
            </div>
          </div>
        )}
      </AppLayout>
    );
  }

  renderBox(num: number) {
    return (
      <div className="g--12 m-b500">
        <label className="stp m-v200" htmlFor={`description-${num}`}>
          <span className="stp-number" style={{ lineHeight: 1.2 }}>
            {num}
          </span>{' '}
          What can we help with?
        </label>

        <div className="txt">
          <textarea
            id={`description-${num}`}
            className="txt-f"
            rows="3"
            css={`font-size: 18px`}
            value={this.state[`description${num}`]}
            onChange={this.handleDescriptionChange.bind(this, num)}
          />
        </div>
      </div>
    );
  }
}

type ControllerState = {|
  loading: boolean,
  error: ?string,
|};

// Set up more like an HOC than a component with a render prop because we need
// to have the static getInitialProps method for Next.
export function wrapController(
  getDependencies: (ctx?: ClientContext) => ClientDependencies,
  renderContent: (props: ContentProps) => ReactElement<*>
): ReactComponentType<InitialProps> {
  return class FormPageController extends React.Component<
    InitialProps,
    ControllerState
  > {
    static async getInitialProps(ctx: ClientContext): Promise<InitialProps> {
      const { loopbackGraphql } = getDependencies(ctx);

      return {
        serviceDescription: await randomServiceDescription(loopbackGraphql),
      };
    }

    dependencies = getDependencies();
    state = {
      loading: false,
      error: null,
    };

    submitDescriptions = async (descriptions: Array<string>) => {
      const { loopbackGraphql, siteAnalytics } = this.dependencies;
      const { serviceDescription } = this.props;

      this.setState({ loading: true, error: null });

      try {
        siteAnalytics.sendEvent(
          'Form',
          'describe',
          serviceDescription.code,
          descriptions.length
        );

        this.setState({
          loading: false,
        });

        await submitDescriptions(
          loopbackGraphql,
          serviceDescription.code,
          descriptions
        );

        Router.push('/thanks');
      } catch (e) {
        this.setState({
          loading: false,
          error:
            e.message || 'Could not save those descriptions. Please try again.',
        });
      }
    };

    reportConfusingService = () => {
      const { loopbackGraphql, siteAnalytics } = this.dependencies;
      const { serviceDescription } = this.props;

      siteAnalytics.sendEvent('Form', 'confused', serviceDescription.code);

      // we don't care if this succeeds or fails
      reportConfusingService(loopbackGraphql, serviceDescription.code);

      Router.push(`/form?zx=${Math.random()}`, '/form');
    };

    render() {
      const { submitDescriptions, reportConfusingService } = this;
      const { serviceDescription } = this.props;
      const { loading, error } = this.state;

      return renderContent({
        submitDescriptions,
        reportConfusingService,
        serviceDescription,
        loading,
        error,
      });
    }
  };
}

export default wrapController(getDependencies, (props: ContentProps) => (
  <Content {...props} />
));
