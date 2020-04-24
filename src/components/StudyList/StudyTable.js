import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Label, Table} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';
import ActionButtons from './ActionButtons';
import Release from './Release';

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

const renderRow = node => {
  // TODO: Filter out only users in the Investigators group
  const investigators =
    node.collaborators.edges.length &&
    node.collaborators.edges.map(({node}) => node);

  return {
    key: node.kfId,
    cells: [
      {
        key: 'name',
        selectable: true,
        className: 'overflow-cell-container',
        content: (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'study name']
                : ['study name'],
            })}
          >
            {({logEvent}) => (
              <Link
                to={'/study/' + node.kfId + '/basic-info/info'}
                onClick={() => logEvent('click')}
                className="overflow-cell"
              >
                <Header size="medium" alt={node.name}>
                  {node.name}
                  <Header.Subheader>
                    <Investigators investigators={investigators} />
                  </Header.Subheader>
                </Header>
              </Link>
            )}
          </Amplitude>
        ),
      },
      {
        key: 'kfId',
        width: 1,
        textAlign: 'center',
        selectable: true,
        content: (
          <Link to={'/study/' + node.kfId + '/basic-info/info'}>
            <code>{node.kfId}</code>
          </Link>
        ),
      },
      {
        key: 'version',
        textAlign: 'center',
        width: 1,
        selectable: true,
        content: (
          <Release
            release={node.release && node.release.node && node.release.node}
          />
        ),
      },
      {
        key: 'actions',
        textAlign: 'right',
        content: <ActionButtons study={node} />,
        width: 1,
      },
    ],
  };
};

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
}) => {
  const [sorting, setSorting] = useState({
    column: 'name',
    direction: 'descending',
  });

  if (loading) {
    return <h2>loading studies</h2>;
  }

  const handleSort = column => () => {
    if (sorting.column !== column) {
      setSorting({
        column,
        direction: 'ascending',
      });
    } else {
      setSorting({
        column,
        direction:
          sorting.direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  };

  const studies = studyList
    .map(({node}) => ({
      ...node,
      version: node.release.node && node.release.node.version,
    }))
    .sort((s1, s2) =>
      sorting.direction === 'ascending'
        ? 1
        : -1 * s1[sorting.column] > s2[sorting.column],
    );

  const header = [
    <Table.HeaderCell
      key="name"
      content="Name"
      sorted={sorting.column === 'name' ? sorting.direction : null}
      onClick={handleSort('name')}
    />,
    <Table.HeaderCell
      key="kfId"
      content="Kids First ID"
      textAlign="center"
      sorted={sorting.column === 'kfId' ? sorting.direction : null}
      onClick={handleSort('kfId')}
    />,
    <Table.HeaderCell
      key="version"
      content="Version"
      textAlign="center"
      sorted={sorting.column === 'version' ? sorting.direction : null}
      onClick={handleSort('version')}
    />,
    {key: 'actions', content: 'Actions', textAlign: 'center'},
  ];

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study table']
          : ['study table'],
      })}
    >
      <Table
        singleLine
        striped
        selectable
        sortable
        celled
        headerRow={header}
        tableData={studies}
        renderBodyRow={renderRow}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
