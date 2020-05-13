import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
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
  Popup,
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
  const [myStudies, setMyStudies] = useState(
    localStorage.getItem('onlyMyStudies') !== null
      ? JSON.parse(localStorage.getItem('onlyMyStudies'))
      : true,
  );
  const [fullWidth, setFullWidth] = useState(
    localStorage.getItem('fullWidth') !== null
      ? JSON.parse(localStorage.getItem('fullWidth'))
      : false,
  );

  const toggleMyStudies = logEvent => {
    setMyStudies(!myStudies);
    logEvent('toggle ' + myStudies ? 'off' : 'on');
    localStorage.setItem('onlyMyStudies', !myStudies);
  };

  const toggleWidth = logEvent => {
    setFullWidth(!fullWidth);
    logEvent('toggle ' + fullWidth ? 'off' : 'on');
    localStorage.setItem('fullWidth', !fullWidth);
  };

  // Try to restore the column state from local storage or fall back to the
  // defaults if non are found
  // We track the version off the column state so that we may override it in
  // the future if the schema ever changes
  const existingState = JSON.parse(localStorage.getItem('studyColumns'));
  const [columns, setColumns] = useState(
    existingState && existingState.version === 2
      ? existingState
      : {
          version: 2,
          columns: [
            {key: 'kfId', name: 'Kids First ID', visible: true},
            {key: 'externalId', name: 'phsid/External ID', visible: false},
            {
              key: 'anticipatedSamples',
              name: 'Expected Samples',
              visible: false,
            },
            {
              key: 'sequencingStatus',
              name: 'Sequencing Status',
              visible: false,
            },
            {
              key: 'ingestionStatus',
              name: 'Ingestion Status',
              visible: false,
            },
            {
              key: 'phenotypeStatus',
              name: 'Phenotype Status',
              visible: false,
            },
            {key: 'version', name: 'Version', visible: true},
          ],
        },
  );

  const handleSort = column => () => {
    const direction =
      columns.sorting.column !== column
        ? 'ascending'
        : columns.sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setColumns({
      ...columns,
      sorting: {column, direction},
    });
    localStorage.setItem(
      'studyColumns',
      JSON.stringify({
        columns: existingState ? existingState.columns : defaultState.columns,
        version: defaultState.version,
        sorting: {column, direction},
      }),
    );
  };

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
    <>
      <Grid as={Segment} basic container stackable>
        <Grid.Row columns={7}>
          <Grid.Column width={3}>
            <Header as="h1" floated="left">
              Your Studies
            </Header>
          </Grid.Column>
          <Grid.Column width={3} verticalAlign="middle" textAlign="right">
            <ColumnSelector
              columns={columns.columns}
              onChange={cols => {
                const newCols = {...columns, columns: cols};
                localStorage.setItem('studyColumns', JSON.stringify(newCols));
                setColumns(newCols);
              }}
            />
          </Grid.Column>

          <Grid.Column width={3} verticalAlign="middle" textAlign="right">
            {myProfile && hasPermission(myProfile, 'view_study') && (
              <Amplitude
                eventProperties={inheritedProps => ({
                  ...inheritedProps,
                  scope: inheritedProps.scope
                    ? [
                        ...inheritedProps.scope,
                        'toggle button',
                        'only my studies',
                      ]
                    : ['toggle button', 'only my studies'],
                })}
              >
                {({logEvent}) => (
                  <Checkbox
                    label="Show only my studies"
                    checked={myStudies}
                    onClick={() => toggleMyStudies(logEvent)}
                    data-cy="toggle my studies"
                  />
                )}
              </Amplitude>
            )}
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle">
            {myProfile && hasPermission(myProfile, 'add_study') && (
              <Button
                basic
                primary
                fluid
                className="ml-10"
                size="mini"
                icon="add"
                content="Add Study"
                as={Link}
                to={`/study/new-study/info`}
              />
            )}
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle">
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
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle" textAlign="right">
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
          <Grid.Column width={1} verticalAlign="middle" textAlign="right">
            <Amplitude
              eventProperties={inheritedProps => ({
                ...inheritedProps,
                scope: inheritedProps.scope
                  ? [...inheritedProps.scope, 'toggle button', 'full width']
                  : ['toggle button', 'full width'],
              })}
            >
              {({logEvent}) => (
                <Popup
                  inverted
                  content="Toggle full width view"
                  position="top right"
                  trigger={
                    <Button
                      data-cy="toggle width button"
                      active={fullWidth}
                      size="mini"
                      onClick={() => toggleWidth(logEvent)}
                      icon={fullWidth ? 'compress' : 'expand'}
                    />
                  }
                />
              )}
            </Amplitude>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid as={Segment} container={!fullWidth} basic>
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
                No Studies matching your search term. Try searching by Study
                Name
              </Header>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
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
