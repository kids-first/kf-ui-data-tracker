import React, {Fragment} from 'react';
import {NewVersionModal} from '../../modals';
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
  dialog,
  onCloseModal,
  onNotificationClick,
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
    </Fragment>
  );
};

export default FileDetailModal;
