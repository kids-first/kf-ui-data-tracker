import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {Prompt} from 'react-router-dom';
import {GET_STUDY_BY_ID, ALL_TEMPLATE_VERSIONS} from '../../state/queries';
import {
  Accordion,
  Message,
  Segment,
  Container,
  Icon,
  Button,
  Header,
  Progress,
  Transition,
} from 'semantic-ui-react';
import {
  CREATE_FILE,
  CREATE_FLATFILE_SETTINGS,
  CREATE_VERSION,
  EVALUATE_TEMPLATE_MATCH,
  UPDATE_VERSION,
} from '../mutations';
import AnalysisSummary from '../components/FileDetail/AnalysisSummary';
import NewUploadForm from '../forms/NewUploadForm';

const UploadBar = ({
  study,
  version,
  createVersion,
  versionLoading,
  versionError,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  return (
    <Message icon attached>
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
            <Accordion>
              <Accordion.Title
                active={showSummary}
                onClick={() => setShowSummary(!showSummary)}
              >
                <Icon name="dropdown" />
                Show Full Summary
              </Accordion.Title>
              <Accordion.Content active={showSummary}>
                <AnalysisSummary version={version} />
              </Accordion.Content>
            </Accordion>
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
};

const UploadView = ({match, history, location}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
  });

  const templates = useQuery(ALL_TEMPLATE_VERSIONS, {
    variables: {
      studies: [
        Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
      ],
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
  const [updateVersion] = useMutation(UPDATE_VERSION);

  const [evaluateTemplateMatch] = useMutation(EVALUATE_TEMPLATE_MATCH);

  // Get flatfile settings
  const [createFlatfileSettings] = useMutation(CREATE_FLATFILE_SETTINGS);

  useEffect(() => {
    if (!location.state) return;

    createVersion({
      variables: {
        file: location.state.file,
        study: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
        description: 'Original Version',
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
        fileType: selectedTemplate ? 'OTH' : file_type,
        description: file_desc,
        tags: [],
        templateVersion: selectedTemplate.length > 0 ? selectedTemplate : null,
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
    const {file_desc, doc} = props;

    const studyId = study.data.study.kfId;

    updateVersion({
      variables: {
        versionId: version.kfId,
        document: doc.id,
        description: file_desc,
        state: 'PEN',
      },
    })
      .then(resp => {
        history.push(`/study/${studyId}/documents/${doc.kfId}`);
      })
      .catch(err => formikProps.setSubmitting(false));
  };

  const handleSubmit = (props, formikProps) => {
    if (props.upload_type === 'document')
      handleSubmitNewDoc(props, formikProps);
    else if (props.upload_type === 'version')
      handleSubmitNewVersion(props, formikProps);
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
          <Segment>
            <NewUploadForm
              studyFiles={study.data.study.files.edges}
              version={version}
              templates={templates}
              handleSubmit={handleSubmit}
              evaluateTemplateMatch={evaluateTemplateMatch}
              study={study.data.study}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              createFlatfileSettings={createFlatfileSettings}
              location={location}
              history={history}
              match={match}
              createVersion={createVersion}
              updateVersion={updateVersion}
              saveDocument={saveDocument}
            />
          </Segment>
        )}
      </Transition.Group>
    </Container>
  );
};

export default UploadView;
