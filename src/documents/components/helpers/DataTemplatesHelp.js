import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import dataTemplate from '../../../assets/templateHelper.jpeg';

const Help = () => (
  <BaseHelper title="About Study Data Templates" image={dataTemplate}>
    <p>
      Organization administrators can create data submission templates to
      standardize how data is data collected for their studies.
    </p>
  </BaseHelper>
);

export default Help;
