import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {MY_PROFILE} from '../../state/queries';
import {GET_FILE_BY_ID} from '../queries';
import {Container, Segment, Dimmer, Loader, Message} from 'semantic-ui-react';
import FileDetail from '../components/FileDetail/FileDetail';
import NotFoundView from '../../views/NotFoundView';

const FileDetailView = ({match}) => {
  const {loading, data, error} = useQuery(GET_FILE_BY_ID, {
    variables: {kfId: match.params.fileId},
  });
  const fileByKfId = data && data.fileByKfId;
  const user = useQuery(MY_PROFILE);

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading File Details ...</Loader>
      </Dimmer>
    );

  if (error)
    return (
      <Container as={Segment} basic vertical>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  if (fileByKfId === null) {
    return (
      <NotFoundView
        title="Document not found"
        message={`Cannot find the document with ID ${match.params.fileId}`}
      />
    );
  }
  return (
    <Container as={Segment} basic vertical>
      <FileDetail fileNode={fileByKfId} isAdmin={isAdmin} />
    </Container>
  );
};

export default FileDetailView;
