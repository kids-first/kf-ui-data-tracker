import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import {Divider, Grid, Header} from 'semantic-ui-react';
/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      // TODO: add styled error state
      if (error)
        return (
          <>
            <Header as="h3">Error! </Header>
            <p className="text-center">{error.message}</p>
          </>
        );
      const files = !loading ? data.studyByKfId.files.edges : [];
      return (
        <Grid container columns={1} style={{paddingTop: '40px'}}>
          <Grid.Column width={16}>
            <Header as="h3">Upload Study Documents for DRC Approval</Header>
            {loading ? (
              "Loading..."
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
