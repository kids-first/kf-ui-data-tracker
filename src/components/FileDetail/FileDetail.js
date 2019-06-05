import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import TimeAgo from 'react-timeago';
import {Button, Icon, GridContainer, Avatar} from 'kf-uikit';
import Badge from '../Badge/Badge';
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
import SvgIcon from '../Icon/Icon';
/**
 * Form to display file details and file versions
 */
const FileDetail = ({fileNode, history, match}) => {
  const [dialog, setDialog] = useState(false);
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const latestSize = fileLatestSize(sortedVersions);
  const studyId = match.params.kfId;
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <DeleteFileMutation studyId={studyId}>
          {(deleteFile, {loading, error}) => (
            <GridContainer>
              <Link
                to={`/study/${match.params.kfId}/files`}
                className="BackButton"
                data-testid="back-to-filelist"
              >
                Back to All Files
              </Link>
              <h3 className="FileTitle font-body font-black row-2 cell-12 lg:cell-10 md:cell-9 ">
                {fileNode.name}
              </h3>
              <div className="md:row-3 lg:cell-10 md:cell-9 cell-12">
                <GridContainer>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Status:</p>
                    <Badge state={sortedVersions[0].node.state} />
                  </div>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Document Type:</p>
                    <div className="flex">
                      <div className="FileInfo--Icon">
                        <SvgIcon
                          kind={fileTypeDetail[fileNode.fileType].icon}
                          width="24"
                          height="24"
                        />
                      </div>
                      <p className="FileInfo--Text">
                        {fileTypeDetail[fileNode.fileType].title}
                      </p>
                    </div>
                  </div>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Last Updated:</p>
                    {latestDate ? (
                      <div className="flex">
                        <p className="FileInfo--Text">
                          <TimeAgo
                            date={latestDate}
                            live={false}
                            className="mr-4"
                          />
                          by
                        </p>
                        <Avatar
                          className="inline-block ml-4 mt-4"
                          size={20}
                          imgUrl={
                            fileNode.creator
                              ? fileNode.creator.picture
                              : 'https://www.w3schools.com/css/img_avatar.png'
                          }
                          userName={
                            fileNode.creator && fileNode.creator.username
                          }
                          userEmail={fileNode.creator && fileNode.creator.email}
                        />
                      </div>
                    ) : (
                      <p className="FileInfo--Text">Unknown</p>
                    )}
                  </div>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Size:</p>
                    <p className="FileInfo--Text">{latestSize}</p>
                  </div>
                </GridContainer>
              </div>
              <div className="row-3 lg:cell-2 md:cell-3 cell-12 flex flex-row items-start h-full w-full justify-start flex-wrap">
                <Button
                  type="button"
                  icon="edit"
                  onClick={() => setDialog('annotation')}
                  data-testid="edit-button"
                >
                  EDIT
                </Button>
                <button
                  className="hidden sm:inline-block text-grey test-xs font-light underline ml-12 my-4"
                  onClick={e => {
                    deleteFile({variables: {kfId: fileNode.kfId}});
                    history.goBack();
                  }}
                >
                  <Icon className="mr-4" width={10} height={10} kind="delete" />
                  <span>Delete</span>
                </button>
                <Button
                  type="button"
                  icon="download"
                  color="primary"
                  onClick={e =>
                    downloadFile(
                      studyId,
                      fileNode.kfId,
                      null,
                      downloadFileMutation,
                    )
                  }
                  className="mx-12 md:mt-12 lg:mx-0 lg:w-full"
                >
                  DOWNLOAD
                </Button>
              </div>
              <div className="cell-12 lg:cell-10 md:cell-9 md:h-full">
                <p className="FileInfo--Title">Description:</p>
                {fileNode.description ? (
                  <p className="FileInfo--Text md:mr-0 h-full">
                    {fileNode.description}
                  </p>
                ) : (
                  <p className="FileInfo--Text md:mr-0 text-mediumGrey">
                    No description added...
                  </p>
                )}
              </div>
              <VersionList
                studyId={studyId}
                fileNode={fileNode}
                onUploadClick={() => setDialog('upload')}
              />
              {dialog !== false && (
                <FileDetailModal
                  match={match}
                  studyId={studyId}
                  fileNode={fileNode}
                  onCloseModal={() => setDialog(false)}
                  dialog={dialog}
                  onNotificationClick={() =>
                    setDialog(dialog === 'annotation' ? 'upload' : 'annotation')
                  }
                />
              )}
            </GridContainer>
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
