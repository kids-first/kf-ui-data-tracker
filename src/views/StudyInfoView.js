import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import NewStudyForm from '../forms/NewStudyForm';
import {Container, Segment, Message, Placeholder} from 'semantic-ui-react';
import EmptyView from './EmptyView';

const StudyInfoView = ({
  study: {loading, studyByKfId, error},
  user,
  updateStudy,
  history,
}) => {
  const isBeta = !user.loading ? user.myProfile.roles.includes('BETA') : false;
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;
  const [apiErrors, setApiErrors] = useState(null);
  const [editing, setEditing] = useState(false);
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
          editing={editing}
          setEditing={setEditing}
        />
      </Container>
    );
  } else {
    return <EmptyView />;
  }
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({
      variables: {
        kfId: props.match.params.kfId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(UPDATE_STUDY, {
    name: 'updateStudy',
  }),
  graphql(MY_PROFILE, {name: 'user'}),
)(StudyInfoView);
