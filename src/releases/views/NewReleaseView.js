import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {
  Container,
  Header,
  Segment,
  Confirm,
  Button,
  Message,
  Modal,
  List,
} from 'semantic-ui-react';
import {GET_RELEASED_STUDY} from '../../state/queries';
import {ALL_STUDIES} from '../../state/queries';
import {START_RELEASE} from '../mutations';
import NewReleaseForm from '../forms/NewReleaseForm';

const NewReleaseView = ({history}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [release, setRelease] = useState({});

  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE, {
    context: {clientName: 'coordinator'},
  });

  const {data: studiesData} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'network-only',
  });

  const studyEdges = studiesData ? studiesData.allStudies.edges : [];
  const studyById = studyEdges.reduce((acc, {node}, i) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const {data: releasesData} = useQuery(GET_RELEASED_STUDY, {
    context: {clientName: 'coordinator'},
    fetchPolicy: 'cache-first',
  });

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

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);

    const studyIds = values.studies.map(study => study.id);

    let release = {
      name: values.title,
      description: values.description,
      studies: studyIds,
      isMajor: values.isMajor,
    };
    setRelease(release);
    setConfirmOpen(true);
    setSubmitting(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    startRelease({variables: {input: release}})
      .then(resp => {
        history.push(
          `/releases/history/${resp.data.startRelease.release.kfId}`,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - New Release`}</title>
      </Helmet>
      <Header as="h1">New Data Release</Header>
      <NewReleaseForm
        handleSubmit={handleSubmit}
        studies={studies}
        history={history}
      />
      <Confirm
        open={confirmOpen}
        cancelButton="Cancel"
        confirmButton={
          <Button
            className="bg-purple"
            disabled={startReleaseError}
            loading={startReleaseLoading}
          >
            Run Release
          </Button>
        }
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        header={`About to start release: '${release.name}'`}
        content={
          <Modal.Content>
            <p>
              This <b>{release.is_major ? 'will' : 'will not'}</b> be a major
              release.
            </p>
            These studies will be staged for review. This will not affect any
            public facing data until it is reviewed and published.
            {release.studies && (
              <List bulleted>
                {release.studies.map(sd => (
                  <List.Item key={sd}>
                    <Link to={`/study/${studyById[sd].kfId}/releases`}>
                      {studyById[sd].kfId}
                    </Link>{' '}
                    - {studyById[sd].name}
                  </List.Item>
                ))}
              </List>
            )}
            {startReleaseError && (
              <Message
                negative
                header="Error"
                content={
                  startReleaseError.networkError +
                  startReleaseError.graphQLErrors
                }
              />
            )}
          </Modal.Content>
        }
      />
    </Container>
  );
};

export default NewReleaseView;
