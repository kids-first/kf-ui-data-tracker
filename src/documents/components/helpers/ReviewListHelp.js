import BaseHelper from '../../../components/BaseHelper';
import React from 'react';
import addDocuments from '../../../assets/data-review.png';

const Help = () => (
  <BaseHelper title="About Study Data Reviews" image={addDocuments}>
    <p>
      Data Reviews track incoming data in the process of being approved into the
      Kids First DRC. Reviews that are completed or in progress for this study
      are listed here.
    </p>
  </BaseHelper>
);

export default Help;
