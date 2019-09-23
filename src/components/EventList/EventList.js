import React from 'react';
import {List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {eventType} from '../../common/enums';
import {longDate} from '../../common/dateUtils';

const EventList = ({events}) => (
  <List relaxed="very">
    {events.map(({node}) => (
      <List.Item key={node.id}>
        <Icon
          name={
            node.eventType in eventType
              ? eventType[node.eventType].iconName
              : eventType.OTH.iconName
          }
          color={
            node.eventType in eventType
              ? eventType[node.eventType].iconColor
              : eventType.OTH.iconColor
          }
        />
        <List.Content>
          <List.Content floated="right">
            <TimeAgo
              live={false}
              date={node.createdAt}
              title={longDate(node.createdAt)}
            />
          </List.Content>
          {node.description}
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default EventList;
