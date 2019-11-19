import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@apollo/react-hooks';
import {withRouter, Link} from 'react-router-dom';
import {FILE_DOWNLOAD_URL, DELETE_FILE} from '../../mutations';
import {GET_STUDY_BY_ID} from '../../../state/queries';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import VersionList from '../VersionList/VersionList';
import {
  downloadFile,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
} from '../../utilities';
import {fileTypeDetail} from '../../../common/enums';
import FileDetailModal from './FileDetailModal';
import Badge from '../../../components/Badge/Badge';
import {
  Button,
  Grid,
  Label,
  Icon,
  Segment,
  Header,
  Popup,
  Divider,
} from 'semantic-ui-react';

const ActionButtons = ({
  downloadFile,
  studyId,
  fileNode,
  downloadFileMutation,
  setDialog,
  deleteFile,
  history,
  isAdmin,
}) => (
  <>
    <Header as="h5" attached="top" textAlign="center" color="blue">
      Actions
    </Header>
    <Segment raised attached secondary>
      <Button
        primary
        icon="download"
        fluid
        size="mini"
        labelPosition="left"
        onClick={e =>
          downloadFile(studyId, fileNode.kfId, null, downloadFileMutation)
        }
        content="DOWNLOAD"
      />
      <Divider />
      <Button.Group size="mini" fluid>
        <Button
          icon="pencil"
          size="small"
          labelPosition="left"
          color="grey"
          onClick={() => setDialog('annotation')}
          data-testid="edit-button"
          content="EDIT"
        />
        {isAdmin && (
          <Popup
            trigger={
              <Button icon="trash alternate" data-testid="delete-button" />
            }
            header="Are you sure?"
            content={
              <>
                This file and all of its versions and history will be deleted
                <Divider />
                <Button
                  data-testid="delete-confirm"
                  negative
                  fluid
                  size="mini"
                  icon="trash alternate"
                  content="Delete"
                  onClick={e => {
                    deleteFile({variables: {kfId: fileNode.kfId}});
                    history.goBack();
                  }}
                />
              </>
            }
            on="click"
            position="top right"
          />
        )}
      </Button.Group>
    </Segment>
  </>
);

/**
 * Form to display file details and file versions
 */
const FileDetail = ({fileNode, history, match, isAdmin}) => {
  const studyId = match.params.kfId;
  const [downloadFileMutation] = useMutation(FILE_DOWNLOAD_URL);
  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [{query: GET_STUDY_BY_ID, variables: {kfId: studyId}}],
  });

  const [dialog, setDialog] = useState(false);
  const [versionOpened, setOpenVersion] = useState({version: {}, index: null});
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const latestSize = fileLatestSize(sortedVersions);
  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <Link
              to={`/study/${match.params.kfId}/documents`}
              data-testid="back-to-filelist"
            >
              <Button basic size="mini" labelPosition="left" floated="left">
                <Icon name="arrow left" />
                All Documents
              </Button>
            </Link>
            <Header as="h2">{fileNode.name}</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <Segment.Group className="noBorders">
              <Segment.Group horizontal className="noBorders">
                <Segment className="noBorders">
                  <Header as="h4" color="grey">
                    Approval Status
                  </Header>
                  <Badge state={sortedVersions[0].node.state} />
                </Segment>
                <Segment className="noBorders">
                  <Header as="h4" color="grey">
                    Document Type
                  </Header>
                  <Label basic size="small">
                    <Icon name={`${fileTypeDetail[fileNode.fileType].icon}`} />
                    {' ' + fileTypeDetail[fileNode.fileType].title}
                  </Label>
                </Segment>
                <Segment className="noBorders">
                  <Header as="h4" color="grey">
                    Last Updated
                  </Header>
                  <AvatarTimeAgo
                    size="tiny"
                    showUsername
                    creator={fileNode.creator}
                    createdAt={latestDate}
                  />
                </Segment>
                <Segment className="noBorders">
                  <Header as="h4" color="grey">
                    Size
                  </Header>
                  <Label basic size="small">
                    {latestSize}
                  </Label>
                </Segment>
              </Segment.Group>
              <Segment className="noBorders">
                <Header as="h4" color="grey">
                  Description
                </Header>
                <p>{fileNode.description || 'No description added...'}</p>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column mobile={8} tablet={4} computer={3}>
            <ActionButtons
              {...{
                downloadFile,
                studyId,
                fileNode,
                downloadFileMutation,
                setDialog,
                deleteFile,
                history,
                isAdmin,
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <VersionList
              studyId={studyId}
              fileNode={fileNode}
              onUploadClick={() => setDialog('upload')}
              onNameClick={(versionNode, index) => {
                setDialog('versionInfo');
                setOpenVersion({version: versionNode, index: index});
              }}
            />
          </Grid.Column>
        </Grid.Row>
        {dialog !== false && (
          <FileDetailModal
            match={match}
            studyId={studyId}
            fileNode={fileNode}
            onCloseModal={() => setDialog(false)}
            dialog={dialog}
            onUploadClick={() => setDialog('upload')}
            openedVersion={versionOpened}
            downloadFileMutation={downloadFileMutation}
          />
        )}
      </Grid>
    </>
  );
};

FileDetail.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object.isRequired,
};

FileDetail.defaultProps = {
  fileNode: {},
};

export default withRouter(FileDetail);
