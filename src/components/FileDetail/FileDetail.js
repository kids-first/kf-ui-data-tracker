import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import TimeAgo from 'react-timeago';
import {Button, Icon, GridContainer, Avatar} from 'kf-uikit';
import Badge from '../Badge/Badge';
import VersionList from './VersionList';
import {
  fileTypeDetail,
  downloadFile,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
} from '../../common/fileUtils';
import DeleteFileMutation from '../../containers/DeleteFileMutation';
import Box from '../../assets/icons/box';
import Clinical from '../../assets/icons/clinical';
import Misc from '../../assets/icons/misc';
import Sequencing from '../../assets/icons/sequencing';
/**
 * Form to display file details and file versions
 */
const FileDetail = ({fileNode, history, match}) => {
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
              >
                Back to All Files
              </Link>
              <h3 className="FileTitle row-2 cell-12 lg:cell-10 md:cell-9 ">
                {fileNode.name}
              </h3>
              <div className="md:row-3 lg:cell-10 md:cell-9 cell-12">
                <GridContainer>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Status:</p>
                    <Badge state="changesRequired" />
                  </div>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">File Type:</p>
                    <div className="flex">
                      <div className="FileInfo--Icon">
                        {fileNode.fileType === 'SHM' && <Box />}
                        {fileNode.fileType === 'CLN' && <Clinical />}
                        {fileNode.fileType === 'SEQ' && <Sequencing />}
                        {fileNode.fileType === 'OTH' && <Misc />}
                      </div>
                      <p className="FileInfo--Text">
                        {fileTypeDetail[fileNode.fileType].title}
                      </p>
                    </div>
                  </div>
                  <div className="cell-6 sm:cell-3">
                    <p className="FileInfo--Title">Updated:</p>
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
                          imgUrl="https://www.w3schools.com/css/img_avatar.png"
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
                  onClick={() => {
                    history.push(
                      `/study/${match.params.kfId}/files/${
                        fileNode.kfId
                      }/annotation`,
                    );
                  }}
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
              <VersionList studyId={studyId} fileNode={fileNode} />
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
