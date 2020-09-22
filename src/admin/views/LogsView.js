import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {
  Container,
  Dimmer,
  Header,
  Loader,
  List,
  Icon,
  Segment,
  Button,
} from 'semantic-ui-react';
import {ALL_LOGS} from '../queries';

const LogsView = () => {
  const {loading, data: logsData} = useQuery(ALL_LOGS);

  const allLogs = logsData && logsData.allJobLogs.edges;
  console.log(allLogs);

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Logs</title>
      </Helmet>
      <Header as="h3">Study Creator Logs</Header>
      <Link to={`/logs`}>
        <Button basic size="mini" labelPosition="left" floated="left">
          <Icon name="arrow left" />
          All Documents
        </Button>
      </Link>
      <Segment basic>Logs from the most recent Job runs.</Segment>
      <Segment basic>
        {loading && (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading logs...</Loader>
            </Dimmer>
          </Segment>
        )}
        {!loading && allLogs && (
          <List divided>
            {allLogs.map(({node}) => (
              <List.Item key={node.id}>
                <List.Content>
                  <List.Header as={Link} to={`/logs/${node.id}`}>
                    {node.job.name}
                  </List.Header>
                  <List.Description>
                    {new Date(node.createdAt).toLocaleString()}
                  </List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        )}
      </Segment>
    </Container>
  );
};

export default LogsView;
