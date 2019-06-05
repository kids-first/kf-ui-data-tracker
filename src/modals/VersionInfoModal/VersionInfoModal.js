import React from 'react';
import TimeAgo from 'react-timeago';
import Modal from '../../components/Modal/Modal';
import SvgIcon from '../../components/Icon/Icon';
import Badge from '../../components/Badge/Badge';
import {GridContainer, Avatar} from 'kf-uikit';
import {
  downloadFile,
  fileTypeDetail,
  formatFileSize,
} from '../../common/fileUtils';

const VersionInfoModal = ({
  studyId,
  fileNode,
  openedVersion,
  onCloseDialog,
  onUploadClick,
  downloadFileMutation,
}) => {
  return (
    <Modal
      title={`Document Versions: ${fileNode.name}`}
      submitText="DOWNLOAD"
      onSubmit={() =>
        downloadFile(
          studyId,
          fileNode.kfId,
          openedVersion.version.kfId,
          downloadFileMutation,
        )
      }
      onCloseModal={onCloseDialog}
      footerButton={
        <button className="FileVersionList--Button" onClick={onUploadClick}>
          <SvgIcon kind="Upload" height="15" width="15" className="mr-4" />
          UPLOAD VERSION
        </button>
      }
      className="Modal--small"
    >
      {openedVersion.index === 0 && (
        <div className="FileVersionElement--Tag">Latest</div>
      )}
      <h3 className="FileTitle py-8">{openedVersion.version.fileName}</h3>
      <GridContainer className="px-0 mb-20">
        <div className="cell-6 lg:cell-3">
          <p className="FileInfo--Title">Status:</p>
          <Badge state={openedVersion.version.state} />
        </div>
        <div className="cell-6 lg:cell-3">
          <p className="FileInfo--Title">File Type:</p>
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
        <div className="cell-6 lg:cell-3">
          <p className="FileInfo--Title">Updated:</p>
          {openedVersion.version.createdAt ? (
            <div className="flex">
              <p className="FileInfo--Text">
                <TimeAgo
                  date={openedVersion.version.createdAt}
                  live={false}
                  className="mr-4"
                />
                by
              </p>
              <Avatar
                className="inline-block ml-4 mt-4"
                size={20}
                imgUrl={
                  openedVersion.version.creator
                    ? openedVersion.version.creator.picture
                    : 'https://www.w3schools.com/css/img_avatar.png'
                }
                userName={
                  openedVersion.version.creator &&
                  openedVersion.version.creator.username
                }
                userEmail={
                  openedVersion.version.creator &&
                  openedVersion.version.creator.email
                }
              />
            </div>
          ) : (
            <p className="FileInfo--Text">Unknown</p>
          )}
        </div>
        <div className="cell-6 lg:cell-3">
          <p className="FileInfo--Title">Size:</p>
          <p className="FileInfo--Text">
            {formatFileSize(openedVersion.version.size)}
          </p>
        </div>
      </GridContainer>
      <p className="FileInfo--Title">Change Summary:</p>
      <p>{openedVersion.version.description}</p>
      <div className="h-8 w-48" />
    </Modal>
  );
};

export default VersionInfoModal;
