import React from 'react';
import {Feed, Message} from 'semantic-ui-react';
import defaultAvatar from '../../../assets/defaultAvatar.png';

/**
 * Displays study document timelines with empty message
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
    <Feed.Date className="text-10 lh-inherit">
      {date ? d.toLocaleDateString(undefined, options) : 'Unknown'}
    </Feed.Date>
  );
};

const Timelines = ({eventData, stripFileId}) => {
  const events =
    eventData && eventData.allEvents ? eventData.allEvents.edges : [];

  return (
    <Feed>
      {events.length > 0 ? (
        events.map(({node}) => (
          <Feed.Event key={node.id}>
            <Feed.Label image={node.user.picture || defaultAvatar} />
            <Feed.Content>
              <TimelineDate date={node.createdAt} />
              <Feed.Summary className="text-normal">
                {stripFileId && node.description.includes(stripFileId)
                  ? node.description.replace(stripFileId, '')
                  : node.description}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        ))
      ) : (
        <Message
          warning
          icon="warning circle"
          header="No Data"
          content="No events found for this document"
        />
      )}
    </Feed>
  );
};

export default Timelines;
