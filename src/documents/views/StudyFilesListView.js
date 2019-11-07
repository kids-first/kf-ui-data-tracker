import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';

import {
  Grid,
  Message,
  Placeholder,
  Container,
  Segment,
  Button,
  Responsive,
} from 'semantic-ui-react';
import {withAnalyticsTracking} from '../../analyticsTracking';
import UploadWizard from '../modals/UploadWizard/UploadWizard';

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
 * wrap our upload button in withAnalyticsTracking HOC
 * in-order to get proper event inheritance with
 * AnalyticsViewConsumer
 */
const UploadDocumentsButton = withAnalyticsTracking(
  ({onUpload, tracking: {buttonTracking}}) => (
    <>
      <Button
        compact
        primary
        floated="right"
        size="large"
        icon="cloud upload"
        labelPosition="left"
        content="Upload Document"
        as="label"
        htmlFor="file"
        onClick={
          buttonTracking(
            'Upload Document',
            null,
            {
              scope: 'StudyFilesListView',
            },
            'Upload Document',
          ).onClick
        }
      />
      <input hidden multiple id="file" type="file" onChange={onUpload} />
    </>
  ),
);

/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = ({
  study: {loading, studyByKfId, error},
  match: {
    params: {kfId},
  },
  history,
  user,
  tracking: {buttonTracking, logEvent},
}) => {
  const isAdmin =
    user && !user.loading ? user.myProfile.roles.includes('ADMIN') : false;
  const [dialog, setDialog] = useState(false);
  const [uploadedFile, setFile] = useState(false);
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
  const files = !loading ? studyByKfId.files.edges : [];
  return (
    <Grid as={Segment} basic container columns={1}>
      <Grid.Row>
        <Grid.Column width={10}>
          <h2>Study Documents</h2>
        </Grid.Column>
        {files.length > 0 && (
          <Grid.Column width={6}>
            <UploadDocumentsButton
              onUpload={e => {
                setFile(e.target.files[0]);
                setDialog(true);
              }}
            />
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          {loading ? (
            <StudyListSkeleton />
          ) : (
            <FileList fileList={files} studyId={kfId} isAdmin={isAdmin} />
          )}
          {dialog && (
            <UploadWizard
              history={history}
              studyId={kfId}
              file={uploadedFile}
              fileList={files}
              onCloseDialog={() => {
                setFile(false);
                setDialog(false);
              }}
              eventProperties={{
                study: {
                  kfId,
                  name: studyByKfId.name,
                  documents: files.length,
                },
              }}
            />
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Responsive
          as={UploadContainer}
          minWidth={Responsive.onlyTablet.minWidth}
          handleUpload={file => {
            setFile(file);

            return !files.length
              ? history.push('documents/new-document', {file})
              : setDialog(true);
          }}
          eventProperties={inherit => ({
            scope: 'StudyFilesListView',
            study: {
              kfid: studyByKfId ? studyByKfId.kfId : '',
              files: studyByKfId ? studyByKfId.files.edges.length : '',
            },
          })}
        />
      </Grid.Row>
    </Grid>
  );
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({variables: {kfId: props.match.params.kfId}}),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
  withAnalyticsTracking,
)(StudyFilesListView);
