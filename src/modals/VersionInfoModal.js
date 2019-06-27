import React from 'react';
import TimeAgo from 'react-timeago';
import SvgIcon from '../components/Icon/Icon';
import Badge from '../components/Badge/Badge';
import {
  Button,
  Header,
  Modal,
  Icon,
  Grid,
  Label,
  Statistic,
} from 'semantic-ui-react';
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
              <Header size="small">{openedVersion.version.fileName}</Header>
              {openedVersion.index === 0 && (
                <Label tag size="mini" color="purple" float="right">
                  LATEST
                </Label>
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column mobile={8} tablet={3} computer={4}>
              <Statistic size="mini">
                <Statistic.Label>Status</Statistic.Label>
                <Statistic.Value>
                  <Badge state={openedVersion.version.state} />
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={5} computer={5}>
              <Statistic size="mini">
                <Statistic.Label>Document Type</Statistic.Label>
                <Statistic.Value>
                  <Label icon basic size="tiny">
                    <SvgIcon
                      kind={fileTypeDetail[fileNode.fileType].icon}
                      width="12"
                      height="12"
                    />
                    <Label.Detail>
                      {fileTypeDetail[fileNode.fileType].title}
                    </Label.Detail>
                  </Label>
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={4} computer={4}>
              <Statistic size="mini">
                <Statistic.Label>Last Updated</Statistic.Label>
                <Statistic.Value>
                  <Label image size="tiny">
                    <img
                      alt={
                        openedVersion.version.creator
                          ? openedVersion.version.creator.username
                          : 'unknown'
                      }
                      src={
                        openedVersion.version.creator.picture
                          ? openedVersion.version.creator.picture
                          : 'https://www.w3schools.com/css/img_avatar.png'
                      }
                    />
                    {openedVersion.version.creator.username}
                    <Label.Detail>
                      {openedVersion.version.createdAt ? (
                        <TimeAgo
                          date={openedVersion.version.createdAt}
                          live={false}
                        />
                      ) : (
                        'Unknow'
                      )}
                    </Label.Detail>
                  </Label>
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={3} computer={3}>
              <Statistic size="mini">
                <Statistic.Label>Size</Statistic.Label>
                <Statistic.Value>
                  <Label basic size="tiny">
                    {formatFileSize(openedVersion.version.size)}
                  </Label>
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header size="tiny">Change Summary</Header>
              {openedVersion.version.description}
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
