import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import {
  List,
  Grid,
  Header,
  Segment,
  Button,
  Image,
  Table,
} from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import FileSimpleList from './FileSimpleList';
import CavaticaProjectList from '../CavaticaProjectList/CavaticaProjectList';
import Markdown from 'react-markdown';
import {longDate} from '../../common/dateUtils';
/**
 * Displays study baisc information
 */
const StudyInfo = ({studyNode, setShowModal, unlinkProject}) => {
  const longDescription =
    studyNode.description && studyNode.description.length > 3500 ? true : false;
  const [foldDescription, setFoldDescription] = useState(true);
  return (
    <Grid padded="vertically">
      <Grid.Row stretched>
        <Grid.Column
          mobile={16}
          tablet={16}
          computer={longDescription ? 16 : 8}
        >
          <Segment.Group horizontal={longDescription}>
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
                  <List.Description>External ID</List.Description>
                  <List.Header>{studyNode.externalId || 'Unknown'}</List.Header>
                </List.Item>
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
                      <TimeAgo
                        date={studyNode.createdAt}
                        title={longDate(studyNode.createdAt)}
                        live={false}
                      />
                    ) : (
                      'Unknown'
                    )}
                  </List.Header>
                </List.Item>
                <List.Item>
                  <List.Description>Modified At</List.Description>
                  <List.Header>
                    {studyNode.modifiedAt ? (
                      <TimeAgo
                        date={studyNode.modifiedAt}
                        title={longDate(studyNode.modifiedAt)}
                        live={false}
                      />
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
                  <List.Header>
                    {studyNode.releaseDate || 'Unknown'}
                  </List.Header>
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
                  <List.Description>Link to Attribution</List.Description>
                  <List.Header>
                    {studyNode.attribution || 'Unknown'}
                  </List.Header>
                </List.Item>
                <List.Item>
                  <List.Description>Access Authority</List.Description>
                  <List.Header>
                    {studyNode.dataAccessAuthority || 'Unknown'}
                  </List.Header>
                </List.Item>
                <List.Item>
                  <List.Description>Access Authority Version</List.Description>
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
          </Segment.Group>
        </Grid.Column>
        <Grid.Column
          mobile={16}
          tablet={16}
          computer={longDescription ? 16 : 8}
        >
          <div>
            <Segment
              padded
              attached={studyNode.description.length > 0}
              className={foldDescription ? 'max-h-500' : null}
            >
              <Header as="h3">Description</Header>
              {studyNode.description && studyNode.description.length > 0 ? (
                <Markdown
                  source={studyNode.description}
                  renderers={{
                    image: Image,
                    table: props => <Table>{props.children}</Table>,
                    list: List,
                    listItem: List.Item,
                  }}
                />
              ) : (
                <Header disabled textAlign="center" as="h4">
                  No study description available.
                </Header>
              )}
            </Segment>
            {studyNode.description && studyNode.description.length > 0 && (
              <Button
                attached="bottom"
                onClick={() => setFoldDescription(!foldDescription)}
              >
                {foldDescription ? 'Read More' : 'Read Less'}
              </Button>
            )}
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column mobile={16} tablet={16} computer={16}>
          <Segment padded>
            <Header as="h3" className="pb-10">
              Cavatica Projects
              <Button
                primary
                floated="right"
                size="mini"
                icon="linkify"
                content="LINK PROJECT"
                onClick={() => setShowModal('linkProject')}
              />
              <Button
                basic
                primary
                floated="right"
                size="mini"
                icon="add"
                content="NEW PROJECT"
                onClick={() => setShowModal('addProject')}
              />
            </Header>
            {studyNode.projects.edges.length > 0 ? (
              <CavaticaProjectList
                projects={studyNode.projects.edges}
                unlinkProject={unlinkProject}
                hideStudy
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
