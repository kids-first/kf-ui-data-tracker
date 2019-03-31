import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Mutation} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {DELETE_FILE, FILE_DOWNLOAD_URL} from '../../state/mutations';
import FileElement from './FileElement';
import FileElementEmpty from './FileElementEmpty';
import {KF_STUDY_API} from '../../common/globals';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const FileList = ({className, fileList, studyId}) => {
  let fileListClass = classes('FileList', className);

  return (
    <ul className={fileListClass}>
      {fileList.length ? (
        fileList.map(({node}) => (
          <Mutation mutation={FILE_DOWNLOAD_URL} key={node.kfId}>
            {downloadFile => (
              <Mutation
                mutation={DELETE_FILE}
                refetchQueries={res => [
                  {
                    query: GET_STUDY_BY_ID,
                    variables: {kfId: studyId},
                  },
                ]}
                key={node.kfId}
              >
                {(deleteFile, {loading, error}) => (
                  <FileElement
                    key={node.kfId}
                    fileNode={node}
                    loading={loading}
                    error={error}
                    deleteFile={() =>
                      deleteFile({variables: {kfId: node.kfId}})
                    }
                    downloadFile={e => {
                      downloadFile({
                        variables: {studyId, fileId: node.kfId},
                      }).then(resp => {
                        const url = `${KF_STUDY_API}${resp.data.signedUrl.url}`;
                        window.location.href = url;
                      });
                    }}
                  />
                )}
              </Mutation>
            )}
          </Mutation>
        ))
      ) : (
        <FileElementEmpty />
      )}
    </ul>
  );
};

FileList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  fileList: PropTypes.array,
};

FileList.defaultProps = {
  className: null,
  fileList: [],
};

export default FileList;
