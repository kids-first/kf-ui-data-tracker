import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import StudyTable from './StudyTable';
import {Link} from 'react-router-dom';
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
  Divider,
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
      : false,
  );
  const [fullWidth, setFullWidth] = useState(
    localStorage.getItem('fullWidth') !== null
      ? JSON.parse(localStorage.getItem('fullWidth'))
      : false,
  );

  const toggleMyStudies = logEvent => {
    setMyStudies(!myStudies);
    logEvent('toggle ' + (myStudies ? 'off' : 'on'));
    localStorage.setItem('onlyMyStudies', !myStudies);
  };

  const toggleWidth = logEvent => {
    setFullWidth(!fullWidth);
    logEvent('toggle ' + (fullWidth ? 'off' : 'on'));
    localStorage.setItem('fullWidth', !fullWidth);
  };

  // Try to restore the column state from local storage or fall back to the
  // defaults if non are found
  // We track the version off the column state so that we may override it in
  // the future if the schema ever changes
  const existingState = JSON.parse(localStorage.getItem('studyColumns'));
  const defaultState = {
    version: 6,
    columns: [
      {key: 'kfId', name: 'Kids First ID', visible: true},
      {key: 'externalId', name: 'phsid/External ID', visible: false},
      {
        key: 'anticipatedSamples',
        name: 'Expected Samples',
        visible: false,
      },
      {key: 'version', name: 'Version', visible: true},
      {key: 'slackChannel', name: 'Slack Channel', visible: false},
      {key: 'bucket', name: 'Bucket', visible: false},
    ],
    allStudySorting: {
      column: 'name',
      direction: 'descending',
    },
    favStudySorting: {
      column: 'name',
      direction: 'descending',
    },
  };
  const [columns, setColumns] = useState(
    existingState && existingState.version === defaultState.version
      ? existingState
      : defaultState,
  );

  const [favoriteStudies, setFavoriteStudies] = useState(
    localStorage.getItem('favoriteStudies') !== null
      ? JSON.parse(localStorage.getItem('favoriteStudies'))
      : [],
  );

  const handleSort = (column, tableType) => () => {
    const sorting = columns[tableType + 'Sorting'];
    const direction =
      sorting.column !== column
        ? 'ascending'
        : sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    if (tableType === 'favStudy') {
      setColumns({
        ...columns,
        favStudySorting: {column, direction},
      });
      localStorage.setItem(
        'studyColumns',
        JSON.stringify({
          columns: existingState ? existingState.columns : defaultState.columns,
          version: defaultState.version,
          favStudySorting: {column, direction},
          allStudySorting: existingState
            ? existingState.allStudySorting
            : defaultState.allStudySorting,
        }),
      );
    } else {
      setColumns({
        ...columns,
        allStudySorting: {column, direction},
      });
      localStorage.setItem(
        'studyColumns',
        JSON.stringify({
          columns: existingState ? existingState.columns : defaultState.columns,
          version: defaultState.version,
          allStudySorting: {column, direction},
          favStudySorting: existingState
            ? existingState.favStudySorting
            : defaultState.favStudySorting,
        }),
      );
    }
  };

  if (loading && !studyList.length) {
    return (
      <Container as={Segment} basic>
        <HeaderSkeleton />
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
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
          .map(({node}) => [node.username, node.displayName].join(' '))
          .join(' ')
      : '';
  };

  const favoriteStudyList = () => {
    const favList = studyList.filter(({node}) =>
      favoriteStudies.includes(node.kfId),
    );
    return favList;
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
          slackChannel,
          collaborators: {edges},
        },
      }) =>
        [name, shortName, kfId, slackChannel, conactCollaborators(edges)]
          .join(' ')
          .toLowerCase()
          .includes(searchString.toLowerCase()),
    );
    return filteredList;
  };

  return (
    <>
      <Grid as={Segment} basic container>
        <Grid.Row>
          <Grid.Column>
            <Header as="h1" floated="left" className="noMargin">
              Your Studies
            </Header>
            {myProfile && hasPermission(myProfile, 'add_study') && (
              <Button
                floated="right"
                basic
                primary
                icon="add"
                content="Add Study"
                as={Link}
                to={`/study/new-study/info`}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid as={Segment} container={!fullWidth} basic>
        <Grid.Row className="noPadding">
          <Grid.Column>
            <Header as="h3" className="my-2" content="Favorite Studies" />
            <Divider className="my-2" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {favoriteStudyList().length > 0 ? (
            <Grid.Column>
              <StudyTable
                tableType="favStudy"
                myProfile={myProfile}
                loading={loading}
                studyList={favoriteStudyList()}
                columns={columns}
                handleSort={handleSort}
                favoriteStudies={favoriteStudies}
                setFavoriteStudies={setFavoriteStudies}
              />
            </Grid.Column>
          ) : (
            <Grid.Column>
              <Header
                as="h4"
                disabled
                textAlign="center"
                className="mt-15 mb-15"
              >
                You have not favorited any studies yet.
              </Header>
            </Grid.Column>
          )}
        </Grid.Row>
        <Grid.Row className="pb-0 mt-15">
          <Grid.Column
            computer={3}
            tablet={3}
            mobile={4}
            verticalAlign="bottom"
          >
            <Header as="h3" className="my-2" content="All Studies" />
          </Grid.Column>
          <Grid.Column
            computer={7}
            tablet={8}
            mobile={12}
            verticalAlign="middle"
            textAlign="right"
          >
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
                    className="mr-28"
                    label="Show only my studies"
                    checked={myStudies}
                    onClick={() => toggleMyStudies(logEvent)}
                    data-cy="toggle my studies"
                  />
                )}
              </Amplitude>
            )}
            <ColumnSelector
              columns={columns.columns}
              onChange={cols => {
                const newCols = {...columns, columns: cols};
                localStorage.setItem('studyColumns', JSON.stringify(newCols));
                setColumns(newCols);
              }}
            />
          </Grid.Column>
          <Grid.Column computer={5} tablet={4} mobile={15}>
            <Popup
              wide
              inverted
              position="top center"
              content="Search study by name , ID, Slack channel or collaborator"
              trigger={
                <Input
                  fluid
                  size="mini"
                  aria-label="search studies"
                  iconPosition="left"
                  icon="search"
                  placeholder="Search studies"
                  onChange={(e, {value}) => {
                    setSearchString(value);
                  }}
                  value={searchString}
                />
              }
            />
          </Grid.Column>
          <Grid.Column
            className="pl-0"
            tablet={1}
            computer={1}
            mobile={1}
            verticalAlign="middle"
            textAlign="right"
          >
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
                      size="mini"
                      data-cy="toggle width button"
                      active={fullWidth}
                      onClick={() => toggleWidth(logEvent)}
                      icon={fullWidth ? 'compress' : 'expand'}
                    />
                  }
                />
              )}
            </Amplitude>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="noPadding">
          <Grid.Column>
            <Divider className="my-2" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {filteredStudyList().length > 0 ? (
            <Grid.Column>
              <StudyTable
                tableType="allStudy"
                myProfile={myProfile}
                loading={loading}
                studyList={filteredStudyList()}
                columns={columns}
                handleSort={handleSort}
                favoriteStudies={favoriteStudies}
                setFavoriteStudies={setFavoriteStudies}
              />
            </Grid.Column>
          ) : (
            <Grid.Column>
              <Header
                as="h4"
                disabled
                textAlign="center"
                className="mt-15 mb-15"
              >
                No Studies matching your search term. Try searching by Study
                Name.
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
