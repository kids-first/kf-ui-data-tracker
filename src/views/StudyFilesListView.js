import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import {
  Divider,
  Grid,
  Header,
  Message,
  Placeholder,
  Container,
  Segment,
} from 'semantic-ui-react';

/**
 * A place holder skeleton for a list of files
 */
const StudyListSkeleton = () => (
  <Grid divided="vertically">
    {[1, 2, 3].map(i => (
      <Grid.Row key={i}>
        <Grid.Column mobile={14} tablet={14} computer={15}>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="full" />
            </Placeholder.Header>
          </Placeholder>
        </Grid.Column>
        <Grid.Column mobile={2} tablet={2} computer={1}>
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        </Grid.Column>
      </Grid.Row>
    ))}
  </Grid>
);

/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (error)
        return (
          <Container as={Segment} basic>
            <Message
              negative
              icon="warning circle"
              header="Error"
              content={error.message}
            />
          </Container>
        );
      const files = !loading ? data.studyByKfId.files.edges : [];
      return (
        <Grid as={Segment} basic container columns={1}>
          <Grid.Column width={16}>
            <Header as="h2">Upload Study Documents for DRC Approval</Header>
            {loading ? (
              <StudyListSkeleton />
            ) : (
              <FileList fileList={files} studyId={props.match.params.kfId} />
            )}
            <Divider />
            <Grid.Row>
              <UploadContainer
                handleUpload={file =>
                  props.history.push('documents/new-document', {file})
                }
              />
            </Grid.Row>
          </Grid.Column>
        </Grid>
      );
    }}
  </Query>
);

export default StudyFilesListView;
