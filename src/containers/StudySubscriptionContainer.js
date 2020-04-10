import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Button, Message, Container, Segment, Icon} from 'semantic-ui-react';
import StudyTable from '../components/StudyList/StudyTable';
import {ALL_STUDIES, MY_PROFILE} from '../state/queries';
import {SUBSCRIBE_TO, UNSUBSCRIBE_FROM} from '../state/mutations';

/**
 * Provides a list of studies and their subscription status and allows a user
 * to subscribe or unsubscribe from them.
 */
const StudySubscriptionContainer = () => {
  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
  } = useQuery(MY_PROFILE);
  const profile = dataProfile && dataProfile.myProfile;
  const {
    loading: loadingStudies,
    error: errorStudies,
    data: dataStudies,
  } = useQuery(ALL_STUDIES);
  const studies = dataStudies && dataStudies.allStudies;
  const [subscribeTo] = useMutation(SUBSCRIBE_TO);
  const [unsubscribeFrom] = useMutation(UNSUBSCRIBE_FROM);

  if (loadingProfile || loadingStudies || !studies)
    return <div>Loading subscriptions...</div>;

  if (studies.edges.length === 0)
    return (
      <Message
        warning
        header="You don't have access to any studies yet"
        content="Your account is being reviewed for the proper permissions."
      />
    );

  // The studie kfIds the user is subscribed to
  const subscriptions = profile.studySubscriptions.edges.map(
    ({node}) => node.kfId,
  );

  // Subscribes or unsubscribes from a study
  const handleToggle = study => {
    const isSubscribed = subscriptions.includes(study.kfId);
    const action = isSubscribed ? unsubscribeFrom : subscribeTo;
    action({variables: {studyId: study.kfId}}).catch(err => console.log(err));
  };

  // Renders either a subscribe/unsubscribe button
  const subscriptionButton = study => {
    const isSubscribed = subscriptions.includes(study.kfId);
    return (
      <Button
        primary={isSubscribed}
        size="mini"
        onClick={ev => {
          handleToggle(study);
        }}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
    );
  };

  const studyList = studies.edges.map(study => ({
    node: {
      status: subscriptions.includes(study.node.kfId)
        ? 'Subscribed'
        : 'Not Subscribed',
      'Subscribe/Unsubscribe': subscriptionButton(study.node),
      ...study.node,
    },
  }));

  if (errorProfile || errorStudies)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {errorProfile && errorProfile.message && (
              <p>User profile Error: {errorProfile.message}</p>
            )}
            {errorStudies && errorStudies.message && (
              <p>Studies fetching Error: {errorStudies.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );

  return (
    <StudyTable
      studyList={studyList}
      clickable={false}
      exclude={[
        'collaborators',
        'shortName',
        'createdAt',
        'modifiedAt',
        'bucket',
        'attribution',
        'dataAccessAuthority',
        'externalId',
        'releaseStatus',
        'version',
        'releaseDate',
        'anticipatedSamples',
        'awardeeOrganization',
        'description',
        'projects',
      ]}
      loading={loadingProfile || loadingStudies}
    />
  );
};

export default StudySubscriptionContainer;
