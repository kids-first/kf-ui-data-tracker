import React, {Fragment} from 'react';
import {NewVersionModal} from '../../modals';
import AnnotateVersionModalContainer from './AnnotateVersionModalContainer';
import NotificationBar from './NotificationBar';
import SvgIcon from '../Icon/Icon';
/**
 * Render either UploadVersionModal or AnnotateVersionModal
 * Handling conditional rendering in a separate file to keep FileDetail clean
 * Adding NotificationBar here since it is mainly used to switch modal view
 */
const NotificationAction = ({onClick, buttonText}) => (
  <button
    onClick={onClick}
    className="FileVersionList--Button"
    data-testid="notificationBar-button"
  >
    <SvgIcon kind="Edit" height="8" width="8" className="mr-4 mt-4" />
    {buttonText}
  </button>
);

const FileDetailModal = ({
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
          fileNode={fileNode}
          handleClose={onCloseModal}
          additionalContent={() => (
            <NotificationBar
              mainButton={() => (
                <NotificationAction
                  onClick={onNotificationClick}
                  buttonText="EDIT FILE INFO"
                />
              )}
              icon="note"
              message="Info Update?"
              note="Want to change the Name, Description, or File Type as well?"
            />
          )}
        />
      )}
      {dialog === 'annotation' && (
        <AnnotateVersionModalContainer
          kfId={fileNode.kfId}
          onCloseDialog={onCloseModal}
          additionalContent={() => (
            <NotificationBar
              mainButton={() => (
                <NotificationAction
                  onClick={onNotificationClick}
                  buttonText="UPLOAD VERSION"
                />
              )}
              icon="note"
              message="New Data?"
              note="If you have a new version of the current data for this file please"
            />
          )}
        />
      )}
    </Fragment>
  );
};

export default FileDetailModal;
