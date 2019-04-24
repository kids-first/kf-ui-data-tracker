import React from 'react';

// This mocks out some of the UI Kit components with shallow mocks so that the
// snapshots created are much tidier
const UIKit = require.requireActual('kf-uikit');
const mockedUIKit = {
  ...UIKit,
  Icon: jest.fn(props => (
    <div id='mock-icon' {...props}>
      <title>icon-{props.kind}</title>
    </div>
  )),
};
module.exports = mockedUIKit;
