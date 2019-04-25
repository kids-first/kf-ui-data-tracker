import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import StudyCard from './StudyCard';
import {Icon, GridContainer} from 'kf-uikit';
import StudyGrid from './StudyGrid';
import ToggleButtons from '../ToggleButtons/ToggleButtons';

/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, loading}) => {
  const [view, setView] = useState('grid');
  const title = loading ? 'Loading studies ...' : 'Browse Studies';

  return (
    <div className="bg-lightGrey min-h-screen py-32">
      <GridContainer className={studyListClass}>
        <h1 className="text-blue font-title row-1 cell-12">
          {title}
          {!loading ? (
            <ToggleButtons
              onToggle={({text}) => {
                setView(text.toLowerCase());
              }}
              buttons={[
                {text: 'Grid', icon: 'resources'},
                {text: 'list', icon: 'study'},
              ]}
            />
          ) : null}
        </h1>
        {view === 'grid' ? (
          <StudyGrid {...{loading, studyList}} />
        ) : (
          <h2>list</h2>
        )}
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

export default StudyList;
