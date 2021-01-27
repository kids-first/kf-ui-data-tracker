import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {Link} from 'react-router-dom';
import {Container, Grid, Header, List, Icon, Segment} from 'semantic-ui-react';
import {ALL_LOGS, ALL_JOBS} from '../queries';
import {JobsList} from '../components/JobsList';

const LogsView = () => {
  const [jobFilter, setJobFilter] = useState();
  const {data: logsData, loading} = useQuery(ALL_LOGS, {
    variables: {job: jobFilter},
  });
  const {data: jobsData} = useQuery(ALL_JOBS);

  const allLogs = logsData ? logsData.allJobLogs.edges : [];
  const allJobs = jobsData ? jobsData.allJobs.edges : [];

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Logs</title>
      </Helmet>
      <Header as="h1">Job Logs</Header>
      <Grid>
        <Grid.Column width={6}>
          <Header>
            Jobs
            <Header.Subheader>Select to filter by Job</Header.Subheader>
          </Header>
          <JobsList
            jobs={allJobs}
            active={jobFilter}
            onClick={job => setJobFilter(job)}
          />
        </Grid.Column>

        <Grid.Column width={10}>
          <Header>Latest Logs</Header>
          <Segment placeholder basic secondary>
            <List celled selection size="large">
              {allLogs.length ? (
                allLogs.map(({node}) => (
                  <List.Item key={node.id} as={Link} to={`/logs/${node.id}`}>
                    {node.error ? (
                      <Icon name="warning sign" color="red" />
                    ) : (
                      <Icon name="check" color="green" />
                    )}

                    <List.Content>
                      {new Date(node.createdAt).toLocaleString()} -{' '}
                      {node.job.name}
                    </List.Content>
                  </List.Item>
                ))
              ) : (
                <span>{!loading ? 'No Logs Yet' : 'Loading...'}</span>
              )}
            </List>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default LogsView;
