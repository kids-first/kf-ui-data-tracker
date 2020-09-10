import React, {Fragment} from 'react';
import {
  NewVersionModal,
  VersionInfoModal,
  EditDocumentModal,
  ExtractConfigModal,
} from '../../modals';
/**
 * Render NewVersionModal, EditDocumentModal or VersionInfoModal
 * Handling conditional rendering in a separate file to keep FileDetail clean
 */
const FileDetailModal = ({
  match,
  className,
  onSubmit,
  children,
  studyId,
  fileNode,
  openedVersion,
  dialog,
  onCloseModal,
  onUploadClick,
  downloadFileMutation,
  allowUpload,
}) => {
  return (
    <Fragment>
      {dialog === 'upload' && (
        <NewVersionModal
          match={match}
          fileNode={fileNode}
          handleClose={onCloseModal}
        />
      )}
      {dialog === 'annotation' && (
        <EditDocumentModal
          studyId={studyId}
          fileNode={fileNode}
          onCloseDialog={onCloseModal}
        />
      )}
      {dialog === 'versionInfo' && (
        <VersionInfoModal
          studyId={studyId}
          fileNode={fileNode}
          openedVersion={openedVersion}
          onCloseDialog={onCloseModal}
          onUploadClick={allowUpload ? onUploadClick : null}
          downloadFileMutation={downloadFileMutation}
        />
      )}
      {dialog === 'config' && (
        <ExtractConfigModal
          studyId={studyId}
          fileNode={fileNode}
          onCloseDialog={onCloseModal}
        />
      )}
    </Fragment>
  );
};

export default FileDetailModal;
