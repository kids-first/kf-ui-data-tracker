import React from 'react';
import PropTypes from 'prop-types';
import {List, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
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
const linkDescription = node => {
  const studyId = node.study ? node.study.kfId : 'NO_STUDY_ID';
  const fileId = node.file ? node.file.kfId : 'NO_FILE_ID';
  const versionId = node.version ? node.version.kfId : 'NO_VERSION_ID';
  var entities = {};
  entities[studyId] = () => (
    <Link to={`/study/${studyId}/basic-info/info`} key={studyId}>
      {studyId + ' '}
    </Link>
  );
  entities[fileId] = () => (
    <Link to={`/study/${studyId}/documents/${fileId}`} key={fileId}>
      {fileId + ' '}
    </Link>
  );
  entities[versionId] = () => (
    <Link to={`/study/${studyId}/documents/${fileId}`} key={versionId}>
      {versionId + ' '}
    </Link>
  );
  const entityPattern = /(SD_\w{8}|FV_\w{8}|SF_\w{8})/g;
  const matches = node.description.split(entityPattern);
  var parts = [];
  for (var i = 0; i < matches.length; i += 2) {
    parts = [
      ...parts,
      matches[i],
      Object.keys(entities).includes(matches[i + 1])
        ? entities[matches[i + 1]]()
        : matches[i + 1],
    ];
  }
  return parts;
};

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
