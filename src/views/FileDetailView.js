import React from 'react';
import FileDetailContainer from '../containers/FileDetailContainer';
import {Container} from 'semantic-ui-react';

const FileDetailView = ({match}) => {
  const fileId = match.params.fileId;
  return (
    <Container style={{marginTop: 30, marginButtom: 30}}>
      <FileDetailContainer kfId={fileId} />
    </Container>
  );
};

export default FileDetailView;
