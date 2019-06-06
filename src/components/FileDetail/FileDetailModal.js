import React, {Fragment} from 'react';
import {NewVersionModal, VersionInfoModal} from '../../modals';
import AnnotateVersionModalContainer from './AnnotateVersionModalContainer';
/**
 * Render either UploadVersionModal or AnnotateVersionModal
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
        <AnnotateVersionModalContainer
          kfId={fileNode.kfId}
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
        />
      )}
    </Fragment>
  );
};

export default FileDetailModal;
