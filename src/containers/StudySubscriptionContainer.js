import React from 'react';
import {graphql, compose} from 'react-apollo';
import {Button} from 'kf-uikit';
import StudyTable from '../components/StudyList/StudyTable';
import {ALL_STUDIES, MY_PROFILE} from '../state/queries';
import {SUBSCRIBE_TO, UNSUBSCRIBE_FROM} from '../state/mutations';

/**
 * Provides a list of studies and their subscription status and allows a user
 * to subscribe or unsubscribe from them.
 */
const StudySubscriptionContainer = ({
  profile: {loadingProfile, errorProfile, myProfile: profile},
  studies: {loadingStudies, errorStudies, allStudies: studies},
  subscribeTo,
  unsubscribeFrom,
}) => {
  if (loadingProfile || loadingStudies || !studies)
    return <div>Loading subscriptions...</div>;

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
        type="button"
        color={isSubscribed ? 'secondary' : 'default'}
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

  return (
    <StudyTable
      studyList={studyList}
      clickable={false}
      exclude={['createdAt', 'modifiedAt', 'name']}
      loading={loadingProfile || loadingStudies}
    />
  );
};

export default compose(
  graphql(ALL_STUDIES, {name: 'studies'}),
  graphql(MY_PROFILE, {name: 'profile'}),
  graphql(SUBSCRIBE_TO, {name: 'subscribeTo'}),
  graphql(UNSUBSCRIBE_FROM, {name: 'unsubscribeFrom'}),
)(StudySubscriptionContainer);
