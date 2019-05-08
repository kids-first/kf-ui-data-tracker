import React from 'react';

// This mocks out some of the UI Kit components with shallow mocks so that the
// snapshots created are much tidier
const UIKit = require.requireActual('kf-uikit');
const mockedUIKit = {
  ...UIKit,
  Icon: jest.fn(props => (
    <svg id="mock-icon" {...props}>
      <title>icon-{props.kind}</title>
    </svg>
  )),
  Header: jest.fn(props => <nav data-testid="uikit-header" />),
};
module.exports = mockedUIKit;
