import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import StudyCard from './StudyCard';
import {Icon, GridContainer} from 'kf-uikit';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, loading, history}) => {
  let studyListClass = classes('StudyList', className);
  const title = loading ? 'Loading studies ...' : 'Browse Studies';
  const loadingCount = [1, 2, 3, 4];
  return (
    <div className="bg-lightGrey min-h-screen py-32">
      <GridContainer className={studyListClass}>
        <h1 className="text-blue font-title row-1 cell-12">{title}</h1>
        {loading
          ? loadingCount.map(n => (
              <div
                className="cursor-not-allowed cell-12 sm:cell-6 md:cell-4 lg:cell-3"
                key={n}
              >
                <div className="StudyCard--loading">
                  <Icon width={28} height={28} kind="study" />
                </div>
              </div>
            ))
          : studyList.map(node => (
              <div
                className="cursor-pointer cell-12 sm:cell-6 md:cell-4 lg:cell-3"
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
              </div>
            ))}
      </GridContainer>
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
