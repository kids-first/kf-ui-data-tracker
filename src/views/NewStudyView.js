import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import NewStudyForm from '../forms/NewStudyForm';
import {Segment, Container, Header, Loader} from 'semantic-ui-react';
import {CREATE_STUDY} from '../state/mutations';
/**
 * The NewStudyView displays a form to collect details about a new study.
 */

const NewStudyView = ({match, history, location, createStudy}) => {
  const [newStudyError, setNewStudyError] = useState();
  const [studyCreating, setStudyCreating] = useState(false);

  const submitValue = values => {
    setStudyCreating(true);
    createStudy({
      variables: {input: values.input, workflows: values.workflowType},
    })
      .then(resp => {
        const studyId = resp.data.createStudy.study.kfId;
        setStudyCreating(false);
        history.push(`/study/${studyId}/documents`);
      })
      .catch(err => {
        setNewStudyError(err.message);
        setStudyCreating(false);
      });
  };

  return (
    <Container as={Segment} vertical basic>
      {studyCreating ? (
        <Container
          as={Segment}
          vertical
          basic
          placeholder
          style={{height: '90vh'}}
        >
          <Header as="h2" icon>
            <Loader active inline="centered" size="massive" />
            Creating Study
            <Header.Subheader>
              Your study is being configured, this may take a moment.
            </Header.Subheader>
          </Header>
        </Container>
      ) : (
        <>
          <Container as={Segment} vertical basic>
            <Header as="h3">Tell us about your new study</Header>
            <p className="text-wrap-75">
              We'll setup a new study for you by registering it in the Kids
              First system and initializing all the necessary systems. You can
              come after the study has been created to make changes at any time.
            </p>
          </Container>
          <NewStudyForm
            newStudy
            submitValue={submitValue}
            apiErrors={newStudyError}
            history={history}
          />
        </>
      )}
    </Container>
  );
};

export default graphql(CREATE_STUDY, {
  name: 'createStudy',
})(NewStudyView);
