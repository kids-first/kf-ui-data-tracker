import React from 'react';
import {Link} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Label, Table} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';

const StudyName = ({study}) => {
  // TODO: Filter out only users in the Investigators group
  const investigators =
    study.collaborators.edges.length &&
    study.collaborators.edges.map(({node}) => node);

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study name']
          : ['study name'],
      })}
    >
      {({logEvent}) => (
        <Table.Cell
          selectable
          className="overflow-cell-container"
          textAlign="left"
        >
          <Link
            to={'/study/' + study.kfId + '/basic-info/info'}
            onClick={() => logEvent('click')}
            className="overflow-cell"
          >
            <Header size="medium" alt={study.name}>
              {study.name}
              <Header.Subheader>
                <Investigators investigators={investigators} />
              </Header.Subheader>
            </Header>
          </Link>
        </Table.Cell>
      )}
    </Amplitude>
  );
};

const Investigators = ({investigators}) => {
  if (investigators.length) {
    return (
      <Label.Group>
        {investigators.map(user => (
          <Label image key={user.id}>
            <img alt={user.username} src={user.picture || defaultAvatar} />
            {user.username}
          </Label>
        ))}
      </Label.Group>
    );
  }
  return <span>No investigators</span>;
};

export default StudyName;
