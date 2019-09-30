import React from 'react';
import TimeAgo from 'react-timeago';
import {Link, withRouter} from 'react-router-dom';
import {Table, Icon, Popup} from 'semantic-ui-react';
import FileCounts from '../StudyInfo/FileCounts';
import CavaticaCounts from '../StudyInfo/CavaticaCounts';
import {longDate} from '../../common/dateUtils';
import {
  countStudyNotification,
  countProjectNotification,
  countFileNotification,
  trackedStudyFields,
} from '../../common/notificationUtils';
/**
 * Renders a single row in the table
 */
const TableValue = ({row, col, title}) => {
  switch (col) {
    case 'files':
      return <FileCounts files={row[col].edges} title={title} />;
    case 'projects':
      return <CavaticaCounts projects={row[col].edges} title={title} />;
    case 'createdAt':
    case 'modifiedAt':
      return (
        <TimeAgo
          date={new Date(row[col])}
          title={longDate(new Date(row[col]))}
          live={false}
        />
      );
    case 'kfId':
      return (
        <>
          {row[col].kfId}
          <Popup
            inverted
            position="top center"
            size="small"
            content={
              trackedStudyFields.length -
              row[col].missingValue +
              '/' +
              trackedStudyFields.length +
              ' complete'
            }
            trigger={
              <Link
                to={`/study/${title}/basic-info/info`}
                className="ml-10"
                onClick={e => e.stopPropagation()}
              >
                <Icon
                  name={
                    row[col].missingValue > 0
                      ? 'clipboard list'
                      : 'clipboard check'
                  }
                  color={row[col].missingValue > 0 ? 'red' : 'grey'}
                />
              </Link>
            }
          />
        </>
      );
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
  isAdmin,
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

  // Formats the study objects and computes file state counts
  const studies = studyList.map(({node}) =>
    cols.reduce((row, col) => {
      row[col] =
        col !== 'kfId'
          ? node[col]
          : {
              kfId: node.kfId,
              missingValue: isAdmin ? countStudyNotification(node) : 0,
              missingProject: isAdmin ? countProjectNotification(node) : 0,
              requiredFileChanges: isAdmin ? countFileNotification(node) : 0,
            };
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
              if (clickable) history.push(`/study/${row.kfId.kfId}/documents`);
            }}
          >
            {cols.map((col, idx) => (
              <Table.Cell key={idx}>
                <TableValue row={row} col={col} title={row.kfId.kfId} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default withRouter(StudyTable);
