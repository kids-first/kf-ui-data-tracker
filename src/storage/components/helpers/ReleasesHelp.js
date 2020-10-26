import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import releases from '../../../assets/releases.svg';

const Help = () => (
  <BaseHelper title="About Releases" color="purple" image={releases}>
    <p>
      The Kids First Data Resource Center works continuously to add and improve
      data available to the research community. Each revision and addition of
      data is produced during a Release. Below are the latest Releases run by
      the Kids First DRC.
    </p>
  </BaseHelper>
);

export default Help;
