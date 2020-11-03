import React from 'react';
import {Link} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Label, Table, Rating} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';

const StudyName = ({study, favoriteStudies, setFavoriteStudies}) => {
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
          data-cy="study name"
        >
          <Rating
            className="px-10 pt-10"
            icon="star"
            size="large"
            rating={favoriteStudies.includes(study.kfId) ? 1 : 0}
            maxRating={1}
            onRate={e => {
              e.preventDefault();
              e.stopPropagation();
              const newFav = favoriteStudies.includes(study.kfId)
                ? favoriteStudies.filter(i => i !== study.kfId)
                : [...favoriteStudies, study.kfId];
              localStorage.setItem('favoriteStudies', JSON.stringify(newFav));
              setFavoriteStudies(newFav);
            }}
          />
          <Link
            to={'/study/' + study.kfId + '/basic-info/info'}
            onClick={() => logEvent('click')}
            className="overflow-cell ml-30"
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
  if (investigators.length) {
    return (
      <Label.Group>
        {investigators.map(user => (
          <Label image key={user.id} className="ml-0">
            <img alt={user.displayName} src={user.picture || defaultAvatar} />
            {user.displayName}
          </Label>
        ))}
      </Label.Group>
    );
  }
  return <span>No investigators</span>;
};

export default StudyName;
