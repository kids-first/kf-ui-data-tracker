import React from 'react';
import classes from 'classnames';
import {Icon} from 'kf-uikit';
import {Link} from 'react-router-dom';
import StudyCard from './StudyCard';

const StudyGrid = ({studyList, loading, className}) => {
  let studyListClass = classes('StudyList', className);
  return (
    <ul className={studyListClass}>
      {loading
        ? [0, 1, 2, 3].map(n => (
            <li
              className="p-8 cursor-not-allowed w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              key={n}
            >
              <div className="StudyCard--loading">
                <Icon width={28} height={28} kind="study" />
              </div>
            </li>
          ))
        : studyList.map(node => (
            <li
              className="p-8 cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
              key={node.node.id}
            >
              <Link
                className="no-underline"
                to={`/study/${node.node.kfId}/documents`}
              >
                <StudyCard
                  title={node.node.kfId}
                  body={node.node.name || node.node.shortName}
                  lastUpdate={new Date(node.node.modifiedAt)}
                />
              </Link>
            </li>
          ))}
    </ul>
  );
};

export default StudyGrid;
