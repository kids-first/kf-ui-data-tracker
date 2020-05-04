import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import TimeAgo from 'react-timeago';
import {Icon, Popup, Table} from 'semantic-ui-react';
import {KF_COORD_UI} from '../../common/globals';

/**
 * Formats a link to a release
 */
const Release = ({release}) => {
  if (!release) return <Table.Cell width="1">-</Table.Cell>;

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'release version']
          : ['release version'],
      })}
    >
      {({logEvent}) => (
        <Table.Cell singleLine width="1">
          <Popup
            header={release.name}
            position="top center"
            trigger={
              <a
                href={`${KF_COORD_UI}/releases/${release.kfId}`}
                onClick={() => logEvent('click')}
              >
                {release.version + ' '}
                <Icon.Group>
                  <Icon name="tag" />
                  <Icon corner="top right" name="external" />
                </Icon.Group>
              </a>
            }
            content={
              <>
                {release.version} <Icon name="tag" /> -{' '}
                <code>{release.kfId}</code>
                <p>
                  Published <TimeAgo date={release.createdAt} />
                </p>
                <em>View in the Release Coordinator</em>
              </>
            }
          />
        </Table.Cell>
      )}
    </Amplitude>
  );
};

export default Release;
