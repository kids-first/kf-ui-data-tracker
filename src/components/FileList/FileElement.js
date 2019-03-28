import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {Icon} from 'kf-uikit';
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

const FileElement = ({
  className,
  fileNode,
  deleteFile,
  loading,
  error,
  history,
  match,
}) => {
  const fileElementClass = classes('FileList--Element', className);
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
  return (
    <li className={fileElementClass}>
      <h4 className="mt-0 font-normal" title={fileNode.description}>
        {fileNode.name}
        <Link to={`/study/${match.params.kfId}/files/${fileNode.kfId}`}>
          <Icon className="pt-4 ml-2" kind="edit" />
        </Link>
        <a
          href={fileNode.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className="pt-4" kind="download" />
        </a>
        <button onClick={e => deleteFile()}>
          <Icon className="pt-4" kind="delete" />
        </button>
      </h4>
      <span className="mt-0 font-normal text-grey ">
        <small>
          Created:
          {latestDate ? (
            <TimeAgo className="mr-4 pl-1" date={latestDate} />
          ) : (
            <span className="mr-4 pl-1">unknown</span>
          )}
          Size: {fileSize}
        </small>
      </span>
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
