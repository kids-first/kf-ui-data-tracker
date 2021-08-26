import React, {Fragment} from 'react';
import {
  NewVersionModal,
  EditDocumentModal,
  ExtractConfigModal,
} from '../../modals';
/**
 * Render NewVersionModal, EditDocumentModal
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
  updateFile,
  updateError,
  templates,
  evaluateResult,
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
          updateFile={updateFile}
          updateError={updateError}
          templates={templates}
          evaluateResult={evaluateResult}
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
