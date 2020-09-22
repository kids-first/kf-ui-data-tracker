import React from 'react';
import {Feed, Message} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {longDate} from '../../../common/dateUtils';

/**
 * Displays study document timelines with empty message
 */
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
              <Feed.Date className="text-10 lh-inherit">
                {node.createdAt ? (
                  <TimeAgo
                    date={node.createdAt}
                    live={false}
                    title={longDate(node.createdAt)}
                  />
                ) : (
                  'Unknown'
                )}
              </Feed.Date>
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
