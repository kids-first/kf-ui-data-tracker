import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {CREATE_FILE} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {
  Message,
  Segment,
  Container,
  Icon,
  Button,
  Header,
} from 'semantic-ui-react';
import AnalysisSummary from '../components/FileDetail/AnalysisSummary';
import NewDocumentForm from '../forms/NewDocumentForm';

const UploadView = ({match, history, location}) => {
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
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
    onError: error => {
      // setErrors(error.message);
    },
  });

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.version) {
    history.push(`/study/${match.params.kfId}/documents`);
    return <></>;
  }

  const version = location.state.version;

  const handleSubmit = (fileName, fileType, fileDescription) => {
    const studyId = match.params.kfId;
    const version = location.state.version;
    saveDocument({
      variables: {
        version,
        studyId,
        name: fileName,
        fileType,
        description: fileDescription,
        tags: [],
      },
    }).then(resp => {
      history.push(`/study/${studyId}/documents`);
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
              <Button icon primary floated="right" labelPosition="left">
                <Icon name="upload" />
                Upload a Different File
              </Button>
              <Message.Header>Uploaded File:</Message.Header>
              {version.fileName}
            </Message.Content>
          </Message>

        </Segment>
        <Segment secondary>
          <Header>File Content Summary</Header>
          <AnalysisSummary version={version} />
        </Segment>

        <Segment>
          <NewDocumentForm
            version={version}
            handleSubmit={vals => console.log(vals)}
          />
        </Segment>
      </Segment.Group>
    </Container>
  );
};

export default UploadView;
