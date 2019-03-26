import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import StudyCard from './StudyCard';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, history}) => {
  let studyListClass = classes('StudyList', className);

  if (studyList) {
    return (
      <div className="bg-lightGrey">
        <h1 className="m-0 pt-12 pl-12 text-blue font-title pl-4">
          Browse Studies
        </h1>
        <ul className={studyListClass}>
          {studyList.map(node => (
            <li
              className="cursor-pointer w-full sm:w-1/2 md:w-1/3"
              key={node.node.id}
              onClick={() => {
                history.push(`/study/${node.node.kfId}/files`);
              }}
            >
              <StudyCard
                title={node.node.kfId}
                body={node.node.name || node.node.shortName}
                lastUpdate={new Date(node.node.modifiedAt)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <h3 className="pl-12 text-blue">You don't have any studies yet.</h3>;
  }
};

StudyList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  studyList: PropTypes.array,
};

StudyList.defaultProps = {
  className: null,
  studyList: [],
};

export default withRouter(StudyList);
