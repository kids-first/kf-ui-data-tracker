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
    {'cursor-not-allowed': loading, 'bg-lightGrey': loading},
    className,
  );
  const sortedVersions =
    fileNode.versions.edges.length > 0
      ? fileNode.versions.edges.sort(dateCompare)
      : [];
  const fileSize =
    sortedVersions.length > 0
      ? formatFileSize(sortedVersions[0].node.size, true)
      : 'unknown';
  const latestDate =
    sortedVersions.length > 0 ? sortedVersions[0].node.createdAt : null;
  const fileType = fileTypeDefault[fileNode.fileType]
    ? fileTypeDefault[fileNode.fileType]
    : 'unknown';

  return (
    <li className={fileElementClass}>
      {loading && (
        <Icon kind="reset" width={24} className="float-right mt-5 mr-5 spin" />
      )}
      <div className="FileList--ElementBadge sm:w-48">
        <Badge state="new" className="sm:min-w-full" />
        <Badge state="pendingApproval" className="sm:min-w-full" />
      </div>
      <div className="flex-initial">
        <h4 className="mt-0 pt-2 font-normal" title={fileNode.description}>
          {fileNode.name}
          <span
            className="pl-6 font-light text-grey pr-2"
            title={`Study ID: ${match.params.kfId}`}
          >
            {fileNode.kfId}
          </span>
          <CopyButton text={fileNode.kfId} />
          <Link to={`/study/${match.params.kfId}/files/${fileNode.kfId}`}>
            <Icon className="pt-4 ml-2" kind="edit" />
          </Link>
          <button onClick={e => downloadFile(e)}>
            <Icon className="pt-4" kind="download" />
          </button>
          <button onClick={e => deleteFile()}>
            <Icon className="pt-4" kind="delete" />
          </button>
          {error &&
            error.graphQLErrors &&
            error.graphQLErrors.map(err => (
              <span className="text-red">{err.message}</span>
            ))}
        </h4>
        <span className="mt-0 font-normal text-grey text-xs">
          Created:
          {latestDate ? (
            <TimeAgo className="mr-4 pl-1" date={latestDate} live={false} />
          ) : (
            <span className="mr-4 pl-1">unknown</span>
          )}
          Size: {fileSize}
          <span className="ml-4">{fileType}</span>
        </span>
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
