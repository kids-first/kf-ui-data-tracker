import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {ALL_STUDIES, MY_PROFILE, GET_RELEASED_STUDY} from '../../state/queries';
import StudyTable from '../../components/StudyList/StudyTable';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import {
  Button,
  Message,
  Container,
  Segment,
  Icon,
  Grid,
  Header,
  Input,
  Placeholder,
} from 'semantic-ui-react';

const ResearchStudyListView = ({history}) => {
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const {loading, error, data} = useQuery(ALL_STUDIES);
  const {
    loading: releasesLoading,
    error: releasesError,
    data: releasesData,
  } = useQuery(GET_RELEASED_STUDY, {
    context: {clientName: 'coordinator'},
  });
  const allStudies = data && data.allStudies;
  const allReleases = releasesData && releasesData.allStudies;
  var studyList = !loading && allStudies ? allStudies.edges : [];
  const releaseList = !releasesLoading && allReleases ? allReleases.edges : [];
  if (releaseList.length > 0 && studyList.length > 0) {
    studyList.forEach(function(study) {
      const release =
        releaseList.find(r => r.node.kfId === study.node.kfId) || {};
      study.node.release =
        release.node && release.node.releases.edges.length > 0
          ? release.node.releases.edges[0]
          : {};
    });
  }

  const [searchString, setSearchString] = useState('');
  const isAdmin = myProfile && myProfile.roles.includes('ADMIN');

  const filteredStudyList = () => {
    var filteredList = studyList.filter(obj =>
      (obj.node.name + obj.node.shortName + obj.node.kfId)
        .toLowerCase()
        .includes(searchString.toLowerCase()),
    );
    return filteredList;
  };

  if (loading || releasesLoading) {
    return (
      <Container as={Segment} basic>
        <Container as={Segment} basic>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </Container>
      </Container>
    );
  }

  if (error)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && <p>{error.message}</p>}
            {releasesError && <p>{releasesError.message}</p>}
          </Message.Content>
        </Message>
      </Container>
    );

  if (!loading && !releasesLoading && studyList.length === 0)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - My Research Studies</title>
        </Helmet>
        {isAdmin ? (
          <>
            <Message
              info
              icon="info circle"
              header="No studies yet."
              content="Create the first study to initialize the Data Resource Center"
            />
            <Segment basic textAlign="center">
              <Button
                basic
                primary
                size="large"
                icon="add"
                content="Create Study"
                as={Link}
                to={`/study/new-study`}
              />
            </Segment>
          </>
        ) : (
          <Message
            warning
            icon="warning circle"
            header="You don't have access to any studies yet."
            content="Your account is being reviewed for the proper permissions."
          />
        )}
      </Container>
    );

  return (
    <>
      <Helmet>
        <title>KF Data Tracker - My Research Studies</title>
      </Helmet>
      <Grid as={Segment} basic container stackable>
        <Grid.Column width={8} textAlign="left">
          <Header as="h1">Your Research Studies</Header>
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
              to={`/study/new-study-selection`}
            />
          )}
          <Input
            aria-label="studySearch"
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
            size="mini"
            hideText
            onToggle={({key}) => {
              history.push('research-studies#' + key);
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
              <StudyTable
                isResearch
                isAdmin={isAdmin}
                loading={loading}
                studyList={filteredStudyList()}
                exclude={[
                  'files',
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
      <Container as={Segment} basic vertical>
        {releasesError && (
          <Message negative icon>
            <Icon name="warning circle" />
            <Message.Content>
              <Message.Header>Releases Info Error</Message.Header>
              {releasesError.message}
            </Message.Content>
          </Message>
        )}
      </Container>
    </>
  );
};

export default ResearchStudyListView;
