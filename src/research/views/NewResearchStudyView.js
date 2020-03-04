import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useMutation} from '@apollo/react-hooks';
import NewResearchStudyForm from '../forms/NewResearchStudyForm';
import {Segment, Container, Header} from 'semantic-ui-react';
import {CREATE_STUDY} from '../../state/mutations';
/**
 * The NewResearchStudyView displays a form to collect details about a new research study.
 */

const NewResearchStudyView = ({match, history, location}) => {
  const [createStudy] = useMutation(CREATE_STUDY);
  const [newStudyError, setNewStudyError] = useState();
  const submitValue = values => {
    var sessionList = sessionStorage.getItem('newStudy')
      ? sessionStorage.getItem('newStudy').split(',')
      : [];
    createStudy({
      variables: {input: values.input, workflows: values.workflowType},
    })
      .then(resp => {
        const studyId = resp.data.createStudy.study.kfId;
        sessionList.push(studyId);
        sessionStorage.setItem('newStudy', sessionList);
        history.push({
          pathname: `/research-study/${studyId}/basic-info`,
          state: {
            newStudy: true,
          },
        });
      })
      .catch(err => {
        setNewStudyError(err.message);
      });
  };

  return (
    <Container as={Segment} vertical basic>
      <Helmet>
        <title>KF Data Tracker - New study</title>
      </Helmet>
      <Container as={Segment} vertical basic>
        <Header as="h3">Tell us about your new research study</Header>
        <p className="text-wrap-75">
          We'll setup a new study for you by registering it in the Kids First
          system and initializing all the necessary systems. You can come after
          the study has been created to make changes at any time.
        </p>
      </Container>
      <NewResearchStudyForm
        newStudy
        submitValue={submitValue}
        apiErrors={newStudyError}
        history={history}
      />
    </Container>
  );
};

export default NewResearchStudyView;