import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import EditDocumentForm from '../forms/EditDocumentForm';
import {CREATE_FILE} from '../mutations';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {Message, Segment, Container, Button, Header} from 'semantic-ui-react';
import {lengthLimit} from '../utilities';

/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `location.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({match, history, location}) => {
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {kfId: match.params.kfId},
  });
  const user = useQuery(MY_PROFILE);
  const [createDocument] = useMutation(CREATE_FILE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_STUDY_BY_ID, variables: {kfId: match.params.kfId}},
    ],
    onError: error => {
      setErrors(error.message);
    },
  });

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;

  // Tracks any error state reported from the server
  const [errors, setErrors] = useState('');
  const studyFiles =
    study.data && study.data.studyByKfId
      ? study.data.studyByKfId.files.edges
      : [];

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
    return <></>;
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
        <Header as="h3">Tell us about your document</Header>
        <p className="text-wrap-75">
          Help us process and harmonize your study faster by categorizing and
          describing the document you are about to upload. If you have any
          questions, please contact us at{' '}
          <a href="mailto:support@kidsfirstdrc.org?subject=Kids First Data Tracker Help&body=Hello, I would like to upload a <insert_document_description_here> and am having trouble with the upload function">
            support@kidsfirstdrc.org
          </a>
          .
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
          <Header as="h4" title={location.state.file.name.length}>
            Uploaded File: {lengthLimit(location.state.file.name, 80)}
          </Header>
        </Segment>
        <Container as={Segment} padded="very">
          <EditDocumentForm
            studyFiles={studyFiles}
            isAdmin={isAdmin}
            fileNode={location.state.file}
            handleSubmit={handleSubmit}
            history={history}
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

export default NewDocumentView;
