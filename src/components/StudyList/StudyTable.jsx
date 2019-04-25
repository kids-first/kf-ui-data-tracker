import React from 'react';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {withRouter} from 'react-router-dom';

const StudyTable = ({
  studyList,
  loading,
  columns,
  exclude,
  history,
  className,
}) => {
  const StudyTableClass = classes('StudyTable', className);
  if (loading) {
    return <h2>loading studies</h2>;
  }
  const hidden = exclude || ['id', '__typename'];
  const cols = Object.keys(studyList[0].node).filter(
    v => hidden.indexOf(v) < 0,
  );

  return (
    <table className={StudyTableClass}>
      <thead>
        <tr>
          {cols.map(v => (
            <th>{v}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {studyList.map((node, idx) => (
          <tr
            tabindex="0"
            onClick={() => {
              history.push(`/study/${node.node.kfId}/files`);
            }}
          >
            {cols.map(col => (
              <td className={col}>
                {Date.parse(node.node[col]) ? (
                  <TimeAgo date={new Date(node.node[col])} />
                ) : (
                  node.node[col]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default withRouter(StudyTable);
