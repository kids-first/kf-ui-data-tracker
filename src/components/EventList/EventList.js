import React from 'react';
import PropTypes from 'prop-types';
import {List, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {eventType} from '../../common/enums';
import {longDate} from '../../common/dateUtils';

/**
 * Highlights any kf_ids in the description and turns them into links
 * If the study, file, or version does not exist, no highlighting will be
 * applied.
 */
const linkDescription = node => {
  // If no study, it must have been deleted including any files or versions
  if (!node.study) return node.description;

  const ids = {
    SD: node.study && node.study.kfId,
    SF: node.file && node.file.kfId,
    FV: node.version && node.version.kfId,
  };

  const urls = {
    SD: `/study/${ids.SD}/basic-info/info`,
    SF: `/study/${ids.SD}/documents/${ids.SF}`,
    FV: `/study/${ids.SD}/documents/${ids.SF}`,
  };

  const EntityLink = ({entityType}) => (
    <Link to={urls[entityType]} key={ids[entityType]}>
      {ids[entityType] + ' '}
    </Link>
  );

  const entityPattern = /((SD|SF|FV)_\w{8})/g;
  const matches = node.description.split(entityPattern);
  var parts = [];
  for (var i = 0; i < matches.length; i += 3) {
    const link =
      matches[i + 2] in ids && ids[matches[i + 2]] ? (
        <EntityLink key={i + matches[i + 2]} entityType={matches[i + 2]} />
      ) : (
        matches[i + 1]
      );
    parts = [...parts, matches[i], link];
  }

  return parts;
};

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
            {linkDescription(node)}
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
