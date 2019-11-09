import React, {Fragment} from 'react';
import {
  NewVersionModal,
  VersionInfoModal,
  EditDocumentModal,
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
          onUploadClick={onUploadClick}
          downloadFileMutation={downloadFileMutation}
          eventProperties={{
            document: {
              kfId: fileNode.kfId,
              file_name: fileNode.fileName,
              state: openedVersion.version.state,
              created_at: openedVersion.version.createdAt,
            },
          }}
        />
      )}
    </Fragment>
  );
};

export default FileDetailModal;
