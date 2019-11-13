import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import NewStudyForm from '../forms/StudyInfoForm/NewStudyForm';
import {Container, Segment, Message, Placeholder} from 'semantic-ui-react';
import EmptyView from './EmptyView';

const StudyInfoView = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
    fetchPolicy: 'network-only',
  });
  const studyByKfId = data && data.studyByKfId;
  const user = useQuery(MY_PROFILE);
  const [updateStudy] = useMutation(UPDATE_STUDY);

  const isBeta =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('BETA')
      : false;
  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;

  const [apiErrors, setApiErrors] = useState(null);
  const submitUpdate = values => {
    updateStudy({
      variables: {
        id: studyByKfId.id,
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
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  if (isBeta) {
    return (
      <Container as={Segment} basic vertical>
        <NewStudyForm
          isAdmin={isAdmin}
          history={history}
          submitValue={submitUpdate}
          apiErrors={apiErrors}
          studyNode={studyByKfId}
          editing={isAdmin}
        />
      </Container>
    );
  } else {
    return <EmptyView />;
  }
};

export default StudyInfoView;
