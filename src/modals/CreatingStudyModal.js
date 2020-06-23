import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, ALL_EVENTS} from '../state/queries';
import {
  Header,
  Icon,
  Button,
  List,
  Message,
  Modal,
  Loader,
} from 'semantic-ui-react';
/**
 * The CreatingStudyView displays the status of study creation
 *  - Collecting bucket and project related events and sort by createdAt
 *  - If there is no evens for bucket/project -> status set to Unknown
 *  - If has event with eventType as 'XX_STR' -> creation started -> status set to Creating
 *  - If has event with eventType as 'XX_SUC' -> creation succeeded -> status set to Created
 *  - If has event with eventType as 'XX_ERR' -> creation failed -> status set to Failed
 */

const CreatingStudyModal = ({
  studyKfId,
  history,
  closeModal,
  displaying,
  isResearch,
}) => {
  const {
    data,
    error,
    startPolling: eventsStartPulling,
    stopPolling: eventsStopPulling,
  } = useQuery(ALL_EVENTS, {
    variables: {
      studyId: studyKfId,
      orderBy: '-created_at',
    },
  });
  const allEvents = data && data.allEvents;
  const {
    data: studyData,
    startPolling: studyStartPulling,
    stopPolling: studyStopPulling,
  } = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + studyKfId).toString('base64'),
    },
  });

  const studyByKfId = studyData && studyData.studyByKfId;
  const projects =
    studyByKfId && studyByKfId.projects && studyByKfId.projects.edges;
  const studyName = studyByKfId && studyByKfId.name;

  // Collecting all the bucket related events and sort by createdAt
  const bucketEvents =
    allEvents &&
    allEvents.edges
      .filter(({node}) => node.eventType.includes('BK_'))
      .map(({node}) => node.eventType);

  // Collecting all the project related events and sort by createdAt
  const projectEvents =
    allEvents &&
    allEvents.edges
      .filter(
        ({node}) =>
          node.eventType.includes('PR_') && node.eventType !== 'PR_CRE',
      )
      .map(({node}) => node.eventType);

  // Set bucket creation status based on bucket related events
  const bucketStatus = (() => {
    if (!bucketEvents || bucketEvents.length <= 0) {
      return 'Pending';
    } else {
      if (bucketEvents[0] === 'BK_SUC') {
        return 'Created';
      } else if (bucketEvents[0] === 'BK_ERR') {
        return 'Failed';
      } else if (bucketEvents[0] === 'BK_STR') {
        return 'Creating';
      }
    }
    if (studyByKfId && studyByKfId.bucket) {
      return 'Exist';
    }
  })();

  // Set project creation status based on project related events
  const projectStatus = (() => {
    if (!projectEvents || projectEvents.length <= 0) {
      return 'Pending';
    } else {
      if (projectEvents[0] === 'PR_SUC') {
        return 'Created';
      } else if (projectEvents[0] === 'PR_ERR') {
        return 'Failed';
      } else if (projectEvents[0] === 'PR_STR') {
        return 'Creating';
      }
    }
  })();
  var newStudies = sessionStorage.getItem('newStudy')
    ? sessionStorage.getItem('newStudy').split(',')
    : [];
  const currentIndex =
    newStudies.indexOf(newStudies.filter(id => id.includes(studyKfId))[0]) || 0;

  // Set overall study creation status based on bucket status and project status
  const studyStatus = (() => {
    if (bucketStatus === 'Failed' || projectStatus === 'Failed') {
      newStudies[currentIndex] = studyKfId + '_ERR';
      sessionStorage.setItem('newStudy', newStudies);
      return 'Failed';
    }
    if (
      (bucketStatus === 'Created' && projectStatus === 'Pending') ||
      (projectStatus === 'Created' && bucketStatus === 'Pending') ||
      (projectStatus === 'Created' && bucketStatus === 'Created')
    ) {
      newStudies[currentIndex] = studyKfId + '_SUC';
      sessionStorage.setItem('newStudy', newStudies);
      return 'Created';
    } else {
      newStudies[currentIndex] = studyKfId + '_STR';
      sessionStorage.setItem('newStudy', newStudies);
      return 'Creating';
    }
  })();

  if (studyStatus === 'Creating') {
    eventsStartPulling(1000);
    studyStartPulling(1000);
    setTimeout(() => {
      eventsStopPulling();
      studyStopPulling();
    }, 30000);
  } else {
    eventsStopPulling();
    studyStopPulling();
  }

  const statusComponent = {
    Creating: <List.Icon name="spinner" loading className="noPadding" />,
    Created: <List.Icon name="check" className="noPadding" color="green" />,
    Failed: <List.Icon name="x" className="noPadding" color="red" />,
    Pending: <List.Icon name="clock outline" className="noPadding text-grey" />,
    Exist: <List.Icon name="check" className="noPadding" color="green" />,
  };

  return (
    <Modal
      open={displaying}
      onClose={() => {
        history.push(history.location.pathname);
        closeModal(false);
      }}
      closeIcon
      size="small"
    >
      <Modal.Header>External Study Resources</Modal.Header>
      {error ? (
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      ) : (
        <Modal.Content>
          {studyStatus === 'Creating' && (
            <>
              <Loader inline="centered" active size="massive" />
              <Header textAlign="center" as="h2" icon>
                Initializing {isResearch ? 'Research' : ''} Study Resources
                <Header.Subheader>
                  We're setting up your new {isResearch ? 'research' : ''} study
                  resources, sit tight.
                </Header.Subheader>
              </Header>
            </>
          )}
          {studyStatus === 'Failed' && (
            <Header textAlign="center" as="h2" icon className="noBefore">
              <Icon name="warning sign" color="orange" />
              Error Creating Study Resouces
              <Header.Subheader>
                Some {isResearch ? 'research' : ''} study resources failed to
                initialize, please contact{' '}
                <a
                  href={`mailto:support@kidsfirstdrc.org?subject=Kids First Data Tracker Help&body=Hello, I had issue creating my study ${studyName}.`}
                >
                  support@kidsfirstdrc.org
                </a>
              </Header.Subheader>
            </Header>
          )}
          {studyStatus === 'Created' && (
            <Header textAlign="center" as="h2" icon className="noBefore">
              <Icon name="check" color="green" />
              {isResearch ? 'Research' : ''} Study Setup Completed
              <Header.Subheader>
                Your {isResearch ? 'research' : ''} study resources were
                successfully created
              </Header.Subheader>
            </Header>
          )}
          <div className="text-wrap-75 margin-x-auto mt-30 width-fit-content">
            <List>
              <List.Item>
                <List.Icon name="check" color="green" className="noPadding" />
                <List.Content>
                  <List.Header>
                    Registered in Data Service: <code>{studyKfId}</code>
                  </List.Header>
                </List.Content>
              </List.Item>

              <List.Item>
                {statusComponent[bucketStatus]}
                <List.Content>
                  <List.Header
                    className={bucketStatus === 'Pending' ? 'text-grey' : ''}
                  >
                    {bucketStatus} storage bucket
                  </List.Header>
                </List.Content>
                {studyByKfId && studyByKfId.bucket && (
                  <List className="ml-15">
                    <List.Item>
                      <Icon name="aws" />
                      <List.Content>
                        <code>{studyByKfId.bucket}</code>
                      </List.Content>
                    </List.Item>
                  </List>
                )}
              </List.Item>
              {!isResearch && (
                <List.Item>
                  {statusComponent[projectStatus]}
                  <List.Content>
                    <List.Header
                      className={projectStatus === 'Pending' ? 'text-grey' : ''}
                    >
                      {projectStatus} Cavatica analysis projects
                    </List.Header>
                  </List.Content>
                  {projects &&
                    projects.filter(({node}) => node.projectType === 'HAR')
                      .length > 0 && (
                      <List className="ml-15">
                        {projects
                          .filter(({node}) => node.projectType === 'HAR')
                          .map(({node}) => (
                            <List.Item key={node.id}>
                              <Icon name="sliders horizontal" />
                              <List.Content
                                as="a"
                                target="_blank"
                                href={`https://cavatica.sbgenomics.com/u/${
                                  node.projectId
                                }`}
                              >
                                {node.name + ' '}
                                <Icon link size="small" name="external" />
                              </List.Content>
                            </List.Item>
                          ))}
                      </List>
                    )}
                </List.Item>
              )}
              <List.Item>
                {statusComponent[projectStatus]}
                <List.Content>
                  <List.Header
                    className={projectStatus === 'Pending' ? 'text-grey' : ''}
                  >
                    {projectStatus} Cavatica delivery project
                  </List.Header>
                </List.Content>
                {projects &&
                  projects.filter(({node}) => node.projectType === 'DEL')
                    .length > 0 && (
                    <List className="ml-15">
                      {projects
                        .filter(({node}) => node.projectType === 'DEL')
                        .map(({node}) => (
                          <List.Item key={node.id}>
                            <Icon name="paper plane outline" />
                            <List.Content
                              as="a"
                              target="_blank"
                              href={`https://cavatica.sbgenomics.com/u/${
                                node.projectId
                              }`}
                            >
                              {node.name + ' '}
                              <Icon link size="small" name="external" />
                            </List.Content>
                          </List.Item>
                        ))}
                    </List>
                  )}
              </List.Item>
            </List>
          </div>
        </Modal.Content>
      )}
      <Modal.Actions>
        {studyStatus === 'Creating' ? (
          <>
            <small className="text-grey">
              Skip ahead will not affect the study creation
            </small>
            <Button
              size="small"
              icon="info"
              labelPosition="left"
              onClick={() => {
                history.push(
                  isResearch
                    ? `/research-study/${studyKfId}/basic-info`
                    : `/study/${studyKfId}/basic-info/info`,
                );
                closeModal(false);
              }}
              content={`Skip ahead to the ${
                isResearch ? 'research' : ''
              } study`}
            />
          </>
        ) : (
          <>
            <Button
              primary
              size="small"
              icon="info"
              labelPosition="left"
              content={`Go To ${isResearch ? 'Research' : ''} Study Info`}
              onClick={() => {
                history.push(
                  isResearch
                    ? `/research-study/${studyKfId}/basic-info`
                    : `/study/${studyKfId}/basic-info/info`,
                );
                closeModal(false);
              }}
            />
            {!isResearch && (
              <Button
                primary
                size="small"
                icon="cloud upload"
                labelPosition="left"
                content="Upload Documents"
                onClick={() => {
                  history.push(`/study/${studyKfId}/documents`);
                  closeModal(false);
                }}
              />
            )}
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default CreatingStudyModal;
