import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {withRouter, Link} from 'react-router-dom';
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
import {
  Button,
  Grid,
  Label,
  Icon,
  Segment,
  Header,
  Popup,
  Divider,
  Message,
} from 'semantic-ui-react';
import FileTags from './FileTags';
import FileDescription from './FileDescription';
import AnalysisSummary from './AnalysisSummary';

const ActionButtons = ({
  downloadFile,
  studyId,
  fileNode,
  downloadFileMutation,
  setDialog,
  deleteFile,
  history,
  updateFile,
}) => (
  <>
    <Header as="h5" attached="top" textAlign="center" color="blue">
      Actions
    </Header>
    <Segment raised attached secondary>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'preview button']
            : ['button', 'preview button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            content="Preview latest version"
            position="top center"
            inverted
            trigger={
              <Button
                fluid
                className="mb-15"
                icon="eye"
                primary
                size="mini"
                labelPosition="left"
                onClick={e => {
                  logEvent('click');
                  e.preventDefault();
                  window.open(
                    `/study/${studyId}/documents/${fileNode.kfId}/versions/${
                      fileSortedVersions(fileNode)[0].node.kfId
                    }`,
                  );
                }}
                content="PREVIEW"
              />
            }
          />
        )}
      </Amplitude>
      <Popup
        inverted
        position="top center"
        icon="download"
        content="Download latest version"
        trigger={
          <Button
            as="a"
            href={
              fileNode.downloadUrl +
              `/version/${fileSortedVersions(fileNode)[0].node.kfId}`
            }
            color="grey"
            icon="download"
            fluid
            size="mini"
            labelPosition="left"
            onClick={e => {
              e.preventDefault();
              downloadFile(studyId, fileNode.kfId, null, downloadFileMutation);
            }}
            content="DOWNLOAD"
          />
        }
      />
      {(updateFile !== null || deleteFile !== null) && (
        <>
          <Divider />
          <Button.Group size="mini" fluid>
            {updateFile && (
              <Button
                icon="pencil"
                size="small"
                labelPosition="left"
                color="grey"
                onClick={() => setDialog('annotation')}
                data-testid="edit-button"
                content="EDIT"
              />
            )}
            {deleteFile && (
              <Popup
                trigger={
                  <Button icon="trash alternate" data-testid="delete-button" />
                }
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
        </>
      )}
    </Segment>
  </>
);

/**
 * Form to display file details and file versions
 */
const FileDetail = ({
  fileNode,
  history,
  match,
  allowUpload,
  allowViewVersion,
  updateFile,
  updateError,
  downloadFileMutation,
  deleteFile,
  tagOptions,
}) => {
  const studyId = match.params.kfId;
  const [dialog, setDialog] = useState(false);
  const [versionOpened, setOpenVersion] = useState({version: {}, index: null});
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const latestSize = fileLatestSize(sortedVersions);
  return (
    <Grid className="mb-15">
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
      <Grid.Row className="noVerticalPadding">
        <Grid.Column mobile={16} tablet={16} computer={13}>
          <Segment.Group className="noBorders">
            <Segment.Group horizontal className="noBorders">
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
                  creator={sortedVersions[0].node.creator}
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
              <FileDescription fileNode={fileNode} updateFile={updateFile} />
            </Segment>
            <Segment className="noBorders">
              <Header as="h4" color="grey">
                Tags
              </Header>
              <FileTags
                fileNode={fileNode}
                updateFile={updateFile}
                defaultOptions={tagOptions}
              />
              {updateError && (
                <Message
                  negative
                  icon="warning circle"
                  header="Error"
                  content={updateError.message}
                />
              )}
            </Segment>
            {sortedVersions && sortedVersions[0].node.analysis && (
              <Segment className="noBorders">
                <Header as="h4" color="grey">
                  Summary
                </Header>
                <AnalysisSummary version={sortedVersions[0].node} />
              </Segment>
            )}
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
              updateFile,
            }}
          />
        </Grid.Column>
      </Grid.Row>
      {allowViewVersion && (
        <Grid.Row className="noVerticalPadding">
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <Segment className="noBorders">
              <Header as="h4" color="grey">
                Versions
              </Header>
              <VersionList
                studyId={studyId}
                fileNode={fileNode}
                allowUpload={allowUpload}
                onUploadClick={() => setDialog('upload')}
                onNameClick={(versionNode, index) => {
                  setDialog('versionInfo');
                  setOpenVersion({version: versionNode, index: index});
                }}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      )}
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
          allowUpload={allowUpload}
        />
      )}
    </Grid>
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
