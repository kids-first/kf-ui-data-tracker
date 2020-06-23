import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Helmet} from 'react-helmet';
import {
  GET_STUDY_RELEASES,
  GET_STUDY_BY_ID,
  MY_PROFILE,
} from '../state/queries';
import {
  Container,
  Header,
  Segment,
  Placeholder,
  Message,
} from 'semantic-ui-react';
import ReleaseList from '../components/ReleaseList/ReleaseList';
import NotFoundView from './NotFoundView';

const ReleasesView = props => {
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const userRole =
    myProfile && myProfile.groups.edges.length > 0
      ? myProfile.groups.edges.map(({node}) => node.name)
      : [];
  const allowView = userRole.includes('Administrators');
  const relayId = Buffer.from('StudyNode:' + props.match.params.kfId).toString(
    'base64',
  );
  const {data, error, loading} = useQuery(GET_STUDY_RELEASES, {
    variables: {
      id: relayId,
    },
    context: {clientName: 'coordinator'},
  });

  const releases = data && data.study.releases;

  const {loading: studyLoading, data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: relayId,
    },
  });
  const study = studyData && studyData.study;
  const studyName = study ? 'for ' + study.name : '';

  if (loading || studyLoading)
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
  if (study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${props.match.params.kfId}`}
      />
    );
  }
  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study releases - Error ${
              props.match.params.kfId
            }`}
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

  if (allowView) {
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - Study releases ${studyName}`}</title>
        </Helmet>
        <Header as="h2" className="mt-6">
          Past Published Releases
        </Header>
        {releases && releases.edges ? (
          <ReleaseList
            loading={loading}
            releases={releases && releases.edges}
          />
        ) : (
          <Message
            warning
            icon="warning circle"
            header="Error"
            content="No release information found."
          />
        )}
      </Container>
    );
  } else {
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Study releases {studyName}</title>
        </Helmet>
        <Message
          warning
          icon="warning circle"
          header="You don't have access to release information."
          content="Release information will show up here once the permission is added to your account."
        />
      </Container>
    );
  }
};

export default ReleasesView;
