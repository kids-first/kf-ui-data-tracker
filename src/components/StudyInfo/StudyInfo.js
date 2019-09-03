import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import {List, Grid, Header, Segment, Button} from 'semantic-ui-react';
import EventList from './EventList';
import FileSimpleList from './FileSimpleList';
import CavaticaProjectList from '../CavaticaProjectList/CavaticaProjectList';
/**
 * Displays study baisc information
 */
const StudyInfo = ({studyNode, setShowModal, unlinkProject}) => {
  return (
    <Grid padded="vertically">
      <Grid.Row stretched>
        <Grid.Column mobile={16} tablet={16} computer={8}>
          <Segment padded>
            <Header as="h3">
              Study Info
              <Button
                floated="right"
                size="mini"
                primary
                onClick={() => setShowModal('edit')}
              >
                EDIT
              </Button>
            </Header>
            <List relaxed size="large">
              <List.Item>
                <List.Description>Name</List.Description>
                <List.Header>{studyNode.name || 'Unknown'}</List.Header>
              </List.Item>
              <List.Item>
                <List.Description>Short Name</List.Description>
                <List.Header>{studyNode.shortName || 'Unknown'}</List.Header>
              </List.Item>
              <List.Item>
                <List.Description>Created At</List.Description>
                <List.Header>
                  {studyNode.createdAt ? (
                    <TimeAgo date={studyNode.createdAt} live={false} />
                  ) : (
                    'Unknown'
                  )}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>Modified At</List.Description>
                <List.Header>
                  {studyNode.modifiedAt ? (
                    <TimeAgo date={studyNode.modifiedAt} live={false} />
                  ) : (
                    'Unknown'
                  )}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>S3 Bucket Name</List.Description>
                <List.Header>{studyNode.bucket || 'Unknown'}</List.Header>
              </List.Item>
              <List.Item>
                <List.Description>Release Status</List.Description>
                <List.Header>
                  {studyNode.releaseStatus || 'Unknown'}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>ReleaseDate</List.Description>
                <List.Header>{studyNode.releaseDate || 'Unknown'}</List.Header>
              </List.Item>
              <List.Item>
                <List.Description>
                  The expected number of samples for the study
                </List.Description>
                <List.Header>
                  {studyNode.anticipatedSamples || 'Unknown'}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>
                  The organization that the grant was awarded to
                </List.Description>
                <List.Header>
                  {studyNode.awardeeOrganization || 'Unknown'}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>dbGaP - Link to Attribution</List.Description>
                <List.Header>{studyNode.attribution || 'Unknown'}</List.Header>
              </List.Item>
              <List.Item>
                <List.Description>dbGaP - Accession Number</List.Description>
                <List.Header>
                  {studyNode.dataAccessAuthority || 'Unknown'}
                </List.Header>
              </List.Item>
              <List.Item>
                <List.Description>dbGaP - Version</List.Description>
                <List.Header>{studyNode.version || 'Unknown'}</List.Header>
              </List.Item>
            </List>
          </Segment>
          <Segment padded>
            <Header as="h3">Study Files</Header>
            {studyNode.files.edges.length > 0 ? (
              <FileSimpleList files={studyNode.files.edges} />
            ) : (
              <Header disabled textAlign="center" as="h4">
                No files for this study.
              </Header>
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={8}>
          <Segment padded>
            <Header as="h3">Description</Header>
            {studyNode.description && studyNode.description.length > 0 ? (
              <p>{studyNode.description}</p>
            ) : (
              <Header disabled textAlign="center" as="h4">
                No study description available.
              </Header>
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Segment padded>
            <Header as="h3" className="pb-10">
              Cavatica Projects
              <Button.Group floated="right" size="mini">
                <Button onClick={() => setShowModal('addProject')}>
                  NEW PROJECT
                </Button>
                <Button primary onClick={() => setShowModal('linkProject')}>
                  LINK PROJECT
                </Button>
              </Button.Group>
            </Header>
            {studyNode.projects.edges.length > 0 ? (
              <CavaticaProjectList
                projects={studyNode.projects.edges}
                studyId={studyNode.id}
                unlinkProject={unlinkProject}
              />
            ) : (
              <Header disabled textAlign="center" as="h4">
                No linked Cavatica projects.
              </Header>
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Segment padded>
            <Header as="h3">Event Logs</Header>
            {studyNode.events.edges.length > 0 ? (
              <EventList events={studyNode.events.edges} />
            ) : (
              <Header disabled textAlign="center" as="h4">
                No event logs available.
              </Header>
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

StudyInfo.propTypes = {
  /** Study object*/
  studyNode: PropTypes.object.isRequired,
};

export default StudyInfo;
