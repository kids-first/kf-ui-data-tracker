import React, {useState} from 'react';
import PropTypes from 'prop-types';
import StudyGrid from './StudyGrid';
import StudyTable from './StudyTable';
import ToggleButtons from '../ToggleButtons/ToggleButtons';
import {
  Container,
  Segment,
  Grid,
  Header,
  Placeholder,
  Input,
} from 'semantic-ui-react';

/**
 * A skeleton placeholder for the loading state of the study list header
 */
const HeaderSkeleton = () => (
  <Container as={Segment} basic>
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  </Container>
);

/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const StudyList = ({studyList, loading, activeView = 'grid'}) => {
  const [view, setView] = useState(activeView);
  const [searchString, setSearchString] = useState('');

  if (loading) {
    return (
      <Container as={Segment} basic>
        <HeaderSkeleton />
        <StudyGrid loading={loading} studyList={studyList} />
      </Container>
    );
  }

  const filteredStudyList = () => {
    var filteredList = studyList.filter(
      obj =>
        (obj.node.name &&
          obj.node.name.toLowerCase().includes(searchString.toLowerCase())) ||
        (obj.node.shortName &&
          obj.node.shortName
            .toLowerCase()
            .includes(searchString.toLowerCase())),
    );
    return filteredList;
  };

  return (
    <Grid as={Segment} basic container stackable>
      <Grid.Column computer={11} tablet={8}>
        <Header as="h1">Your Studies</Header>
      </Grid.Column>
      <Grid.Column
        computer={5}
        tablet={8}
        stretched
        verticalAlign="middle"
        textAlign="right"
      >
        <Input
          className="pr-5"
          size="mini"
          iconPosition="left"
          icon="search"
          placeholder="Search by Study Name"
          onChange={(e, {value}) => {
            setSearchString(value);
          }}
          value={searchString}
        />
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
      <Grid.Row>
        <Grid.Column>
          {view === 'grid' ? (
            <StudyGrid loading={loading} studyList={filteredStudyList()} />
          ) : (
            <StudyTable
              loading={loading}
              studyList={filteredStudyList()}
              exclude={['createdAt', 'modifiedAt']}
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

StudyList.propTypes = {
  /** Array of study object*/
  studyList: PropTypes.array,
  /** Loading state of the studyList*/
  loading: PropTypes.bool,
  /** view to show (grid | list) */
  activeView: PropTypes.oneOf(['grid', 'list']),
};

StudyList.defaultProps = {
  studyList: [],
  activeView: 'grid',
};

export default StudyList;
