import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import NewStudyForm from '../forms/StudyInfoForm/NewStudyForm';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Checkbox,
} from 'semantic-ui-react';
import NotFoundView from './NotFoundView';
import {hasPermission} from '../common/permissions';

const StudyInfoView = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
    fetchPolicy: 'network-only',
  });
  const study = data && data.study;
  const studyName = study ? 'for ' + study.name : '';

  const [updateStudy] = useMutation(UPDATE_STUDY);

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowEdit = myProfile && hasPermission(myProfile, 'change_study');

  const [apiErrors, setApiErrors] = useState(null);
  const submitUpdate = values => {
    updateStudy({
      variables: {
        id: study.id,
        input: values,
      },
    })
      .then(() => {
        setApiErrors(null);
      })
      .catch(err => setApiErrors(err.message));
  };

  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );
  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study info - Error ${match.params.kfId}`}
          </title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  if (study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${match.params.kfId}`}
      />
    );
  }
  if (
    !['info', 'external', 'logistics'].includes(
      history.location.pathname.split('/').slice(-1)[0],
    )
  ) {
    return (
      <NotFoundView
        title="Study info step not found"
        message={`Cannot find the study info step ${
          history.location.pathname.split('/').slice(-1)[0]
        }`}
      />
    );
  }
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Study info ${studyName}`}</title>
      </Helmet>
      <Header as="h2" className="mt-6" floated="left">
        Study Basic Info
      </Header>
      <Container textAlign="right">
        <Checkbox
          disabled={!allowEdit}
          checked={study && study.slackNotify}
          label="Send Updates to Slack"
          onClick={() => {
            submitUpdate({slackNotify: !study.slackNotify});
          }}
        />
      </Container>
      <NewStudyForm
        allowEdit={allowEdit}
        history={history}
        submitValue={submitUpdate}
        apiErrors={apiErrors}
        studyNode={study}
        editing={allowEdit}
      />
    </Container>
  );
};

export default StudyInfoView;
