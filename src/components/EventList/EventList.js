import React from 'react';
import PropTypes from 'prop-types';
import {List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {eventType} from '../../common/enums';
import {longDate} from '../../common/dateUtils';
/**
 * Event list is used to display user activities
 * Consisted with three parts:
 * - Color-coded icon indication action type
 * - Text descrbing who did what
 * - Timeago text indication when the action happened
 */
const EventList = ({events}) => (
  <List relaxed="very">
    {events &&
      events.length > 0 &&
      events.map(({node}) => (
        <List.Item key={node.id} data-testid="event-item">
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

EventList.propTypes = {
  /** Array of event object*/
  eventList: PropTypes.array,
};

EventList.defaultProps = {
  eventList: [],
};

export default EventList;
