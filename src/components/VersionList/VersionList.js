import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {dateCompare} from '../../common/fileUtils';
import VersionItem from './VersionItem';
import SvgIcon from '../Icon/Icon';
/**
 * Displays ordered versions of one file. (Latest first)
 */
const VersionList = ({className, studyId, fileNode, onUploadClick}) => {
  let versionListClass = classes('FileVersionList', className);

  return (
    <div className="FileVersionContainer lg:cell-10 md:cell-9 cell-12">
      <div className="p-8 flex justify-between">
        <p className="FileInfo--Title">
          Document Versions
          <span className="font-light ml-4">
            ({fileNode.versions.edges.length})
          </span>
        </p>
        <button className="FileVersionList--Button" onClick={onUploadClick}>
          <SvgIcon kind="Upload" height="15" width="15" className="mr-4" />
          UPLOAD VERSION
        </button>
      </div>
      <ul className={versionListClass}>
        {fileNode.versions.edges.length ? (
          fileNode.versions.edges
            .sort(dateCompare)
            .map(({node}, index) => (
              <VersionItem
                key={index}
                studyId={studyId}
                fileId={fileNode.kfId}
                fileType={fileNode.fileType}
                versionNode={node}
                index={index}
              />
            ))
        ) : (
          <h3>You don't have any versions of this file yet.</h3>
        )}
      </ul>
    </div>
  );
};

VersionList.propTypes = {
  /** Any additional classes to be applied to the version list*/
  className: PropTypes.string,
  /** Study kfId*/
  studyId: PropTypes.string,
  /** File object*/
  fileNode: PropTypes.object.isRequired,
  /** Action when click on the upload button*/
  onUploadClick: PropTypes.func,
};

VersionList.defaultProps = {
  className: null,
  studyId: null,
  fileNode: {},
};

export default VersionList;
