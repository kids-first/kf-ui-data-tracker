import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useMutation} from '@apollo/client';
import NewStudyForm from '../forms/StudyInfoForm/NewStudyForm';
import {Segment, Container, Header} from 'semantic-ui-react';
import {CREATE_STUDY} from '../state/mutations';
/**
 * The NewStudyView displays a form to collect details about a new study.
 */

const NewStudyView = ({match, history, location}) => {
  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }

  const [createStudy] = useMutation(CREATE_STUDY);
  const [submitting, setSubmitting] = useState(false);
  const [newStudyError, setNewStudyError] = useState();

  const submitValue = values => {
    setSubmitting(true);
    var sessionList = sessionStorage.getItem('newStudy')
      ? sessionStorage.getItem('newStudy').split(',')
      : [];
    createStudy({
      variables: {
        input: {...values.input, organization: currentOrg && currentOrg.id},
        workflows: values.workflowType,
      },
    })
      .then(resp => {
        const studyId = resp.data.createStudy.study.kfId;
        sessionList.push(studyId);
        sessionStorage.setItem('newStudy', sessionList);
        history.push({
          pathname: `/study/${studyId}/basic-info/info`,
          state: {
            newStudy: true,
          },
        });
        setSubmitting(false);
      })
      .catch(err => {
        setNewStudyError(err.message);
        setSubmitting(false);
      });
  };

  return (
    <Container as={Segment} vertical basic>
      <Helmet>
        <title>KF Data Tracker - New study</title>
      </Helmet>
      <Container as={Segment} vertical basic>
        <Header as="h3">Tell us about your new study</Header>
        <p className="text-wrap-75">
          We'll setup a new study for you by registering it in the Kids First
          system and initializing all the necessary systems. You can come after
          the study has been created to make changes at any time.
        </p>
      </Container>
      <NewStudyForm
        newStudy
        submitValue={submitValue}
        apiErrors={newStudyError}
        history={history}
        submitting={submitting}
      />
    </Container>
  );
};

export default NewStudyView;
