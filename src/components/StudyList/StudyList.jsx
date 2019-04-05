import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import StudyCard from './StudyCard';
import {Icon} from 'kf-uikit';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, loading, history}) => {
  let studyListClass = classes('StudyList', className);
  const title = loading ? 'Loading studies ...' : 'Browse Studies';
  const loadingCount = [1, 2, 3, 4];
  return (
    <div className="bg-lightGrey">
      <h1 className="m-0 pt-12 text-blue font-title pl-8 BodyContent">
        {title}
      </h1>
      <ul className={studyListClass}>
        {loading
          ? loadingCount.map(n => (
              <li
                className="cursor-not-allowed w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                key={n}
              >
                <div className="StudyCard rounded-lg flex justify-center items-center">
                  <Icon
                    className="text-mediumGrey"
                    width={28}
                    height={28}
                    kind="study"
                  />
                </div>
              </li>
            ))
          : studyList.map(node => (
              <li
                className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
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
};

StudyList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  studyList: PropTypes.array,
  /** Loading state of the studyList*/
  loading: PropTypes.bool,
};

StudyList.defaultProps = {
  className: null,
  studyList: [],
};

export default withRouter(StudyList);
