import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Table} from 'semantic-ui-react';
import ActionButtons from './ActionButtons';
import Release from './Release';

const renderRow = node => ({
  key: node.kfId,
  cells: [
    {
      key: 'name',
      selectable: true,
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
            >
              <Header size="medium">
                {node.name}
                <Header.Subheader>
                  {(node.collaborators.edges.length &&
                    node.collaborators.edges[0].node.username) ||
                    node.shortName}
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
});

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
}) => {
  if (loading) {
    return <h2>loading studies</h2>;
  }

  const studies = studyList.map(({node}) => node);

  const header = [
    {key: 'name', content: 'Name'},
    {key: 'kfId', content: 'Kids First ID', textAlign: 'center'},
    {key: 'version', content: 'Version', textAlign: 'center'},
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
