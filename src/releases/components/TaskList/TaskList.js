import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Icon, Label, List, Loader, Message} from 'semantic-ui-react';

import {ALL_TASKS} from '../../queries';

const TaskList = props => {
  const relayId = Buffer.from('ReleaseNode:' + props.releaseId).toString(
    'base64',
  );

  const {loading: tasksLoading, error: tasksError, data: tasksData} = useQuery(
    ALL_TASKS,
    {
      variables: {first: 10, release: relayId},
    },
  );

  const tasks = tasksData && tasksData.allReleaseTasks.edges;

  const stateColors = {
    initialized: 'blue',
    running: 'teal',
    staged: 'purple',
    publishing: 'teal',
    published: 'green',
    canceled: 'grey',
    failed: 'red',
  };

  if (tasksLoading) {
    return <Loader active>Loading...</Loader>;
  }

  if (tasksError) {
    return <Message negative header="Error" content={tasksError.message} />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Message
        header="No Tasks Yet"
        content="There are no tasks to display here"
      />
    );
  }

  return (
    <List>
      {tasks.map(({node}, i) => (
        <List.Item key={node.kfId}>
          <List.Content floated="right">
            <Label basic horizontal color={stateColors[node.state]}>
              {node.state}
            </Label>
          </List.Content>
          <List.Content>
            <Label basic horizontal>
              <Icon name="calendar check" />
              {node.kfId}
            </Label>
            {node.taskService.name}
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default TaskList;
