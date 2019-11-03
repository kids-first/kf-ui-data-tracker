import React, {useState} from 'react';
import PropTypes from 'prop-types';
import StudyGrid from './StudyGrid';
import StudyTable from './StudyTable';
import {Link} from 'react-router-dom';
import ToggleButtons from '../ToggleButtons/ToggleButtons';
import {
  Container,
  Segment,
  Grid,
  Header,
  Placeholder,
  Input,
  Button,
} from 'semantic-ui-react';

import {withAnalyticsTracking} from '../../analyticsTracking';

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
const StudyList = ({
  studyList,
  loading,
  activeView = 'grid',
  roles,
  tracking: {
    buttonTracking,
    logEvent,
    EVENT_CONSTANTS: {INPUT, STUDY_LIST_},
  },
}) => {
  const [view, setView] = useState(activeView);
  const [searchString, setSearchString] = useState('');
  const isAdmin = roles && roles.includes('ADMIN');

  const logStudyListEvent = (action, payload) =>
    logEvent(STUDY_LIST_[action], payload);

  if (loading) {
    return (
      <Container as={Segment} basic>
        <HeaderSkeleton />
        <StudyGrid loading={loading} studyList={studyList} />
      </Container>
    );
  }

  const filteredStudyList = () => {
    var filteredList = studyList.filter(obj =>
      (obj.node.name + obj.node.shortName + obj.node.kfId)
        .toLowerCase()
        .includes(searchString.toLowerCase()),
    );
    return filteredList;
  };

  return (
    <Grid as={Segment} basic container stackable>
      <Grid.Column width={8} textAlign="left">
        <Header as="h1">Your Studies</Header>
      </Grid.Column>
      <Grid.Column width={8} textAlign="right">
        {isAdmin && (
          <Button
            basic
            primary
            size="mini"
            icon="add"
            content="Add Study"
            as={Link}
            to={`/study/new-study/info`}
            onClick={() =>
              logStudyListEvent('ADD_STUDY', {
                button_text: 'Add Study',
                link: `/study/new-study/info`,
              })
            }
          />
        )}
        <Input
          className="pr-5"
          size="mini"
          iconPosition="left"
          icon="search"
          placeholder="Search by Study Name"
          onChange={(e, {value}) => {
            setSearchString(value);
            logStudyListEvent('SEARCH', {
              input_name: 'Search by Study Name',
              value,
              results_length: filteredStudyList().length,
            });
          }}
          value={searchString}
        />
        <ToggleButtons
          size="mini"
          hideText
          onToggle={({text, active, icon}) => {
            logStudyListEvent('VIEW_TOGGLE', {text, active});
            setView(text.toLowerCase());
          }}
          buttons={[
            {text: 'List', icon: 'list'},
            {text: 'Grid', icon: 'grid layout'},
          ]}
        />
      </Grid.Column>
      <Grid.Row>
        {filteredStudyList().length > 0 ? (
          <Grid.Column>
            {view === 'grid' ? (
              <StudyGrid
                loading={loading}
                studyList={filteredStudyList()}
                isAdmin={isAdmin}
              />
            ) : (
              <StudyTable
                isAdmin={isAdmin}
                loading={loading}
                studyList={filteredStudyList()}
                exclude={[
                  'shortName',
                  'createdAt',
                  'modifiedAt',
                  'bucket',
                  'attribution',
                  'dataAccessAuthority',
                  'externalId',
                  'releaseStatus',
                  'version',
                  'releaseDate',
                  'anticipatedSamples',
                  'awardeeOrganization',
                ]}
              />
            )}
          </Grid.Column>
        ) : (
          <Grid.Column>
            <Header as="h4" disabled textAlign="center">
              No Studies matching your search term. Try searching by Study Name
            </Header>
          </Grid.Column>
        )}
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
  activeView: 'list',
};

export default withAnalyticsTracking(StudyList);
