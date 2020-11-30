import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Link} from 'react-router-dom';
import {Icon, Popup, Table} from 'semantic-ui-react';
import AvatarTimeAgo from '../../components/AvatarTimeAgo/AvatarTimeAgo';

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
              <Link
                to={'/releases/history/' + release.kfId}
                onClick={() => logEvent('click')}
              >
                {release.version + ' '}
                <Icon name="tag" />
              </Link>
            }
            content={
              <>
                {release.version} <Icon name="tag" /> -{' '}
                <code>{release.kfId}</code>
                <AvatarTimeAgo
                  size="tiny"
                  showUsername
                  creator={release.creator}
                  createdAt={release.createdAt}
                />
              </>
            }
          />
        </Table.Cell>
      )}
    </Amplitude>
  );
};

export default Release;
