import {Button, Header, Icon, Label, Table} from 'semantic-ui-react';
import React, {useState} from 'react';

import {Amplitude} from '@amplitude/react-amplitude';
import {Link} from 'react-router-dom';
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
        <Table.Cell selectable textAlign="left" data-cy="study name">
          <Link
            to={'/study/' + study.kfId + '/basic-info/info'}
            onClick={() => logEvent('click')}
          >
            <Header size="medium" alt={study.name} floating="left">
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
  const [expand, setExpand] = useState(false);
  if (investigators.length > 0 && investigators.length <= 4) {
    return (
      <Label.Group className="mt-6">
        {investigators.map(user => (
          <Label image key={user.id} className="ml-0 my-2">
            <img alt={user.displayName} src={user.picture || defaultAvatar} />
            {user.displayName}
          </Label>
        ))}
      </Label.Group>
    );
  }
  if (investigators.length > 4) {
    return (
      <Label.Group className="mt-6">
        <Button
          basic
          labelPosition="left"
          floated="right"
          className="mt-6"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setExpand(!expand);
          }}
        >
          <Icon name={expand ? 'caret up' : 'caret down'} />
          {expand ? 'Show Less' : 'Show All'}
        </Button>
        {investigators.slice(0, 4).map(user => (
          <Label image key={user.id} className="ml-0 my-2">
            <img alt={user.displayName} src={user.picture || defaultAvatar} />
            {user.displayName}
          </Label>
        ))}
        {expand && (
          <>
            {investigators.slice(4).map(user => (
              <Label image key={user.id} className="ml-0 my-2">
                <img
                  alt={user.displayName}
                  src={user.picture || defaultAvatar}
                />
                {user.displayName}
              </Label>
            ))}
          </>
        )}
      </Label.Group>
    );
  }
  return <span>No investigators</span>;
};

export default StudyName;
