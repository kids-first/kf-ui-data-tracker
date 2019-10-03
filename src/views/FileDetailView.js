import React from 'react';
import FileDetailContainer from '../containers/FileDetailContainer';
import {Container, Segment} from 'semantic-ui-react';
import {AnalyticsViewConsumer} from '../analyticsTracking';

const FileDetailView = ({match}) => {
  const fileId = match.params.fileId;
  return (
    <AnalyticsViewConsumer
      mountProperties={{
        file: fileId,
        study: {kfId: match.params.kfId},
      }}
      view="FileDetailView"
    >
      <Container as={Segment} basic vertical>
        <FileDetailContainer kfId={fileId} />
      </Container>
    </AnalyticsViewConsumer>
  );
};

export default FileDetailView;
