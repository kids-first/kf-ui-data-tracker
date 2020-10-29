import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {
  Accordion,
  Container,
  Header,
  Segment,
  Confirm,
  Button,
  Message,
  Modal,
  Icon,
  List,
} from 'semantic-ui-react';
import {ALL_STUDIES} from '../../state/queries';
import {START_RELEASE} from '../mutations';
import {ALL_SERVICES} from '../queries';
import NewReleaseForm from '../forms/NewReleaseForm';

const NewReleaseView = ({history}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [release, setRelease] = useState({});

  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE);

  const {data: services} = useQuery(ALL_SERVICES, {
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

  var studies = studiesData
    ? studiesData.allStudies.edges.map(({node}) => node)
    : [];

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);

    const studyIds = values.studies.map(study => study.id);

    let release = {
      name: values.title,
      description: values.description,
      studies: studyIds,
      services: [],
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
        services={services}
        history={history}
      />
      <ConfirmModal
        open={confirmOpen}
        release={release}
        studyById={studyById}
        handleSubmit={handleSubmit}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        startReleaseLoading={startReleaseLoading}
        startReleaseError={startReleaseError}
      />
    </Container>
  );
};

const ConfirmModal = ({
  open,
  release,
  studyById,
  handleSubmit,
  handleConfirm,
  handleCancel,
  startReleaseLoading,
  startReleaseError,
}) => {
  const [showErrors, setShowErorrs] = useState(false);

  return (
    <Confirm
      open={open}
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
                <>
                  There was a problem trying to start the release. No action was
                  taken.
                  <Accordion>
                    <Accordion.Title
                      active={showErrors}
                      onClick={() => setShowErorrs(!showErrors)}
                    >
                      <Icon name="dropdown" />
                      Show Errors
                    </Accordion.Title>
                    <Accordion.Content active={showErrors}>
                      <code>
                        <pre>{JSON.stringify(startReleaseError, null, 2)}</pre>
                      </code>
                    </Accordion.Content>
                  </Accordion>
                </>
              }
            />
          )}
        </Modal.Content>
      }
    />
  );
};

export default NewReleaseView;
