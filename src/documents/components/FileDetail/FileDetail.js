import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {withRouter, Link} from 'react-router-dom';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import {CopyToClipboard} from 'react-copy-to-clipboard';
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
  Menu,
} from 'semantic-ui-react';
import FileTags from './FileTags';
import FileName from './FileName';
import FileDescription from './FileDescription';
import AnalysisSummary from './AnalysisSummary';
import Timelines from './Timelines';

const ActionButtons = ({
  downloadFile,
  studyId,
  fileNode,
  downloadFileMutation,
  setDialog,
  deleteFile,
  history,
  updateFile,
  allowExtractConfig,
  vertical,
  allowUpload,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <Menu vertical={vertical} secondary fluid>
      <Menu.Item header as="h4" className="text-grey noMargin">
        Actions
      </Menu.Item>
      {allowUpload && (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'upload button']
              : ['button', 'upload button'],
          })}
        >
          {({logEvent}) => (
            <Popup
              content="Upload new version"
              position="left center"
              inverted
              trigger={
                <Menu.Item
                  onClick={() => {
                    logEvent('click');
                    setDialog('upload');
                  }}
                >
                  <Icon name="upload" />
                  New version
                </Menu.Item>
              }
            />
          )}
        </Amplitude>
      )}
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
            position="left center"
            inverted
            trigger={
              <Menu.Item
                onClick={e => {
                  logEvent('click');
                  e.preventDefault();
                  window.open(
                    `/study/${studyId}/documents/${fileNode.kfId}/versions/${
                      fileSortedVersions(fileNode)[0].node.kfId
                    }`,
                  );
                }}
              >
                <Icon name="eye" />
                Preview
              </Menu.Item>
            }
          />
        )}
      </Amplitude>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'download button']
            : ['button', 'download button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="left center"
            content="Download latest version"
            trigger={
              <Menu.Item
                as="a"
                href={
                  fileNode.downloadUrl +
                  `/version/${fileSortedVersions(fileNode)[0].node.kfId}`
                }
                onClick={e => {
                  logEvent('click');
                  e.preventDefault();
                  downloadFile(
                    studyId,
                    fileNode.kfId,
                    null,
                    downloadFileMutation,
                  );
                }}
              >
                <Icon name="download" />
                Download
              </Menu.Item>
            }
          />
        )}
      </Amplitude>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'copy download url button']
            : ['button', 'copy download url button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="left center"
            content="Copy download link"
            trigger={
              <CopyToClipboard
                text={
                  fileNode.downloadUrl +
                  `/version/${fileSortedVersions(fileNode)[0].node.kfId}`
                }
                onCopy={() => {
                  logEvent('click');
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 700);
                }}
              >
                <Menu.Item data-testid="copy-url-button">
                  <Icon name={copied ? 'check' : 'copy'} />
                  {copied ? 'Copied' : 'Copy link'}
                </Menu.Item>
              </CopyToClipboard>
            }
          />
        )}
      </Amplitude>
      {fileTypeDetail[fileNode.fileType].config && allowExtractConfig && (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'config button']
              : ['button', 'config button'],
          })}
        >
          {({logEvent}) => (
            <Popup
              inverted
              position="left center"
              content="Extract config file"
              trigger={
                <Menu.Item
                  onClick={() => {
                    logEvent('click');
                    setDialog('config');
                  }}
                  data-testid="config"
                >
                  <Icon name="wrench" />
                  Config
                </Menu.Item>
              }
            />
          )}
        </Amplitude>
      )}
      {deleteFile && (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'delete button']
              : ['button', 'delete button'],
          })}
        >
          {({logEvent}) => (
            <Popup
              trigger={
                <Menu.Item data-testid="delete-button">
                  <Icon name="trash" />
                  Delete
                </Menu.Item>
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
                      logEvent('click');
                      deleteFile({variables: {kfId: fileNode.kfId}});
                      history.push(`/study/${studyId}/documents`);
                    }}
                  />
                </>
              }
              on="click"
              position="left center"
            />
          )}
        </Amplitude>
      )}
    </Menu>
  );
};

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
  allowExtractConfig,
  event,
  studyFiles,
}) => {
  const studyId = match.params.kfId;
  const [dialog, setDialog] = useState(false);
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const latestSize = fileLatestSize(sortedVersions);
  return (
    <Grid className="mb-50">
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={14}>
          <Link
            to={`/study/${match.params.kfId}/documents`}
            data-testid="back-to-filelist"
          >
            <Button basic size="mini" labelPosition="left" floated="left">
              <Icon name="arrow left" />
              All Documents
            </Button>
          </Link>
          <FileName
            fileNode={fileNode}
            updateFile={updateFile}
            studyFiles={studyFiles}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="noVerticalPadding">
        <Grid.Column mobile={16} only="mobile">
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
              allowExtractConfig,
              allowUpload,
              vertical: false,
            }}
          />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={13} computer={14} className="pl-0">
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={10}>
                <Segment className="noBorders noMargin">
                  <Header as="h4" color="grey">
                    Basic info
                  </Header>
                  <Label size="small" className="ml-0 mr-5 my-2">
                    {latestSize}
                  </Label>
                  <AvatarTimeAgo
                    size="small"
                    showUsername
                    creator={sortedVersions[0].node.creator}
                    createdAt={latestDate}
                  />
                  <Label size="small" image className="ml-5 my-2 px-10">
                    <Icon name={`${fileTypeDetail[fileNode.fileType].icon}`} />
                    {fileTypeDetail[fileNode.fileType].title}
                    {updateFile && (
                      <Popup
                        content="Edit document type"
                        position="right center"
                        inverted
                        trigger={
                          <Label.Detail
                            className="text-primary"
                            data-testid="edit-type"
                            onClick={() => setDialog('annotation')}
                          >
                            <Icon name="pencil" />
                            Edit
                          </Label.Detail>
                        }
                      />
                    )}
                  </Label>
                </Segment>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={6}>
                <Segment className="noBorders noMargin">
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Segment className="noBorders noMargin">
            <FileDescription fileNode={fileNode} updateFile={updateFile} />
          </Segment>
          {sortedVersions && sortedVersions[0].node.analysis && (
            <Segment className="noBorders">
              <Header as="h4" color="grey">
                Summary
              </Header>
              <AnalysisSummary version={sortedVersions[0].node} />
            </Segment>
          )}
          <Segment className="noBorders" loading={event.loading}>
            <Header as="h4" color="grey">
              Timeline{' '}
              <span className="text-10 text-normal">
                (latest first, most recent 20 events)
              </span>
            </Header>
            {event.error && (
              <Message
                negative
                icon="warning circle"
                header="Error"
                content={event.error.message}
              />
            )}
            {event.data && (
              <Timelines
                eventData={event.data}
                stripFileId={fileNode.kfId}
                downloadFileMutation={downloadFileMutation}
              />
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column
          tablet={3}
          computer={2}
          only="tablet computer"
          className="noPadding"
        >
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
              allowExtractConfig,
              allowUpload,
              vertical: true,
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
          downloadFileMutation={downloadFileMutation}
          allowUpload={allowUpload}
          updateFile={updateFile}
          updateError={updateError}
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
