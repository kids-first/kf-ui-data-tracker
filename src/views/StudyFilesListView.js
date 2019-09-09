import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { GET_STUDY_BY_ID } from '../state/queries';
import { UploadContainer } from '../containers';
import FileList from '../components/FileList/FileList';
import {
  Divider,
  Grid,
  Header,
  Message,
  Placeholder,
  Container,
  Segment,
  Button
} from 'semantic-ui-react';

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
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = ({
  study: { loading, studyByKfId, error },
  match: {
    params: { kfId },
  },
  history,
}) => {
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
          <h2 inline>Study Documents</h2>
        </Grid.Column>
        {
          files.length ? <Grid.Column width={6}>
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
            />
            <input
              hidden
              multiple
              id="file"
              type="file"
              onChange={e => {
                setFile(e.target.files[0]);
                setDialog(true);
              }}
            />
          </Grid.Column> : null
        }

      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          {loading ? (
            <StudyListSkeleton />
          ) : (
              <FileList fileList={files} studyId={kfId} />
            )}
          <Divider />
          <Grid.Row>
            <UploadContainer
              handleUpload={file => {
                setFile(file);
                return !files.length ? history.push('documents/new-document', { file }) : setDialog(true)
              }}
            />
          </Grid.Row>
          {
            dialog ?
              <UploadWizard
                history={history}
                studyId={kfId}
                file={uploadedFile}
                fileList={files}
                onCloseDialog={() => { setFile(false); setDialog(false) }}
              />
              : null
          }

        </Grid.Column>
      </Grid.Row>


    </Grid >
  );
};

export default graphql(GET_STUDY_BY_ID, {
  name: 'study',
  options: props => ({ variables: { kfId: props.match.params.kfId } }),
})(StudyFilesListView);
