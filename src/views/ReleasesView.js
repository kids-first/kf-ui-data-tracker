import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_STUDY_RELEASES, MY_PROFILE} from '../state/queries';
import {
  Container,
  Header,
  Segment,
  Placeholder,
  Message,
  Icon,
} from 'semantic-ui-react';
import ReleaseList from '../components/ReleaseList/ReleaseList';

const ReleasesView = props => {
  const getUser = useQuery(MY_PROFILE);
  const isBeta = !getUser.loading
    ? getUser.data.myProfile.roles.includes('BETA')
    : false;
  const relayId = Buffer.from('StudyNode:' + props.match.params.kfId).toString(
    'base64',
  );
  const {data, error, loading} = useQuery(GET_STUDY_RELEASES, {
    variables: {
      id: relayId,
    },
    context: {clientName: 'coordinator'},
  });

  const study = data && data.study && data.study;

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

  if (!isBeta)
    return (
      <Container as={Segment} basic padded="very">
        <Header as="h2" disabled textAlign="center">
          <Icon name="ban" />
          You don’t have access to this page.
        </Header>
      </Container>
    );

  return (
    <Container as={Segment} basic vertical>
      <Header as="h2" className="mt-6">
        Past Published Releases
      </Header>
      {study && study.releases ? (
        <ReleaseList
          loading={loading}
          releases={study.releases && study.releases.edges}
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
};

export default ReleasesView;
