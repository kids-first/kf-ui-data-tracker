import React from 'react';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {withRouter} from 'react-router-dom';

const StudyTable = ({
  studyList,
  loading,
  columns,
  exclude = [],
  clickable = true,
  history,
  className,
}) => {
  const StudyTableClass = classes(
    'StudyTable',
    'grid-container',
    'grid-container--collapsed-rows',
    'px-0',
    className,
  );
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
    <table className={StudyTableClass}>
      <thead className="hidden sm:block cell-12 ">
        <tr className="grid-container grid-container--fullWidth grid-container--collapsed ">
          {cols.map(v => (
            <th className="row-1 cell-2" key={v}>
              {v}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="cell-1-12">
        {studyList.map((node, idx) => (
          <tr
            tabIndex="0"
            className="grid-container grid-container--collapsed grid-container--fullWidth"
            key={node.node.kfId}
            onClick={() => {
              if (clickable) history.push(`/study/${node.node.kfId}/documents`);
            }}
          >
            {cols.map((col, idx) => {
              // TODO: abstract this datum specific styling out of the component
              const datumClass = classes(
                col,
                'px-20',
                'py-0',
                {
                  hidden: col === 'name',
                  'sm:block': col === 'name',
                  'row-1 cell-12 pt-20': col === 'shortName',
                  'font-title font-black sm:font-medium': col === 'shortName',
                  'text-xl text-blue': col === 'shortName',
                  'row-2 pt-0 pb-12': col === 'kfId',
                  'row-3 cell-2 pb-20 text-grey sm:text-black': [
                    'modifiedAt',
                    'createdAt',
                  ].includes(col),
                },

                'sm:p-20',
                'sm:font-body sm:text-sm',
                'sm:row-1',
                'sm:cell-2',
              );
              return (
                <td className={datumClass} key={col}>
                  {Date.parse(node.node[col]) ? (
                    <span>
                      <small className="sm:hidden text-grey lowercase">
                        {col.split('A')[0]}
                      </small>
                      <br />
                      <TimeAgo date={new Date(node.node[col])} />
                    </span>
                  ) : (
                    node.node[col]
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default withRouter(StudyTable);
