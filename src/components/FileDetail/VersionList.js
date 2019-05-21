import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {dateCompare} from '../../common/fileUtils';
import VersionItem from './VersionItem';

import {CREATE_FILE} from '../../state/mutations';
import {GET_FILE_BY_ID} from '../../state/queries';
import {Query, Mutation} from 'react-apollo';
/**
 * Displays ordered versions of one file. (Latest first)
 */
const VersionList = ({className, studyId, fileNode, onUploadClick}) => {
  let versionListClass = classes('FileVersionList', className);

  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId: fileNode.kfId}}>
      {({loading, error, data}) => {
        if (error) return `Error!: ${error}`;
        return (
          <Mutation
            mutation={CREATE_FILE}
            refetchQueries={res => [
              {
                query: GET_FILE_BY_ID,
                variables: {kfId: fileNode.kfId},
              },
            ]}
          >
            {(createFile, {data, error}) => (
              <div className="lg:cell-10 md:cell-9 cell-12">
                <div className="bg-lightGrey p-8 flex justify-between">
                  <p className="FileInfo--Title">
                    Versions
                    <span className="font-light ml-4">
                      ({fileNode.versions.edges.length})
                    </span>
                  </p>

                  <label className="FileVersionList--Button">
                    <svg
                      className="mr-4"
                      height="14"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                    >
                      <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z" />
                    </svg>
                    UPLOAD VERSION
                    <input
                      className="hidden"
                      type="file"
                      onChange={e => {
                        e.preventDefault();
                        createFile({
                          variables: {
                            file: e.target.files[0],
                            studyId,
                            fileId: fileNode.kfId,
                          },
                        })
                          .then(resp => {})
                          .catch(err => {
                            console.log(err);
                            alert('Failed to upload file.');
                          });
                      }}
                    />
                  </label>
                </div>
                <ul className={versionListClass}>
                  {fileNode.versions.edges.length ? (
                    fileNode.versions.edges
                      .sort(dateCompare)
                      .map(({node}, index) => (
                        <VersionItem
                          key={node.kfId}
                          studyId={studyId}
                          fileId={fileNode.kfId}
                          fileType={fileNode.fileType}
                          fileName={fileNode.name}
                          versionNode={node}
                          index={index}
                        />
                      ))
                  ) : (
                    <h3>You don't have any versions of this file yet.</h3>
                  )}
                </ul>
              </div>
            )}
          </Mutation>
        );
      }}
    </Query>
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
