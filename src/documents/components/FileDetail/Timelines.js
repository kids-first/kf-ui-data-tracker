import React from 'react';
import {Feed, Message, Icon} from 'semantic-ui-react';
import VersionCard from './VersionCard';

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

const Timelines = ({eventData, stripFileId, downloadFileMutation}) => {
  const events =
    eventData && eventData.allEvents ? eventData.allEvents.edges : [];
  const actionType = {
    CRE: {
      iconName: 'upload',
      iconColor: 'green',
    },
    UPD: {
      iconName: 'pencil',
      iconColor: 'yellow',
    },
    DEL: {
      iconName: 'trash',
      iconColor: 'red',
    },
    OTH: {iconName: 'question', iconColor: 'red'},
  };

  return (
    <Feed>
      {events.length > 0 ? (
        events.map(({node}) => (
          <Feed.Event key={node.id}>
            <Feed.Label className="pt-5">
              <Icon
                name={
                  node.eventType.split('_')[1] in actionType
                    ? actionType[node.eventType.split('_')[1]].iconName
                    : actionType.OTH.iconName
                }
              />
            </Feed.Label>
            <Feed.Content className="ml-10">
              <TimelineDate date={node.createdAt} />
              <Feed.Summary className="text-normal">
                {stripFileId && node.description.includes(stripFileId)
                  ? node.description.replace(stripFileId, '')
                  : node.description}
              </Feed.Summary>
              {node.eventType.includes('FV_') && (
                <VersionCard
                  version={node.version}
                  downloadFileMutation={downloadFileMutation}
                  studyId={node.study.kfId}
                  fileId={node.file.kfId}
                />
              )}
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
