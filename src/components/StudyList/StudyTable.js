import React from 'react';
import TimeAgo from 'react-timeago';
import {Link, withRouter} from 'react-router-dom';
import {Table, Icon, Popup} from 'semantic-ui-react';
import FileCounts from '../StudyInfo/FileCounts';
import CavaticaCounts from '../StudyInfo/CavaticaCounts';
import CavaticaLogo from '../../assets/CavaticaLogo';
import {longDate} from '../../common/dateUtils';
import {
  countStudyNotification,
  countProjectNotification,
  countFileNotification,
  trackedStudyFields,
  trackedResearchStudyFields,
} from '../../common/notificationUtils';
import {hasPermission} from '../../common/permissions';

/**
 * Renders a single row in the table
 */
const TableValue = ({row, col, title, isResearch}) => {
  const coordUrl = process.env.REACT_APP_COORD_UI + 'releases/';
  switch (col) {
    case 'files':
      return (
        <FileCounts
          files={row[col].edges}
          showWarning={myProfile && hasPermission(myProfile, 'add_file')}
          title={title}
          hideIcon
          wrap
        />
      );
    case 'projects':
      return (
        <CavaticaCounts
          projects={row[col].edges}
          title={title}
          hideIcon
          wrap={!isResearch}
          isResearch={isResearch}
        />
      );
    case 'createdAt':
    case 'modifiedAt':
      return (
        <TimeAgo
          date={new Date(row[col])}
          title={longDate(new Date(row[col]))}
          live={false}
        />
      );
    case 'description':
      return (
        <Link
          to={
            isResearch
              ? `/research-study/${title}/basic-info`
              : `/study/${title}/basic-info/info`
          }
          onClick={e => e.stopPropagation()}
          className={
            myProfile && hasPermission(myProfile, 'change_study')
              ? 'text-red'
              : null
          }
        >
          {isResearch
            ? trackedResearchStudyFields.length -
              row[col].missingValue +
              '/' +
              trackedResearchStudyFields.length +
              ' complete'
            : trackedStudyFields.length -
              row[col].missingValue +
              '/' +
              trackedStudyFields.length +
              ' complete'}
        </Link>
      );
    case 'release':
      const verson = row[col].node ? row[col].node.version : 'Not Published';
      const time = row[col].node
        ? longDate(new Date(row[col].node.createdAt))
        : null;
      const kfId = row[col].node ? row[col].node.kfId : '';
      return (
        <Popup
          inverted
          position="top center"
          content={'Published on ' + time}
          disabled={!time}
          trigger={
            <>
              {verson === 'Not Published' ? (
                <span className="text-gray">{verson}</span>
              ) : (
                <a
                  href={`${coordUrl + kfId}`}
                  onClick={e => e.stopPropagation()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {verson + ' '}
                  <Icon link size="small" name="external" />
                </a>
              )}
            </>
          }
        />
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
  isResearch,
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
      if (col === 'description') {
        row[col] = {
          missingValue: isAdmin ? countStudyNotification(node, isResearch) : 0,
          missingProject: isAdmin ? countProjectNotification(node) : 0,
          requiredFileChanges: isAdmin ? countFileNotification(node) : 0,
        };
      } else if (col === 'name') {
        row[col] =
          node.name && node.name.length > 0 ? node.name : node.shortName;
      } else {
        row[col] = node[col];
      }
      return row;
    }, {}),
  );

  const tableHeaderCell = text => {
    var headerText =
      text
        .replace(/([A-Z])/g, ' $1')
        .charAt(0)
        .toUpperCase() + text.replace(/([A-Z])/g, ' $1').slice(1);

    switch (text) {
      case 'kfId':
        return (
          <Table.HeaderCell key={text}>Kids First Study ID</Table.HeaderCell>
        );
      case 'name':
        return <Table.HeaderCell key={text}>Study Name</Table.HeaderCell>;
      case 'description':
        return (
          <Table.HeaderCell key={text}>
            <Icon name="clipboard list" color="grey" />
            Study Info
          </Table.HeaderCell>
        );
      case 'projects':
        return (
          <Table.HeaderCell key={text}>
            <CavaticaLogo className="mr-5 vertical-middle" />
            <span>Cavatica Projects</span>
          </Table.HeaderCell>
        );
      case 'files':
        return (
          <Table.HeaderCell key={text}>
            <Icon name="file" color="grey" />
            Documents
          </Table.HeaderCell>
        );
      case 'release':
        return (
          <Table.HeaderCell key={text}>
            <Icon name="tag" color="grey" />
            Latest Release
          </Table.HeaderCell>
        );
      default:
        return <Table.HeaderCell key={text}>{headerText}</Table.HeaderCell>;
    }
  };
  return (
    <Table striped selectable columns={Object.keys(studies[0]).length}>
      <Table.Header>
        <Table.Row>{cols.map(v => tableHeaderCell(v))}</Table.Row>
      </Table.Header>
      <Table.Body>
        {studies.map((row, idx) => (
          <Table.Row
            data-testid="table-row"
            tabIndex="0"
            key={idx}
            onClick={() => {
              if (clickable)
                history.push(
                  isResearch
                    ? `/research-study/${row.kfId}/basic-info`
                    : `/study/${row.kfId}/documents`,
                );
            }}
          >
            {cols.map((col, idx) => (
              <Table.Cell key={idx}>
                <TableValue
                  row={row}
                  col={col}
                  title={row.kfId}
                  isResearch={isResearch}
                />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default withRouter(StudyTable);
