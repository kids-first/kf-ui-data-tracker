import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import dataTemplate from '../../../assets/templateHelper.jpeg';

const Help = () => (
  <BaseHelper title="About Study Data Templates" image={dataTemplate}>
    <p>
      Download the data templates below to understand what kind of data your
      organization is requesting for your study, and the recommended form that
      your organization would like the data to be in.
    </p>
    <p>
      Submitters are encouraged to provide data files in the templated form as
      this will unlock automated data validation, streamline the review process,
      and ultimately speed up your study's release.
    </p>
  </BaseHelper>
);

export default Help;
