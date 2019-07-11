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
      <Grid.Row key={i} style={{height: '90px'}}>
        <Grid.Column width="2">
          <Placeholder style={{width: '100%', height: '40px'}}>
            <Placeholder.Image />
          </Placeholder>
        </Grid.Column>
        <Grid.Column width="8">
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="full" />
            </Placeholder.Header>
          </Placeholder>
        </Grid.Column>
        <Grid.Column width="6" textAlign="right">
          <Placeholder style={{float: 'right', width: '100px', height: '40px'}}>
            <Placeholder.Image />
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
        <Grid container columns={1} style={{paddingTop: '40px'}}>
          <Grid.Column width={16}>
            <Header as="h3">Upload Study Documents for DRC Approval</Header>
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
