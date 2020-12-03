import React from 'react';
import {List, Message} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const ReleaseTaskList = ({tasks}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Message
        header="No Tasks Yet"
        content="There are no tasks to display here"
      />
    );
  }

  return (
    <List celled relaxed>
      {tasks.map((task, i) => (
        <List.Item key={task.kfId}>
          <List.Icon name="server" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>
              <Link to={`/releases/services/${task.releaseService.kfId}`}>
                {task.releaseService.kfId}
              </Link>{' '}
              {task.releaseService.name}
            </List.Header>
            <List.Description>
              Release Task instance <em>{task.kfId}</em> is currently in state{' '}
              <em>{task.state}</em>
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default ReleaseTaskList;
