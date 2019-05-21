import React from 'react';
import FileDetailContainer from '../containers/FileDetailContainer';
import {GridContainer} from 'kf-uikit';

const FileDetailView = ({match}) => {
  const fileId = match.params.fileId;
  return (
    <GridContainer collapsed="cells" className="my-20 px-12">
      <section className="study-file-detail cell-12">
        <FileDetailContainer kfId={fileId} />
      </section>
    </GridContainer>
  );
};

export default FileDetailView;
