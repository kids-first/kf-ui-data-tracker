import React from 'react';
import FileDetailContainer from '../containers/FileDetailContainer';
import {Container, Segment} from 'semantic-ui-react';

const FileDetailView = ({match}) => {
  const fileId = match.params.fileId;
  return (
    <Container as={Segment} basic vertical>
      <FileDetailContainer kfId={fileId} />
    </Container>
  );
};

export default FileDetailView;
