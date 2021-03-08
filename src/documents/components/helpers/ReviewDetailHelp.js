import BaseHelper from '../../../components/BaseHelper';
import React from 'react';
import addDocuments from '../../../assets/data-review.png';

const Help = () => (
  <BaseHelper title="About Data Reviews" image={addDocuments}>
    <p>
      This page outlines a specific Data Review with details about its progress
      and what documents are being reviewed. Once the Documents in this review
      are approved, the DRC will proceed with ingesting them for distribution.
    </p>
  </BaseHelper>
);

export default Help;
