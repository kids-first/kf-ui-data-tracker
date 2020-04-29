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
import {hasPermission} from '../../common/permissions';
import ColumnSelector from './ColumnSelector';

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
const StudyList = ({studyList, loading, activeView, history, myProfile}) => {
  const [searchString, setSearchString] = useState('');
  const [myStudies, setMystudies] = useState(true);
  // Try to restore the column state from local storage or fall back to the
  // defaults if non are found
  // We track the version off the column state so that we may override it in
  // the future if the schema ever changes
  const existingState = JSON.parse(localStorage.getItem('studyColumns'));
  const [columns, setColumns] = useState(
    existingState && existingState.version === 1
      ? existingState
      : {
          version: 1,
          columns: [
            {key: 'kfId', name: 'Kids First ID', visible: true},
            {key: 'externalId', name: 'phsid/External ID', visible: false},
            {
              key: 'anticipatedSamples',
              name: 'Expected Samples',
              visible: false,
            },
            {key: 'version', name: 'Version', visible: true},
          ],
        },
  );

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
        {myProfile && hasPermission(myProfile, 'view_study') && (
          <Checkbox
            label="Show only my studies"
            checked={myStudies}
            onClick={() => setMystudies(!myStudies)}
          />
        )}
        {myProfile && hasPermission(myProfile, 'add_study') && (
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
        <Grid.Column textAlign="left">
          <ColumnSelector
            columns={columns.columns}
            onChange={cols => {
              const newCols = {...columns, columns: cols};
              localStorage.setItem('studyColumns', JSON.stringify(newCols));
              setColumns(newCols);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {filteredStudyList().length > 0 ? (
          <Grid.Column>
            {(history && history.location.hash === '#grid') ||
            activeView === 'grid' ? (
              <StudyGrid
                loading={loading}
                studyList={filteredStudyList()}
                myProfile={myProfile}
              />
            ) : (
              <StudyTable
                myProfile={myProfile}
                loading={loading}
                studyList={filteredStudyList()}
                columns={columns.columns}
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
