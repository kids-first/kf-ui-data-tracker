import React from 'react';
import BaseHelper from '../../../documents/components/helpers/BaseHelper';
import newDocument from '../../../assets/new_document.svg';

const Help = () => (
  <BaseHelper title="Upload a New Document" image={newDocument}>
    <p>
      The Data Resource Center requires additional information about new
      documents to ensure they may be consumed properly.
    </p>
  </BaseHelper>
);

export default Help;
