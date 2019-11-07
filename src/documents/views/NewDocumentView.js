import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import EditDocumentForm from '../forms/EditDocumentForm';
import {CREATE_FILE} from '../mutations';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {Message, Segment, Container, Button, Header} from 'semantic-ui-react';
import {lengthLimit} from '../utilities';
import {withAnalyticsTracking} from '../../analyticsTracking';

/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `l \ocation.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({
  match,
  history,
  location,
  createDocument,
  user,
  study,
  tracking: {
    logEvent,
    buttonTracking,
    EVENT_CONSTANTS: {NEW_DOCUMENT_},
  },
}) => {
  // Tracks any error state reported from the server
  const [errors, setErrors] = useState('');
  const studyFiles = study.studyByKfId ? study.studyByKfId.files.edges : [];

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
      .then(({data: {createFile}}) => {
        logEvent(NEW_DOCUMENT_.UPLOAD, {
          upload_success: createFile.success,
          file: {
            file_name: fileName,
            type: fileType,
          },
          new_document: {
            document_name: createFile.file.name,
            type: createFile.file.fileType,
            kfId: createFile.file.kfId,
          },
        });
        history.push(`/study/${studyId}/documents`);
      })
      .catch(err => {
        logEvent(NEW_DOCUMENT_.UPLOAD, {
          error: err,
          upload_success: false,
          file: {
            file_name: fileName,
            type: fileType,
          },
        });

        setErrors(err.message);
      });
  };
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;
  return (
    <>
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
            errors={errors}
            history={history}
            showFieldHints={true}
            eventProperties={{
              study: {
                kfId: study.studyByKfId ? study.studyByKfId.kfId : null,
                name: study.studyByKfId ? study.studyByKfId.name : null,
              },
              file: {
                file_name: location.state.file.name,
                size: location.state.file.size,
                type: location.state.file.type,
              },
            }}
            submitButtons={(disabled, onUploading) => (
              <Segment vertical basic compact>
                <Button
                  floated="right"
                  type="submit"
                  primary={errors.length === 0}
                  disabled={disabled}
                  {...buttonTracking(
                    'UPLOAD',
                    'submit',
                    {disabled: disabled, errors: errors.length},
                    'UPLOAD',
                  )}
                >
                  {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
                </Button>
                <Button
                  floated="right"
                  primary={errors.length > 0}
                  {...buttonTracking(
                    'cancel',
                    'link',
                    {link: `/study/${match.params.kfId}/documents`},
                    'CANCEL UPLOAD',
                  )}
                  onClick={() => {
                    buttonTracking(
                      'cancel',
                      'link',
                      {link: `/study/${match.params.kfId}/documents`},
                      'CANCEL UPLOAD',
                    ).onClick();
                    history.push(`/study/${match.params.kfId}/documents`);
                  }}
                >
                  CANCEL
                </Button>
              </Segment>
            )}
          />
        </Container>
      </Segment.Group>
    </>
  );
};

export default compose(
  graphql(CREATE_FILE, {
    name: 'createDocument',
    options: ({match}) => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        {query: GET_STUDY_BY_ID, variables: {kfId: match.params.kfId}},
      ],
    }),
  }),
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({variables: {kfId: props.match.params.kfId}}),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
  withAnalyticsTracking,
)(NewDocumentView);
