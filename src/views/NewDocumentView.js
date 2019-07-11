import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import {EditDocumentForm} from '../forms';
import {CREATE_FILE} from '../state/mutations';
import {GET_STUDY_BY_ID} from '../state/queries';
import {Message, Segment, Container, Button, Header} from 'semantic-ui-react';
/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `location.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({match, history, location, createDocument}) => {
  // Tracks any error state reported from the server
  const [errors, setErrors] = useState('');

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
  }
  const handleSubmit = (fileName, fileType, fileDescription) => {
    const studyId = match.params.kfId;
    const file = location.state.file;
    createDocument({
      variables: {
        file,
        studyId,
        name: fileName,
        fileType,
        description: fileDescription,
      },
    })
      .then(resp => {
        history.push(`/study/${studyId}/documents`);
      })
      .catch(err => {
        setErrors(err.message);
      });
  };

  return (
    <Container as={Segment} vertical basic>
      <Container as={Segment} vertical basic>
        <Header as="h3">Tell us about your study document</Header>
        <p>
          Help ensure the fastest processing and harmonization of your study by
          telling us about the contents of your uploaded document. This helps
          our engineers accurately interpret your data.
        </p>
        {errors && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={errors}
          />
        )}
      </Container>
      <Segment.Group>
        <Segment>
          <Header as="h4">Uploaded File: {location.state.file.name}</Header>
        </Segment>
        <Container as={Segment} padded="very">
          <EditDocumentForm
            handleSubmit={handleSubmit}
            errors={errors}
            submitButtons={(disabled, onUploading) => (
              <Segment vertical basic compact>
                <Button
                  floated="right"
                  type="submit"
                  primary={errors.length === 0}
                  disabled={disabled}
                >
                  {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
                </Button>
                <Button
                  floated="right"
                  primary={errors.length > 0}
                  onClick={() =>
                    history.push(`/study/${match.params.kfId}/documents`)
                  }
                >
                  CANCEL
                </Button>
              </Segment>
            )}
          />
        </Container>
      </Segment.Group>
    </Container>
  );
};

export default graphql(CREATE_FILE, {
  name: 'createDocument',
  options: ({match}) => ({
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_STUDY_BY_ID, variables: {kfId: match.params.kfId}},
    ],
  }),
})(NewDocumentView);
