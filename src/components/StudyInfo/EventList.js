import React from 'react';
import {List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {eventType} from '../../common/fileUtils';

const EventList = ({events}) => (
  <List relaxed="very">
    {events.map(({node}) => (
      <List.Item key={node.id}>
        <Icon
          name={eventType[node.eventType].iconName}
          color={eventType[node.eventType].iconColor}
        />
        <List.Content>
          <List.Content floated="right">
            <TimeAgo live={false} date={node.createdAt} />
          </List.Content>
          {node.description}
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default EventList;
