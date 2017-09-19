// @flow

import React, { type ComponentType as ReactComponentType } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { css } from 'emotion';

import type { ClientDependencies } from './page';
import type { LoopbackGraphql } from './lib/loopback-graphql';

import randomServiceDescription from './queries/random-service-description';
import submitDescriptions from './queries/submit-descriptions';
import reportConfusingService from './queries/report-confusing-service';

import type { ServiceDescription } from './types';

const SERVICE_DESCRIPTION_STYLE = css({
  maxWidth: '66%',
  margin: '2rem auto 2rem',
  backgroundColor: '#f3f3f3',
});

type InitialProps = {|
  serviceDescription: ServiceDescription,
|};

type ContentProps = {|
  ...InitialProps,
  submitDescriptions: (descriptions: Array<string>) => mixed,
  reportConfusingService: () => mixed,
  loading: boolean,
  error?: ?string,
|};

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
      <div className="b">
        <Head>
          <title>BOS:311 — Describe a Service</title>
        </Head>

        <div className="b-c">
          <div className="sh sh--y">
            <h2 className="sh-title">Help teach the new BOS:311</h2>
          </div>

          <div className="t--intro m-v300">
            Please make up 3 situations that can be solved by:
          </div>

          <div className={`p-a500 ${SERVICE_DESCRIPTION_STYLE.toString()}`}>
            <div className="t--intro">
              <strong>{serviceDescription.name}</strong>
            </div>
            <div className="t--info">{serviceDescription.description}</div>

            <div
              className="t--info m-t500"
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

          <ul className="ul">
            <li className="t--info">
              Describe each scenario as if you were answering the question “what
              can we help with?”
            </li>

            <li className="t--info">
              Use different words for each description. For example, if you say
              “crack in the road” for one, use “hole in the street” for another.
            </li>

            <li className="t--info">
              Don’t worry too much about grammar or spelling. Be natural!
            </li>

            <li className="t--info">
              If you can’t come up with 3 different ones, that’s okay! Write as
              much as you can, and then click submit.
            </li>
          </ul>

          <div className="g">
            {this.renderBox(1)}
            {this.renderBox(2)}
            {this.renderBox(3)}
          </div>

          <div className="g">
            <div className="g--8" css={`align-self: center`}>
              {error && <span className="t--info t--err">{error}</span>}
            </div>

            <div className="g--4">
              <button
                type="submit"
                className="btn"
                css="width: 100%"
                disabled={!this.canSubmit()}
                onClick={this.submit}
              >
                Submit Descriptions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBox(num: number) {
    return (
      <div className="g--12 m-v500">
        <label className="stp m-v200" htmlFor={`description-${num}`}>
          <span className="stp-number">{num}</span> What can we help with?
        </label>

        <div className="txt">
          <textarea
            id={`description-${num}`}
            className="txt-f"
            rows="5"
            css={`font-size: 28px`}
            value={this.state[`description${num}`]}
            onChange={this.handleDescriptionChange.bind(this, num)}
          />
        </div>
      </div>
    );
  }
}

type ControllerProps = {|
  loopbackGraphql: LoopbackGraphql,
  ...InitialProps,
|};

type ControllerState = {|
  loading: boolean,
  error: ?string,
|};

export function addController(
  Content: ReactComponentType<ContentProps>
): ReactComponentType<ControllerProps> {
  return class FormPageController extends React.Component<
    ControllerProps,
    ControllerState
  > {
    state = {
      loading: false,
      error: null,
    };

    static async getInitialProps(
      ctx: mixed,
      { loopbackGraphql }: ClientDependencies
    ): Promise<InitialProps> {
      return {
        serviceDescription: await randomServiceDescription(loopbackGraphql),
      };
    }

    submitDescriptions = async (descriptions: Array<string>) => {
      const { loopbackGraphql, serviceDescription } = this.props;

      this.setState({ loading: true, error: null });

      try {
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
      const { loopbackGraphql, serviceDescription } = this.props;

      // we don't care if this succeeds or fails
      reportConfusingService(loopbackGraphql, serviceDescription.code);

      Router.push(`/form?zx=${Math.random()}`, '/form');
    };

    render() {
      const { serviceDescription } = this.props;
      const { loading, error } = this.state;

      return (
        <Content
          submitDescriptions={this.submitDescriptions}
          reportConfusingService={this.reportConfusingService}
          serviceDescription={serviceDescription}
          loading={loading}
          error={error}
        />
      );
    }
  };
}

export default addController(Content);
