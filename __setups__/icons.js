import React from 'react';

jest.mock(`../src/assets/icons/box`, () => {
  return jest.fn(() => (
    <svg>
      <title>icon-box</title>
    </svg>
  ));
});

jest.mock(`../src/assets/icons/clinical`, () => {
  return jest.fn(() => (
    <svg>
      <title>icon-clinical</title>
    </svg>
  ));
});

jest.mock(`../src/assets/icons/misc`, () => {
  return jest.fn(() => (
    <svg>
      <title>icon-misc</title>
    </svg>
  ));
});

jest.mock(`../src/assets/icons/sequencing`, () => {
  return jest.fn(() => (
    <svg>
      <title>icon-sequencing</title>
    </svg>
  ));
});
