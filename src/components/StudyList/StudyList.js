import React, {useState} from 'react';
import PropTypes from 'prop-types';
import StudyGrid from './StudyGrid';
import StudyTable from './StudyTable';
import ToggleButtons from '../ToggleButtons/ToggleButtons';
import {Container, Grid, Header, Placeholder} from 'semantic-ui-react';

/**
 * A skeleton placeholder for the loading state of the study list header
 */
const HeaderSkeleton = () => (
  <Container style={{marginTop: 30}}>
    <Placeholder style={{marginBottom: 50}}>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  </Container>
);

/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({className, studyList, loading, activeView = 'grid'}) => {
  const [view, setView] = useState(activeView);

  return (
    <Grid container stackable style={{marginTop: 30}}>
      <Grid.Column computer={11} tablet={8}>
        <Header as="h1">Your Studies</Header>
      </Grid.Column>
      <Grid.Column
        computer={5}
        tablet={8}
        stretched
        verticalAlign="center"
        textAlign="right"
      >
        <ToggleButtons
          onToggle={({text}) => {
            setView(text.toLowerCase());
          }}
          buttons={[
            {text: 'Grid', icon: 'grid layout'},
            {text: 'List', icon: 'list'},
          ]}
        />
      </Grid.Column>
      <main>
        {view === 'grid' ? (
          <StudyGrid loading={loading} studyList={studyList} />
        ) : (
          <StudyTable loading={loading} studyList={studyList} />
        )}
      </main>
    </Grid>
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
