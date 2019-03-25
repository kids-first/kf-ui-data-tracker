import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import {GridContainer} from '../Grid';
import StudyCard from './StudyCard';

/**
 * Displays unordered studies in grid view (include empty stage message)
 */

const StudyList = ({className, studyList, history}) => {
  let studyListClass = classes(
    'study-list',
    'grid-container',
    'list-reset',
    className,
  );

  return (
    <div>
      {studyList ? (
        <div className="bg-lightGrey">
          <GridContainer>
            <h1 className="col-12 text-blue font-title pl-4">Browse Studies</h1>
          </GridContainer>
          <section className="col-12">
            <ul className={studyListClass}>
              {studyList.map(node => (
                <li
                  className="col-4 study-list--item cursor-pointer"
                  key={node.node.id}
                  onClick={() => {
                    history.push(`/study/${node.node.kfId}/files`);
                  }}
                >
                  <StudyCard
                    className="p-3 shadow-md border-transparent hover:shadow-lg "
                    title={node.node.kfId}
                    body={node.node.name || node.node.shortName}
                    lastUpdate={new Date(node.node.modifiedAt)}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <h3 className="pl-12 text-blue">You don't have any studies yet.</h3>
      )}
    </div>
  );
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
