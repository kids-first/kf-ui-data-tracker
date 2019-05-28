import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {dateCompare} from '../../common/fileUtils';
import VersionItem from './VersionItem';
import {CREATE_FILE} from '../../state/mutations';
import {GET_FILE_BY_ID} from '../../state/queries';
import {Query, Mutation} from 'react-apollo';
import SvgIcon from '../Icon/Icon';
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
                    <SvgIcon
                      kind="Upload"
                      width="14"
                      height="14"
                      className="mr-4"
                    />
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
