import React from 'react';
import Badge from '../components/Badge/Badge';
import AvatarTimeAgo from '../components/AvatarTimeAgo/AvatarTimeAgo';
import {Button, Header, Modal, Icon, Grid, Label} from 'semantic-ui-react';
import {
  downloadFile,
  fileTypeDetail,
  formatFileSize,
} from '../common/fileUtils';

const VersionInfoModal = ({
  studyId,
  fileNode,
  openedVersion,
  onCloseDialog,
  onUploadClick,
  downloadFileMutation,
}) => {
  return (
    <Modal open={true} onClose={onCloseDialog} closeIcon>
      <Header content={`Document Versions: ${fileNode.name}`} />
      <Modal.Content scrolling>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header
                as="h3"
                size="medium"
                color="blue"
                title={openedVersion.version.fileName}
              >
                {openedVersion.version.fileName.length > 65
                  ? openedVersion.version.fileName.substring(0, 65) + '...'
                  : openedVersion.version.fileName}
              </Header>
              {openedVersion.index === 0 && (
                <Label size="mini" color="blue" float="right" basic>
                  LATEST
                </Label>
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column mobile={8} tablet={8} computer={4}>
              <Header as="h4" sub>
                Status
              </Header>
              <span>
                <Badge state={openedVersion.version.state} />
              </span>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={4}>
              <Header as="h4" sub>
                Document Type
              </Header>
              <span>
                <Label basic size="tiny">
                  <Icon name={`${fileTypeDetail[fileNode.fileType].icon}`} />
                  {' ' + fileTypeDetail[fileNode.fileType].title}
                </Label>
              </span>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
              <Header as="h4" sub>
                Last Updated
              </Header>
              <span>
                <AvatarTimeAgo
                  size="tiny"
                  showUsername
                  creator={openedVersion.version.creator}
                  createdAt={openedVersion.version.createdAt}
                />
              </span>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={3}>
              <Header as="h4" sub>
                Size
              </Header>
              <span>
                <Label basic size="tiny">
                  {formatFileSize(openedVersion.version.size)}
                </Label>
              </span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header as="h4" sub>
                Description
              </Header>
              <p>
                <small>
                  {openedVersion.version.description || 'No summary added...'}
                </small>
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          onClick={onUploadClick}
        >
          <Icon name="cloud upload" />
          UPLOAD VERSION
        </Button>
        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          onClick={() =>
            downloadFile(
              studyId,
              fileNode.kfId,
              openedVersion.version.kfId,
              downloadFileMutation,
            )
          }
        >
          <Icon name="download" />
          DOWNLOAD
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default VersionInfoModal;
