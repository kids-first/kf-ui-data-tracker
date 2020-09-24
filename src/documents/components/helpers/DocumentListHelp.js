import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import addDocuments from '../../../assets/add_file.svg';

const Help = () => (
  <BaseHelper title="About Study Documents" image={addDocuments}>
    <p>
      Many documents need to be collected in order to properly ingest a study
      into the Kids First Data Resource Center (DRC). Required documents may be
      uploaded to a study here so that they may be reviewed and processed by the
      Kids First DRC.
    </p>
  </BaseHelper>
);

export default Help;
