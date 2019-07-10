import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import AvatarTimeAgo from '../AvatarTimeAgo/AvatarTimeAgo';
import VersionList from '../VersionList/VersionList';
import {
  fileTypeDetail,
  downloadFile,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
} from '../../common/fileUtils';
import DeleteFileMutation from '../../containers/DeleteFileMutation';
import FileDetailModal from './FileDetailModal';
import Badge from '../Badge/Badge';
import {
  Button,
  Grid,
  Segment,
  Label,
  Icon,
  Header,
  Popup,
  Divider,
} from 'semantic-ui-react';

/**
 * Form to display file details and file versions
 */
const FileDetail = ({fileNode, history, match}) => {
  const [dialog, setDialog] = useState(false);
  const [versionOpened, setOpenVersion] = useState({version: {}, index: null});
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const latestSize = fileLatestSize(sortedVersions);
  const studyId = match.params.kfId;
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <DeleteFileMutation studyId={studyId}>
          {(deleteFile, {loading, error}) => (
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Link
                    to={`/study/${match.params.kfId}/documents`}
                    data-testid="back-to-filelist"
                  >
                    <Button
                      basic
                      size="mini"
                      labelPosition="left"
                      floated="left"
                    >
                      <Icon name="arrow left" />
                      All Documents
                    </Button>
                  </Link>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={12}>
                  <Header as="h3" size="medium" color="blue">
                    {fileNode.name}
                  </Header>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={4}>
                  <Button.Group size="mini">
                    <Button
                      basic
                      icon="pencil"
                      onClick={() => setDialog('annotation')}
                      data-testid="edit-button"
                      content="EDIT"
                    />
                    <Button
                      primary
                      icon="download"
                      onClick={e =>
                        downloadFile(
                          studyId,
                          fileNode.kfId,
                          null,
                          downloadFileMutation,
                        )
                      }
                      content="DOWNLOAD"
                    />
                    <Popup
                      trigger={<Button basic icon="trash alternate" />}
                      header="Are you sure?"
                      content={
                        <>
                          This file and all of its versions and history will be
                          deleted
                          <Divider />
                          <Button
                            data-testid="delete-confirm"
                            negative
                            fluid
                            icon={<Icon name="trash alternate" />}
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
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Header as="h4" sub>
                    Status
                  </Header>
                  <span>
                    <Badge state={sortedVersions[0].node.state} />
                  </span>
                </Grid.Column>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Header as="h4" sub>
                    Document Type
                  </Header>
                  <span>
                    <Label basic size="tiny">
                      <Icon
                        name={`${fileTypeDetail[fileNode.fileType].icon}`}
                      />
                      {' ' + fileTypeDetail[fileNode.fileType].title}
                    </Label>
                  </span>
                </Grid.Column>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Header as="h4" sub>
                    Last Updated
                  </Header>
                  <span>
                    <AvatarTimeAgo
                      size="tiny"
                      showUsername
                      creator={fileNode.creator}
                      createdAt={latestDate}
                    />
                  </span>
                </Grid.Column>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Header as="h4" sub>
                    Size
                  </Header>
                  <span>
                    <Label basic size="tiny">
                      {latestSize}
                    </Label>
                  </span>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={12}>
                  <Header as="h4" sub>
                    Description
                  </Header>
                  <p>
                    <small>
                      {fileNode.description || 'No description added...'}
                    </small>
                  </p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={12}>
                  <Segment className="p-0">
                    <VersionList
                      studyId={studyId}
                      fileNode={fileNode}
                      onUploadClick={() => setDialog('upload')}
                      onNameClick={(versionNode, index) => {
                        setDialog('versionInfo');
                        setOpenVersion({version: versionNode, index: index});
                      }}
                    />
                  </Segment>
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
          )}
        </DeleteFileMutation>
      )}
    </Mutation>
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
