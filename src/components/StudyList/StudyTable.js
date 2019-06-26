import React from 'react';
import TimeAgo from 'react-timeago';
import {withRouter} from 'react-router-dom';
import {Table} from 'semantic-ui-react';

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

  return (
    <Table striped selectable singleLine columns="five">
      <Table.Header>
        <Table.Row>
          {cols.map(v => (
            <Table.HeaderCell key={v}>{v}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {studyList.map((node, idx) => (
          <Table.Row
            tabIndex="0"
            key={node.node.kfId}
            onClick={() => {
              if (clickable) history.push(`/study/${node.node.kfId}/documents`);
            }}
          >
            {cols.map((col, idx) => {
              return (
                <Table.Cell width={1} key={col}>
                  {Date.parse(node.node[col]) ? (
                    <TimeAgo date={new Date(node.node[col])} />
                  ) : (
                    node.node[col]
                  )}
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default withRouter(StudyTable);
