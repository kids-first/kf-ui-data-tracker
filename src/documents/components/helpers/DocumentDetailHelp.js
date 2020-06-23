import React from 'react';
import BaseHelper from './BaseHelper';
import versioning from '../../../assets/versioning.png';

const Help = () => (
  <BaseHelper title="About Document Versions" image={versioning}>
    <p>
      <b>Versions</b> allow revisions of the same document to be tracked.
      Creation of a new document that contains revised data of another document
      should be avoided and instead uploaded as a new version of the existing
      document.
    </p>
  </BaseHelper>
);

export default Help;
