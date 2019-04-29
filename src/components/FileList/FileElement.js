import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter, Link} from 'react-router-dom';
import CopyButton from '../CopyButton/CopyButton';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {GridContainer} from 'kf-uikit';
import FileActionsContainer from '../../containers/FileActionsContainer';
import {dateCompare, formatFileSize} from '../../common/fileUtils';
/**
 * Displays unordered study files in list view
 */

const fileTypeDefault = {
  SHM: 'Shipping Manifest',
  CLN: 'Clinical/Phenotype Data',
  SEQ: 'Sequencing Manifest',
  OTH: 'Other',
};

const FileElement = ({className, fileNode, loading, match, fileListId}) => {
  const fileElementClass = classes(
    'FileList--Element',
    {'cursor-not-allowed': loading},
    'group',
    className,
  );
  const fileStatusClass = classes(
    {
      'FileStatus--loading': loading,
      FileStatus: !loading,
    },
    'w-full',
    'inline-block',
    'sm:inline',
    'text-grey',
  );
  const fileNameClass = classes(
    {
      'FileStatus--loading': loading,
      'FileList--Element-name': !loading,
      'text-sm': !loading,
    },
    'font-bold',
    'mb-0',
    'mt-4',
    'group-hover:text-blue',
  );
  const buttonClass = classes({invisible: loading});
  const fileKfID = fileNode ? fileNode.kfId : 'unknown ID';
  const fileName = fileNode ? fileNode.name : 'unknown file name';
  const fileDescription = fileNode ? fileNode.description : null;
  // TODO: move these to fileUtils??
  const sortedVersions =
    fileNode && fileNode.versions.edges.length > 0
      ? fileNode.versions.edges.sort(dateCompare)
      : [];
  const fileSize =
    sortedVersions.length > 0
      ? formatFileSize(sortedVersions[0].node.size, true)
      : 'unknown';
  const latestDate =
    sortedVersions.length > 0 ? sortedVersions[0].node.createdAt : null;
  const fileType =
    fileNode && fileTypeDefault[fileNode.fileType]
      ? fileTypeDefault[fileNode.fileType]
      : 'unknown';
  return (
    <li className={fileElementClass} tabindex="0">
      <GridContainer
        fullWidth
        collapsed="rows"
        className="ml-0 mr-0 px-16 sm:p-0"
      >
        <div className=" cell-12 row-1 sm:row-1 sm:cell-2  sm:h-full sm:text-center  sm:border-r border-grey-lightest">
          <Badge className="ml-0" state="pendingApproval" loading={loading} />
        </div>

        <div className="row-2 sm:row-1 cell-12 sm:cell-9   h-full">
          <Link
            to={`/study/${match.params.kfId}/files/${fileKfID}`}
            className="w-full no-underline text-black inline-block"
          >
            <p className={fileNameClass}>{fileName}</p>
            {fileDescription ? (
              <p className="FileList--Element-desc w-3/4 h-8 m-0 p-0 text-truncate text-black">
                <small>{fileDescription}</small>
              </p>
            ) : null}
          </Link>
          <span
            className={fileStatusClass}
            title={`Study ID: ${match.params.kfId}`}
          >
            {fileKfID} <CopyButton text={fileKfID} className={buttonClass} />
          </span>
          <span className={fileStatusClass}>
            Created:{' '}
            {latestDate ? (
              <TimeAgo date={latestDate} live={false} />
            ) : (
              <span>unknown</span>
            )}
          </span>
          <span className={fileStatusClass}>Size: {fileSize}</span>
          <span className={fileStatusClass}>{fileType}</span>
        </div>
        <FileActionsContainer
          className="opacity-25 hidden sm:block"
          node={fileNode}
          studyId={fileListId}
        />
      </GridContainer>
    </li>
  );
};

FileList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  fileNode: PropTypes.object,
};

FileList.defaultProps = {
  className: null,
  fileNode: null,
};

export default withRouter(FileElement);
