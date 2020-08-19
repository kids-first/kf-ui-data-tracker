import React, {useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {CREATE_FILE, CREATE_VERSION} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {
  Message,
  Segment,
  Container,
  Icon,
  Button,
  Header,
  Progress,
} from 'semantic-ui-react';
import AnalysisSummary from '../components/FileDetail/AnalysisSummary';
import NewDocumentForm from '../forms/NewDocumentForm';

const UploadView = ({match, history, location}) => {
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
    onError: error => {
      // setErrors(error.message);
    },
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

  useEffect(() => {
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

  const handleSubmit = props => {
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
    }).then(resp => {
      const fvId = resp.data.createFile.file.kfId;
      history.push(`/study/${studyId}/documents/${fvId}`);
    });
  };

  return (
    <Container as={Segment} vertical basic>
      <Header as="h1">Create a New Document</Header>
      <Segment.Group>
        <Segment>
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
                          study: Buffer.from(
                            'StudyNode:' + match.params.kfId,
                          ).toString('base64'),
                        },
                      });
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
        </Segment>
        {version && (
          <>
            <Segment secondary>
              <Header>File Content Summary</Header>
              <AnalysisSummary version={version} />
            </Segment>

            <Segment>
              <NewDocumentForm version={version} handleSubmit={handleSubmit} />
            </Segment>
          </>
        )}
      </Segment.Group>
    </Container>
  );
};

export default UploadView;
