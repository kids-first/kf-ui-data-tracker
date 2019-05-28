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
import SvgIcon from '../Icon/Icon';
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
          <SvgIcon kind="Error" width="12" height="12" className="mx-16 mb-4" />
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
          <div className="FileInfo--Icon">
            <SvgIcon
              kind={fileTypeDetail[fileType].icon}
              width="24"
              height="24"
            />
          </div>
          <p className="FileVersionList--text w-48">
            {fileTypeDetail[fileType].title}
          </p>
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
