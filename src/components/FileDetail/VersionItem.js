import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import {Avatar, Icon} from 'kf-uikit';
import TimeAgo from 'react-timeago';
import CopyButton from '../CopyButton/CopyButton';
import {
  fileTypeDetail,
  formatFileSize,
  downloadFile,
} from '../../common/fileUtils';
/**
 * Displays single version item from the list
 */
const VersionItem = ({
  className,
  studyId,
  fileId,
  fileType,
  fileName,
  versionNode,
  index,
}) => {
  const ext = fileName.substr(fileName.lastIndexOf('.'));
  let versionItemClass = classes('FileVersionList--Element', className);
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <li key={versionNode.kfId} className={versionItemClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 94 94"
            height="12"
            width="12"
            className="mx-16"
          >
            <defs />
            <title>icon-error</title>
            <g id="Layer_1" data-name="Layer 1">
              <circle fill="#fff" cx="47" cy="47" r="43" />
              <path
                fill="#e45562"
                d="M47,94A47,47,0,1,1,94,47,47,47,0,0,1,47,94ZM47,8A39,39,0,1,0,86,47,39,39,0,0,0,47,8Z"
                transform="translate(0 0)"
              />
              <path
                fill="#e45562"
                d="M59.83,64.07a4.25,4.25,0,0,1-3-1.26L47,53.05,37.2,62.83a4.32,4.32,0,0,1-6.05,0,4.26,4.26,0,0,1,0-6L41,47l-9.79-9.8a4.3,4.3,0,0,1,0-6.05,4.38,4.38,0,0,1,6.07,0L47.06,41l9.7-9.65a4.3,4.3,0,0,1,6,0,4.24,4.24,0,0,1,0,6.05L53.11,47l9.74,9.74a4.3,4.3,0,0,1,0,6.06,4.25,4.25,0,0,1-3,1.26Zm-1-30.75h0Z"
                transform="translate(0 0)"
              />
            </g>
          </svg>
          <button
            className="FileVersionElement--button w-24"
            onClick={e =>
              downloadFile(
                studyId,
                fileId,
                versionNode.kfId,
                downloadFileMutation,
              )
            }
          >
            {index > 0 ? versionNode.kfId : 'Latest'}
          </button>
          <CopyButton
            text={versionNode.kfId}
            className="FileVersionElement--button FileVersionList--hidden w-12"
          />
          <Avatar
            className="inline-block mr-8 hidden"
            size={20}
            imgUrl="https://www.w3schools.com/css/img_avatar.png"
          />
          <TimeAgo
            date={versionNode.createdAt}
            live={false}
            className="FileVersionList--text w-32"
          />
          <p className="FileVersionList--text w-16 hidden">{ext}</p>
          <p className="FileVersionList--text w-24">
            {formatFileSize(versionNode.size, true) || 'Size Unknown'}
          </p>
          <div className="flex">
            <div className="FileVersionList--icon">
              <Icon
                width={12}
                height={12}
                kind={fileTypeDetail[fileType].icon}
              />
            </div>
            <p className="FileVersionList--text my-0 w-48">
              {fileTypeDetail[fileType].title}
            </p>
          </div>
          <button
            onClick={e =>
              downloadFile(
                studyId,
                fileId,
                versionNode.kfId,
                downloadFileMutation,
              )
            }
          >
            <Icon
              kind="download"
              width={12}
              height={12}
              className="FileVersionList--hidden w-12"
            />
          </button>
        </li>
      )}
    </Mutation>
  );
};

VersionItem.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Study kfId*/
  studyId: PropTypes.string,
  /** File kfId*/
  fileId: PropTypes.string,
  /** File type*/
  fileType: PropTypes.string,
  /** File name*/
  fileName: PropTypes.string,
  /** Version object*/
  versionNode: PropTypes.object.isRequired,
  /** Index of version item (sort by createdAt)*/
  index: PropTypes.number,
};

VersionItem.defaultProps = {
  className: null,
  studyId: null,
  fileId: null,
  fileType: null,
  fileName: null,
  fileNode: {},
  index: null,
};

export default VersionItem;
