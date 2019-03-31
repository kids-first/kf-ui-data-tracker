import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {Icon} from 'kf-uikit';
import Badge from '../Badge/Badge';
import CopyButton from '../CopyButton/CopyButton';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const dateCompare = (version1, version2) => {
  return version1.node.createdAt < version2.node.createdAt;
};

const formatFileSize = (bytes, si) => {
  var thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};

const fileTypeDefault = {
  SHM: 'Shipping Manifest',
  CLN: 'Clinical/Phenotype Data',
  SEQ: 'Sequencing Manifest',
  OTH: 'Other',
};

const FileElement = ({
  className,
  fileNode,
  deleteFile,
  downloadFile,
  loading,
  error,
  history,
  match,
}) => {
  const fileElementClass = classes(
    'FileList--Element',
    'sm:flex-no-wrap',
    {'cursor-not-allowed': loading},
    className,
  );
  const fileStatusClass = classes(
    {
      'FileStatus--loading': loading,
      FileStatus: !loading,
    },
    'text-grey',
  );
  const fileNameClass = classes(
    {
      'FileStatus--loading': loading,
      FileStatus: !loading,
      'text-sm': !loading,
    },
    'font-bold',
  );
  const buttonClass = classes({invisible: loading});
  const fileKfID = fileNode ? fileNode.kfId : 'unknown ID';
  const fileName = fileNode ? fileNode.name : 'unknown file name';
  const fileDescription = fileNode ? fileNode.description : 'unknown';
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
    <li className={fileElementClass}>
      <div className="FileList--ElementBadge sm:w-48">
        <Badge state="new" loading={loading} className="sm:min-w-full" />
        <Badge
          state="pendingApproval"
          loading={loading}
          className="sm:min-w-full"
        />
      </div>
      <div className="flex-initial">
        <p className="mt-2">
          <span className={fileNameClass} title={fileDescription}>
            {fileName}
          </span>
          <span
            className={fileStatusClass}
            title={`Study ID: ${match.params.kfId}`}
          >
            {fileKfID} <CopyButton text={fileKfID} className={buttonClass} />
          </span>
          <span className={fileStatusClass}>
            <Link
              to={`/study/${match.params.kfId}/files/${fileKfID}`}
              className={buttonClass}
            >
              <Icon className="mr-4" width={10} height={10} kind="edit" />
            </Link>
            <button onClick={e => downloadFile(e)} className={buttonClass}>
              <Icon className="mr-4" width={10} height={10} kind="download" />
            </button>
            <button onClick={e => deleteFile()} className={buttonClass}>
              <Icon className="mr-4" width={10} height={10} kind="delete" />
            </button>
          </span>
          {error &&
            error.graphQLErrors &&
            error.graphQLErrors.map(err => (
              <span className="text-red">{err.message}</span>
            ))}
        </p>
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
    </li>
  );
};

FileList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  fileNode: PropTypes.object,
  /** Loading state of the file*/
  loading: PropTypes.bool,
  /** Errors from graphQL */
  errors: PropTypes.object,
  /** Action to delete a file */
  deleteFile: PropTypes.func,
  /** Action to download a file */
  downloadFile: PropTypes.func,
};

FileList.defaultProps = {
  className: null,
  fileNode: null,
};

export default withRouter(FileElement);
