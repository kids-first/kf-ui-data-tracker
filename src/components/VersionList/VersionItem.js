import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import {Avatar, Icon, GridContainer} from 'kf-uikit';
import TimeAgo from 'react-timeago';

import {
  fileTypeDetail,
  versionState,
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
  versionNode,
  index,
  onNameClick,
}) => {
  let versionItemClass = classes('FileVersionList--Element', className);
  const stateColor = versionNode.state
    ? versionState[versionNode.state].color
    : 'bg-lightGrey';
  const iconClass = classes(
    'FileVersionElement--Icon',
    'row-3',
    'cell-1',
    'lg:row-1',
    'lg:cell-1',
    stateColor,
  );
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <li key={versionNode.kfId} className={versionItemClass}>
          <GridContainer collapsed="rows" className="p-4">
            <div className={iconClass}>
              <SvgIcon
                kind={fileTypeDetail[fileType].icon}
                width="14"
                height="14"
              />
            </div>
            {index === 0 && (
              <div className="FileVersionElement--Tag row-3 cell-2 lg:row-2 lg:cell-1">
                Latest
              </div>
            )}
            <div className="flex row-1 cell-12 lg:cell-7">
              <p
                className="FileVersionElement--button m-0 p-0 text-lg"
                onClick={e => onNameClick(versionNode, index)}
              >
                {versionNode.fileName}
              </p>
            </div>
            <div className="flex row-3 cell-9 lg:row-1 lg:cell-4 lg:justify-end align-center">
              <div className="flex align-center">
                <Avatar
                  className="inline-block mr-8"
                  size={20}
                  imgUrl={
                    versionNode.creator
                      ? versionNode.creator.picture
                      : 'https://www.w3schools.com/css/img_avatar.png'
                  }
                  userName={versionNode.creator && versionNode.creator.username}
                  userEmail={versionNode.creator && versionNode.creator.email}
                />
                <TimeAgo
                  date={versionNode.createdAt}
                  live={false}
                  className="FileVersionList--text  FileVersionList--Element-meta"
                />
              </div>
              <p className=" FileVersionList--text FileVersionList--Element-meta row-1 cell-2">
                {formatFileSize(versionNode.size, true) || 'Size Unknown'}
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
                className="FileVersionList--text row-1 cell-1"
              >
                <Icon kind="download" width={12} height={12} />
              </button>
            </div>

            <p className="FileVersionList--Element-desc FileVersionList--text row-2 cell-12 lg:cell-2-11 text-xs">
              {versionNode.description || 'No version summary available'}
            </p>
          </GridContainer>
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
  fileNode: {},
  index: null,
};

export default VersionItem;
