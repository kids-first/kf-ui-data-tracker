import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import releases from '../../../assets/releases.svg';

const Help = () => (
  <BaseHelper title="About Task Services" color="purple" image={releases}>
    <p>
      The Release Coordinator works with Task Services to perform work necessary
      to a data release. The coordinator will track the status of any arbitrary
      number of task services throughout the lifetime of a release to ensure
      that all complete as expected. These services perform some necessary step
      of a release such as etl, syncing, or reporting.
    </p>
  </BaseHelper>
);

export default Help;
