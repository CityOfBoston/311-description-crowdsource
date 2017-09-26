// @flow

import React, { type Element as ReactElement } from 'react';
import { css } from 'emotion';

import Footer from './common/Footer';

const WRAPPER_STYLE = css({
  minHeight: 'calc(100vh - 83px)',
});

type Props = {|
  children: () => ReactElement<*>,
|};

export default function AppLayout({ children: render }: Props) {
  return (
    <div>
      <div className={`mn ${WRAPPER_STYLE.toString()}`}>{render()}</div>

      <Footer />
    </div>
  );
}
