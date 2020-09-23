import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Prompt} from 'react-router-dom';
import {CREATE_FILE, CREATE_VERSION, UPDATE_VERSION} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {
  Message,
  Segment,
  Container,
  Grid,
  Icon,
  Image,
  Button,
  Header,
  Progress,
  Transition,
} from 'semantic-ui-react';
import AnalysisSummary from '../components/FileDetail/AnalysisSummary';
import NewDocumentForm from '../forms/NewDocumentForm';
import NewVersionForm from '../forms/NewVersionForm';

import form from '../../assets/form.svg';
import documentChoice from '../../assets/document_choice.svg';

const DocumentTypeChooser = ({type, setType}) => (
  <center>
    <Button.Group size="large">
      <Button
        icon
        active={type === 'document'}
        onClick={() => setType('document')}
        labelPosition="left"
      >
        <Icon name="file" />
        Create New Document
      </Button>
      <Button.Or />
      <Button
        icon
        active={type === 'version'}
        data-testid="update-existing-button"
        onClick={() => setType('version')}
        labelPosition="right"
      >
        Update Existing Document
        <Icon name="copy" />
      </Button>
    </Button.Group>
  </center>
);

const UploadBar = ({
  study,
  version,
  createVersion,
  versionLoading,
  versionError,
}) => (
  <Message icon>
    <Icon name="file" />
    <Message.Content>
      {version && !versionLoading && (
        <>
          <Button
            icon
            primary
            floated="right"
            labelPosition="left"
            as="label"
            htmlFor="file"
          >
            <Icon name="upload" />
            Upload a Different File
          </Button>
          <input
            hidden
            id="file"
            type="file"
            onChange={e => {
              createVersion({
                variables: {
                  file: e.target.files[0],
                  study: study.id,
                },
              }).catch(err => err);
            }}
          />
          <Message.Header>Uploaded File:</Message.Header>
          {version.fileName}
        </>
      )}
      {versionLoading && (
        <Progress indicating label="Uploading..." percent={100} />
      )}
      {versionError && (
        <Message
          negative
          icon="warning"
          header="Problem uploading"
          content={versionError.message}
        />
      )}
    </Message.Content>
  </Message>
);

const UploadView = ({match, history, location}) => {
  const [type, setType] = useState();

  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
  });

  // Mutation to upload the file and get back an analysis
  const [
    createVersion,
    {data: versionData, loading: versionLoading, error: versionError},
  ] = useMutation(CREATE_VERSION, {
    awaitRefetchQueries: true,
  });

  // Mutation to save the actual file
  const [saveDocument] = useMutation(CREATE_FILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
        },
      },
    ],
  });

  // Mutation to update a document with a new version
  const [updateVersion, {error: updateError}] = useMutation(UPDATE_VERSION);

  useEffect(() => {
    if (!location.state) return;

    createVersion({
      variables: {
        file: location.state.file,
        study: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
      },
    });
  }, [location.state, match.params.kfId, createVersion]);

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
    return <></>;
  }

  const version = versionData && versionData.createVersion.version;

  const handleSubmitNewDoc = (props, formikProps) => {
    const {file_desc, file_name, file_type} = props;

    const studyId = match.params.kfId;

    saveDocument({
      variables: {
        version: version.id,
        study: study.id,
        name: file_name,
        fileType: file_type,
        description: file_desc,
        tags: [],
      },
    })
      .then(resp => {
        const fvId = resp.data.createFile.file.kfId;
        history.push(`/study/${studyId}/documents/${fvId}`);
      })
      .catch(err => {
        formikProps.setSubmitting(false);
        formikProps.setErrors({all: err});
      });
  };

  const handleSubmitNewVersion = (props, formikProps) => {
    const {description, doc} = props;

    const studyId = study.data.study.kfId;

    updateVersion({
      variables: {
        versionId: version.kfId,
        document: doc.id,
        description: description,
        state: 'PEN',
      },
    })
      .then(resp => {
        history.push(`/study/${studyId}/documents/${doc.kfId}`);
      })
      .catch(err => formikProps.setSubmitting(false));
  };

  if (!study.data) {
    return <></>;
  }

  return (
    <Container as={Segment} vertical basic>
      <Prompt
        message={(location, action) => {
          return location.pathname.includes('/documents/')
            ? true
            : 'You are about to leave this page but the file has not yet been saved. Are you sure you want to leave?';
        }}
      />
      <Header as="h1">Create a New Document</Header>
      <UploadBar
        study={study.data.study}
        version={version}
        createVersion={createVersion}
        versionLoading={versionLoading}
        versionError={versionError}
      />
      <Transition.Group
        as="div"
        animiation="fade"
        duration={{hide: 200, show: 500}}
      >
        {version && (
          <Segment.Group>
            <Grid as={Segment} divided>
              <Grid.Column computer={3} tablet={8} mobile={4}>
                <Image src={form} />
              </Grid.Column>
              <Grid.Column computer={13} tablet={8} mobile={16}>
                <Header as="h2">Additional Information Required</Header>
                <p>
                  Please fill in additional information about the file you've
                  uploaded to help the Data Resource Center process your file
                  appropriately.
                </p>
                <p>
                  We have tried to generate a data summary based on the contents
                  of your file. If the summary does not match what you expect,
                  please make changes to the file and upload it again.
                  Otherwise, choose if you'd like to update an existing document
                  in the Data Tracker or create a new document entirely.
                </p>
              </Grid.Column>
            </Grid>
            <Segment secondary>
              <Header>File Content Summary</Header>
              <AnalysisSummary version={version} />
            </Segment>

            <Segment>
              {!type ? (
                <>
                  <Image src={documentChoice} size="medium" centered rounded />
                  <Header textAlign="center">
                    Update or Create a Document
                    <Header.Subheader>
                      Select whether to use this file to create a new document
                      or add it as a new version to an existing document.
                    </Header.Subheader>
                  </Header>
                </>
              ) : (
                <Header>Update or Create a Document</Header>
              )}
              <DocumentTypeChooser type={type} setType={setType} />
              {type === 'document' && (
                <NewDocumentForm
                  version={version}
                  studyFiles={study.data.study.files.edges}
                  handleSubmit={handleSubmitNewDoc}
                />
              )}
              {type === 'version' && (
                <NewVersionForm
                  studyFiles={study.data.study.files.edges}
                  version={version}
                  handleSubmit={handleSubmitNewVersion}
                />
              )}
              {updateError && (
                <Message
                  negative
                  icon="warning"
                  content={updateError.message}
                />
              )}
            </Segment>
          </Segment.Group>
        )}
      </Transition.Group>
    </Container>
  );
};

export default UploadView;
