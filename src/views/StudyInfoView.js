import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import NewStudyForm from '../forms/StudyInfoForm/NewStudyForm';
import {Container, Segment, Message, Placeholder} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import {AnalyticsViewConsumer} from '../analyticsTracking';

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
      <AnalyticsViewConsumer
        status="ERROR"
        mountProperties={{
          error,
          study: {kfId: studyByKfId.kfId, name: studyByKfId.name},
        }}
      >
        <Container as={Segment} basic>
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={error.message}
          />
        </Container>
      </AnalyticsViewConsumer>
    );
  if (isBeta) {
    return (
      <AnalyticsViewConsumer
        mountProperties={{
          study: {kfId: studyByKfId.kfId, name: studyByKfId.name},
        }}
      >
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
      </AnalyticsViewConsumer>
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
