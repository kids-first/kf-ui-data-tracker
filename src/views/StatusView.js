import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  GET_STUDY_RELEASES,
  GET_STUDY_BY_ID,
  ALL_EVENTS,
  MY_PROFILE,
} from '../state/queries';
import {
  Container,
  Header,
  Segment,
  Placeholder,
  Message,
  Icon,
  Step,
} from 'semantic-ui-react';
import {longDate} from '../common/dateUtils';

const ReleasesView = ({match}) => {
  const getUser = useQuery(MY_PROFILE);
  const isBeta = !getUser.loading
    ? getUser.data.myProfile.roles.includes('BETA')
    : false;

  const {loading: studyLoading, data: studyData, error: studyError} = useQuery(
    GET_STUDY_BY_ID,
    {
      variables: {
        kfId: match.params.kfId,
      },
      fetchPolicy: 'network-only',
    },
  );
  const study = studyData && studyData.studyByKfId;
  const studyName = study ? 'for ' + study.name : '';

  const {loading: eventLoading, data: eventData, error: eventError} = useQuery(
    ALL_EVENTS,
    {
      variables: {
        studyId: match.params.kfId,
        orderBy: '-created_at',
      },
    },
  );
  const event = eventData && eventData.allEvents;
  const importEvent =
    event && event.edges.find(e => e.node.eventType === 'IM_SUC');

  const relayId = Buffer.from('StudyNode:' + match.params.kfId).toString(
    'base64',
  );
  const {
    loading: releaseLoading,
    data: releaseData,
    error: releaseError,
  } = useQuery(GET_STUDY_RELEASES, {
    variables: {
      id: relayId,
    },
    context: {clientName: 'coordinator'},
  });
  const release =
    releaseData && releaseData.study && releaseData.study.releases;

  if (studyLoading || releaseLoading || eventLoading)
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

  if (studyError || eventError)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study status - Error ${match.params.kfId}`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {studyError && studyError.message && <p>{studyError.message}</p>}
            {eventError && eventError.message && <p>{eventError.message}</p>}
            {releaseError && releaseError.message && (
              <p>{releaseError.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );

  if (!isBeta)
    return (
      <Container as={Segment} basic padded="very">
        <Helmet>
          <title>{`KF Data Tracker - Study status ${studyName}`}</title>
        </Helmet>
        <Header as="h2" disabled textAlign="center">
          <Icon name="ban" />
          You don’t have access to this page.
        </Header>
      </Container>
    );

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Study status ${studyName}`}</title>
      </Helmet>
      <Header as="h2" className="mt-6">
        Current Study Status
      </Header>
      <Step.Group stackable="tablet">
        <Step completed={typeof study === 'object'}>
          <Icon name="plane" />
          <Step.Content>
            <Step.Title>Study Registered</Step.Title>
            <Step.Description>Study was created in Kids First</Step.Description>
            {study && (
              <small className="text-grey">
                On {longDate(study.createdAt)}
              </small>
            )}
          </Step.Content>
        </Step>
        <Step completed={typeof importEvent === 'object'}>
          <Icon name="paper plane" />
          <Step.Content>
            <Step.Title>Delivered to Investigator</Step.Title>
            <Step.Description>
              Files have been imported to the Delivery Project
            </Step.Description>
            {importEvent && (
              <small className="text-grey">
                On {longDate(importEvent.node.createdAt)}
              </small>
            )}
          </Step.Content>
        </Step>
        <Step
          disabled={!releaseData.study}
          completed={
            release !== null && release.edges && release.edges.length > 0
          }
        >
          <Icon name="info circle" />
          <Step.Content>
            <Step.Title>Released</Step.Title>
            <Step.Description>
              The study was released to the public on the Kids First Portal
            </Step.Description>
            {release !== null && release.edges && release.edges.length > 0 && (
              <small className="text-grey">
                On {longDate(release.edges[0].node.createdAt)}
              </small>
            )}
          </Step.Content>
        </Step>
      </Step.Group>
    </Container>
  );
};

export default ReleasesView;
