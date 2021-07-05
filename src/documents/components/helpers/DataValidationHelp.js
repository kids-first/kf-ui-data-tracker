import BaseHelper from '../../../components/BaseHelper';
import React from 'react';
import addDocuments from '../../../assets/data-review.png';

const Help = () => (
  <BaseHelper title="About Data Validation" image={addDocuments}>
    <p>
      Data validation analyzes your data to quickly identify possible integrity
      errors in the captured values and also the captured relationships between
      those values. For example, it can alert you to:
    </p>
    <ul>
      <li>
        Participants with more than one administrative gender or no
        administrative gender
      </li>
      <li>Specimens that are linked to more than one participant</li>
      <li>Genomic files missing sequencing details (method, platform, etc.)</li>
    </ul>
  </BaseHelper>
);

export default Help;
