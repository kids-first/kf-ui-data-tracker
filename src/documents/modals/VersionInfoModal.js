import React from 'react';
import Badge from '../../components/Badge/Badge';
import AvatarTimeAgo from '../../components/AvatarTimeAgo/AvatarTimeAgo';
import {Button, Header, Modal, Icon, Grid, Label} from 'semantic-ui-react';
import {downloadFile, formatFileSize, lengthLimit} from '../utilities';
import {fileTypeDetail} from '../../common/enums';
import {LogOnMount} from '@amplitude/react-amplitude';
import {withAnalyticsTracking} from '../../analyticsTracking';

const VersionInfoModal = ({
  studyId,
  fileNode,
  openedVersion,
  onCloseDialog,
  onUploadClick,
  downloadFileMutation,
  tracking: {
    buttonTracking,
    instrument,
    EVENT_CONSTANTS: {DOCUMENT_VERSION_},
  },
}) => {
  return (
    <Modal
      open={true}
      onClose={instrument(DOCUMENT_VERSION_.MODAL__CLOSE, onCloseDialog)}
      closeIcon
    >
      <LogOnMount eventType={DOCUMENT_VERSION_.MODAL__OPEN} />
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
                {lengthLimit(openedVersion.version.fileName, 65)}
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
              <Header as="h4" sub color="grey">
                Status
              </Header>
              <span>
                <Badge state={openedVersion.version.state} />
              </span>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={4}>
              <Header as="h4" sub color="grey">
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
              <Header as="h4" sub color="grey">
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
              <Header as="h4" sub color="grey">
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
            <Grid.Column mobile={10} tablet={9} computer={9}>
              <Header as="h4" sub color="grey">
                Version Summary
              </Header>
              <p>
                {openedVersion.version.description || 'No summary added...'}
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
          {...buttonTracking('UPLOAD VERSION', null, null, 'UPLOAD VERSION')}
          onClick={instrument('UPLOAD_VERSION__CLICK', onUploadClick)}
        >
          <Icon name="cloud upload" />
          UPLOAD VERSION
        </Button>
        <Button
          primary
          icon
          labelPosition="left"
          size="mini"
          {...buttonTracking(
            'DOWNLOAD VERSION',
            null,
            null,
            'DOWNLOAD VERSION',
          )}
          onClick={() => {
            buttonTracking(
              'DOWNLOAD VERSION',
              null,
              null,
              'DOWNLOAD VERSION',
            ).onClick();
            downloadFile(
              studyId,
              fileNode.kfId,
              openedVersion.version.kfId,
              downloadFileMutation,
            );
          }}
        >
          <Icon name="download" />
          DOWNLOAD
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default withAnalyticsTracking(VersionInfoModal);
