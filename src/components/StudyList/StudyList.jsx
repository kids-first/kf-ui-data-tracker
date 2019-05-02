import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import StudyCard from './StudyCard';
import {Icon, GridContainer} from 'kf-uikit';
import StudyGrid from './StudyGrid';
import StudyTable from './StudyTable';
import ToggleButtons from '../ToggleButtons/ToggleButtons';

/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, loading, activeView = 'grid'}) => {
  const [view, setView] = useState(activeView);

  return (
    <div className="bg-lightGrey min-h-screen py-32">
      <GridContainer className={studyListClass}>
        <h1 className="text-blue font-title row-1 cell-12">
          {title}
          {!loading && (
            <ToggleButtons
              onToggle={({text}) => {
                setView(text.toLowerCase());
              }}
              buttons={[
                {text: 'grid', icon: 'resources'},
                {text: 'list', icon: 'study'},
              ]}
            />
          )}
        </header>
        <main>
          {view === 'grid' ? (
            <StudyGrid loading={loading} studyList={studyList} />
          ) : (
            <StudyTable loading={loading} studyList={studyList} />
          ) : (
            <StudyGrid loading={loading} studyList={studyList} />
          )}
        </main>
      </div>
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
  /** view to show (grid | list) */
  activeView: PropTypes.oneOf(['grid', 'list']),
};

StudyList.defaultProps = {
  className: null,
  studyList: [],
  activeView: 'grid',
};

export default StudyList;
