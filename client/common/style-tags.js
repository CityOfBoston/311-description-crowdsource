// @flow
/* eslint react/no-danger: 0 */

import React from 'react';
import stylesheetHrefs from '../../templates/stylesheets.json';

export default function styleTags(css: ?string) {
  return [
    ...stylesheetHrefs.map(href => (
      <link href={href} key={href} type="text/css" rel="stylesheet" />
    )),

    <style type="text/css" key="default">{`
      body {
        color: #58585B;
        font-family: Lora, serif;
      }

      .mn {
        padding-top: 0;
      }

    `}</style>,

    css && (
      <style
        type="text/css"
        key="static"
        dangerouslySetInnerHTML={{ __html: css }}
      />
    ),
  ];
}
