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
  Checkbox,
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
const StudyList = ({
  studyList,
  loading,
  activeView,
  roles,
  history,
  myProfile,
}) => {
  const [searchString, setSearchString] = useState('');
  const [myStudies, setMystudies] = useState(true);
  const isAdmin = roles && roles.includes('ADMIN');

  if (loading) {
    return (
      <Container as={Segment} basic>
        <HeaderSkeleton />
        <StudyGrid loading={loading} studyList={studyList} />
      </Container>
    );
  }
  const myStudyList =
    myProfile && myProfile.studies.edges.length > 0
      ? myProfile.studies.edges.map(({node}) => node.kfId)
      : [];

  const conactCollaborators = collaborators => {
    return collaborators.length > 0
      ? collaborators
          .map(({node}) =>
            [node.username, node.firstName, node.lastName].join(' '),
          )
          .join(' ')
      : '';
  };

  const filteredStudyList = () => {
    const originList = myStudies
      ? studyList.filter(({node}) => myStudyList.includes(node.kfId))
      : studyList;
    const filteredList = originList.filter(
      ({
        node: {
          name,
          shortName,
          kfId,
          collaborators: {edges},
        },
      }) =>
        [name, shortName, kfId, conactCollaborators(edges)]
          .join(' ')
          .toLowerCase()
          .includes(searchString.toLowerCase()),
    );
    return filteredList;
  };

  return (
    <Grid as={Segment} basic container stackable>
      <Grid.Column width={16} textAlign="right">
        <Header as="h1" floated="left">
          Your Investigator Studies
        </Header>
        <Checkbox
          label="Show only my studies"
          checked={myStudies}
          onClick={() => setMystudies(!myStudies)}
        />
        {isAdmin && (
          <Button
            basic
            primary
            className="ml-10"
            size="mini"
            icon="add"
            content="Add Study"
            as={Link}
            to={`/study/new-study/info`}
          />
        )}
        <Input
          aria-label="search studies"
          className="ml-10"
          size="mini"
          iconPosition="left"
          icon="search"
          placeholder="Search by study name or collaborator"
          onChange={(e, {value}) => {
            setSearchString(value);
          }}
          value={searchString}
        />
        <ToggleButtons
          className="ml-10"
          size="mini"
          hideText
          onToggle={({key}) => {
            history.push('#' + key);
          }}
          selected={history && history.location.hash.slice(1)}
          buttons={[
            {key: 'list', text: 'List', icon: 'list'},
            {key: 'grid', text: 'Grid', icon: 'grid layout'},
          ]}
        />
      </Grid.Column>
      <Grid.Row>
        {filteredStudyList().length > 0 ? (
          <Grid.Column>
            {(history && history.location.hash === '#grid') ||
            activeView === 'grid' ? (
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
                  'collaborators',
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

export default StudyList;
