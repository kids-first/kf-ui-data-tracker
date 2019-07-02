import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import TimeAgo from 'react-timeago';
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
  Statistic,
  Icon,
  Header,
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
                      labeled
                      icon
                      size="mini"
                      labelPosition="left"
                      floated="left"
                    >
                      <Icon name="arrow left" />
                      Back to All Documents
                    </Button>
                  </Link>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header>
                    {fileNode.name}
                    <Button.Group icon labeled size="mini" floated="right">
                      <Button
                        icon="pencil"
                        onClick={() => setDialog('annotation')}
                        data-testid="edit-button"
                        content="EDIT"
                      />
                      <Button
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
                      <Button
                        negative
                        icon="trash alternate"
                        onClick={e => {
                          deleteFile({variables: {kfId: fileNode.kfId}});
                          history.goBack();
                        }}
                        content="DELETE"
                      />
                    </Button.Group>
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row stretched>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Statistic size="mini">
                    <Statistic.Label style={{textAlign: 'left'}}>
                      Status
                    </Statistic.Label>
                    <Statistic.Value style={{textAlign: 'left'}}>
                      <Badge state={sortedVersions[0].node.state} />
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
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Statistic size="mini">
                    <Statistic.Label style={{textAlign: 'left'}}>
                      Last Updated
                    </Statistic.Label>
                    <Statistic.Value style={{textAlign: 'left'}}>
                      <Label image size="tiny" style={{textWrap: 'no'}}>
                        <img
                          alt={
                            fileNode.creator
                              ? fileNode.creator.username
                              : 'unknown'
                          }
                          src={
                            fileNode.creator.picture
                              ? fileNode.creator.picture
                              : 'https://www.w3schools.com/css/img_avatar.png'
                          }
                        />
                        {fileNode.creator.username}
                        <Label.Detail>
                          {latestDate ? (
                            <TimeAgo date={latestDate} live={false} />
                          ) : (
                            'Unknow'
                          )}
                        </Label.Detail>
                      </Label>
                    </Statistic.Value>
                  </Statistic>
                </Grid.Column>
                <Grid.Column mobile={8} tablet={8} computer={4}>
                  <Statistic size="mini">
                    <Statistic.Label style={{textAlign: 'left'}}>
                      Size
                    </Statistic.Label>
                    <Statistic.Value style={{textAlign: 'left'}}>
                      <Label basic size="tiny">
                        {latestSize}
                      </Label>
                    </Statistic.Value>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header size="small">Description</Header>
                  {fileNode.description || 'No description added...'}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Segment style={{padding: 0}}>
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
