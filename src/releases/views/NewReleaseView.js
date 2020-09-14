import React from 'react';
import {Helmet} from 'react-helmet';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Container, Grid, Header, Segment} from 'semantic-ui-react';
import {GET_RELEASED_STUDY} from '../../state/queries';
import {ALL_STUDIES} from '../../state/queries';
import {START_RELEASE} from '../mutations';
import NewReleaseForm from '../forms/NewReleaseForm';

const NewReleaseView = () => {
  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE, {context: {clientName: 'coordinator'}});

  const {
    loading: studiesLoading,
    error: studiesError,
    data: studiesData,
  } = useQuery(ALL_STUDIES, {
    fetchPolicy: 'network-only',
  });

  const {error: releasesError, data: releasesData} = useQuery(
    GET_RELEASED_STUDY,
    {
      context: {clientName: 'coordinator'},
      fetchPolicy: 'cache-first',
    },
  );

  // Merge published releases into all studies
  const allReleases = releasesData && releasesData.allStudyReleases;

  var studies =
    studiesData && allReleases
      ? studiesData.allStudies.edges.map(({node}) => node)
      : [];
  const releaseList = allReleases ? allReleases.edges : [];
  if (releaseList.length > 0 && studies.length > 0) {
    studies.forEach(study => {
      const release = releaseList.find(r => r.node.kfId === study.kfId) || {};
      study.release =
        release.node && release.node.releases.edges.length > 0
          ? release.node.releases.edges[0].node
          : {};
      study.version = study.release && study.release.version;
      if (!study.version) study.version = '-';
      study.lastPublished = study.release && study.release.createdAt;
    });
  }

  const handleSubmit = (values, {setSubmitting, setErrors}) => {
    setSubmitting(true);

    const studyIds = values.studies.map(study => study.id);

    let release = {
      name: values.title,
      description: '',
      studies: studyIds,
      isMajor: values.isMajor,
    };

    startRelease({variables: {input: release}}).catch(err =>
      setErrors({all: err}),
    );

    setSubmitting(false);
  };

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - New Release`}</title>
      </Helmet>
      <Header as="h1">New Data Release</Header>
      <Segment>
        <NewReleaseForm handleSubmit={handleSubmit} studies={studies} />
      </Segment>
    </Container>
  );
};

export default NewReleaseView;
