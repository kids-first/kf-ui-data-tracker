import React from 'react';
import {Icon, List} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';

const JobsList = ({jobs}) => (
  <List divided relaxed>
    {jobs.length ? (
      jobs.map(({node}) => (
        <List.Item key={node.id}>
          {node.failing && (
            <List.Content floated="right">
              <Icon color="red" name="warning sign" />
            </List.Content>
          )}
          <Icon name={node.scheduled ? 'clock' : 'wrench'} />
          <List.Content>
            <List.Header>{node.name}</List.Header>
            {node.scheduled && (
              <List.Description>
                {node.active ? 'Active' : 'Disabled'} - Next Execution:{' '}
                {<TimeAgo date={node.enqueuedAt} live={false} />}
              </List.Description>
            )}
          </List.Content>
        </List.Item>
      ))
    ) : (
      <span>No Jobs are scheduled or have run</span>
    )}
  </List>
);

export default JobsList;
