import React from 'react';
import TimeAgo from 'react-timeago';
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
            <Grid.Column mobile={8} tablet={8} computer={4}>
              <Statistic size="mini">
                <Statistic.Label style={{textAlign: 'left'}}>
                  Status
                </Statistic.Label>
                <Statistic.Value style={{textAlign: 'left'}}>
                  <Badge state={openedVersion.version.state} />
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={4}>
              <Statistic size="mini">
                <Statistic.Label style={{textAlign: 'left'}}>
                  Document Type
                </Statistic.Label>
                <Statistic.Value style={{textAlign: 'left'}}>
                  <Label icon basic size="tiny">
                    <Icon
                      name={`${fileTypeDetail[fileNode.fileType].icon ||
                        'question'}`}
                    />
                    {' ' + fileTypeDetail[fileNode.fileType].title}
                  </Label>
                </Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column mobile={8} tablet={8} computer={5}>
              <Statistic size="mini">
                <Statistic.Label style={{textAlign: 'left'}}>
                  Last Updated
                </Statistic.Label>
                <Statistic.Value style={{textAlign: 'left'}}>
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
            <Grid.Column mobile={8} tablet={8} computer={3}>
              <Statistic size="mini">
                <Statistic.Label style={{textAlign: 'left'}}>
                  Size
                </Statistic.Label>
                <Statistic.Value style={{textAlign: 'left'}}>
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
