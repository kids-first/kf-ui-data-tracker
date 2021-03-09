import {Feed, Icon, Image, Message} from 'semantic-ui-react';

import React from 'react';
import defaultAvatar from '../../../assets/defaultAvatar.png';

/**
 * Displays data review timelines with empty message
 */
const TimelineDate = ({date}) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const d = date ? new Date(date) : '';
  return (
    <Feed.Date>
      {date ? d.toLocaleDateString(undefined, options) : 'Unknown'}
    </Feed.Date>
  );
};

const ReviewTimelines = ({eventData, downloadFileMutation}) => {
  const events = eventData && eventData.edges.length > 0 ? eventData.edges : [];
  const actionType = {
    STA: {
      iconName: 'play',
      iconColor: 'yellow',
    },
    WAI: {
      iconName: 'pause',
      iconColor: 'orange',
    },
    CLO: {
      iconName: 'stop',
      iconColor: 'black',
    },
    REO: {
      iconName: 'play',
      iconColor: 'yellow',
    },
    APP: {iconName: 'check', iconColor: 'green'},
    OTH: {iconName: 'question', iconColor: 'grey'},
  };

  return (
    <Feed>
      {events.length > 0 ? (
        events.map(({node}) => (
          <Feed.Event key={node.id}>
            <Feed.Label>
              <Icon
                name={
                  node.eventType.split('_')[1] in actionType
                    ? actionType[node.eventType.split('_')[1]].iconName
                    : actionType.OTH.iconName
                }
                color={
                  node.eventType.split('_')[1] in actionType
                    ? actionType[node.eventType.split('_')[1]].iconColor
                    : actionType.OTH.iconColor
                }
              />
            </Feed.Label>
            <Feed.Content className="ml-10">
              <Feed.Summary className="text-normal">
                <Image
                  className="small-avatar"
                  src={node.user.picture || defaultAvatar}
                  avatar
                />
                {node.description}
                <TimelineDate date={node.createdAt} />
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        ))
      ) : (
        <Message
          warning
          icon="warning circle"
          header="No Data"
          content="No events found for this data review"
        />
      )}
    </Feed>
  );
};

export default ReviewTimelines;
