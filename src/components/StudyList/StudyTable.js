import React from 'react';
import TimeAgo from 'react-timeago';
import {withRouter} from 'react-router-dom';
import {Table, Popup, Icon, Label, List} from 'semantic-ui-react';
import {versionState} from '../../common/fileUtils';

const PopupBadge = ({state, count}) => (
  <Popup
    inverted
    position="top center"
    size="small"
    content={versionState[state].title}
    trigger={
      <List.Item>
        <Label
          circular
          empty
          size="mini"
          color={versionState[state].labelColor}
        />{' '}
        {count}
      </List.Item>
    }
  />
);

/**
 * Renders a summary of files in a study
 */
const StudyFileBadges = ({files}) => (
  <List horizontal>
    <List.Item>
      <Icon name="file" />
      {Object.values(files).reduce((x, y) => x + y, 0)} files
    </List.Item>
    {['PEN', 'CHN', 'APP', 'PRC'].map(
      state =>
        state in files && (
          <PopupBadge state={state} count={files[state]} key={state} />
        ),
    )}
  </List>
);

/**
 * Renders a single row in the table
 */
const TableValue = ({row, col}) => {
  switch (col) {
    case 'files':
      return <StudyFileBadges files={row[col]} />;
    case 'createdAt':
    case 'modifiedAt':
      return <TimeAgo date={new Date(row[col])} />;
    default:
      return row[col];
  }
};

const StudyTable = ({
  studyList,
  loading,
  exclude = [],
  clickable = true,
  history,
}) => {
  if (loading) {
    return <h2>loading studies</h2>;
  }
  const hidden = ['id', '__typename', ...exclude];
  const cols = Object.keys(
    studyList.length > 0
      ? studyList[0].node
      : {'No access to any studies yet': []},
  ).filter(v => hidden.indexOf(v) < 0);

  /**
   * Returns the count of each file state within the study
   */
  const stateCounts = files => {
    // Flattens to an array of states
    const states = files.edges.map(
      ({node: {versions}}) => versions.edges[0].node.state,
    );
    return states.reduce((count, state) => {
      count[state] = (count[state] || 0) + 1;
      return count;
    }, {});
  };

  // Formats the study objects and computes file state counts
  const studies = studyList.map(({node}) =>
    cols.reduce((row, col) => {
      row[col] = col !== 'files' ? node[col] : stateCounts(node[col]);
      return row;
    }, {}),
  );

  const tableHeaderCell = text => {
    const headerText =
      text === 'kfId'
        ? 'Study ID'
        : text
            .replace(/([A-Z])/g, ' $1')
            .charAt(0)
            .toUpperCase() + text.replace(/([A-Z])/g, ' $1').slice(1);
    return <Table.HeaderCell key={text}>{headerText}</Table.HeaderCell>;
  };
  return (
    <Table striped selectable columns={Object.keys(studies[0]).length}>
      <Table.Header>
        <Table.Row>{cols.map(v => tableHeaderCell(v))}</Table.Row>
      </Table.Header>
      <Table.Body>
        {studies.map((row, idx) => (
          <Table.Row
            tabIndex="0"
            key={idx}
            onClick={() => {
              if (clickable) history.push(`/study/${row.kfId}/documents`);
            }}
          >
            {cols.map((col, idx) => (
              <Table.Cell key={idx}>
                <TableValue row={row} col={col} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default withRouter(StudyTable);
