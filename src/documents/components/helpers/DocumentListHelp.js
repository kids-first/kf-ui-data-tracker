import React from 'react';
import {Label, Popup} from 'semantic-ui-react';
import BaseHelper from './BaseHelper';
import addDocuments from '../../../assets/add_file.svg';

const Help = () => (
  <BaseHelper title="About Study Documents" image={addDocuments}>
    <p>
      Many documents need to be collected in order to properly ingest a study
      into the Kids First Data Resource Center (DRC). Required documents may be
      uploaded to a study here so that they may be reviewed and processed by the
      Kids First DRC.
    </p>
    <p>
      <b>Versions</b> allow revisions of the same document to be tracked.
      Creation of a new document that contains revised data of another document
      should be avoided and instead uploaded as a new version of the existing
      document.
    </p>
  </BaseHelper>
);

export default Help;
