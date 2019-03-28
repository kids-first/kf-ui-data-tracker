import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Mutation} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {DELETE_FILE} from '../../state/mutations';
import FileElement from './FileElement';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const FileList = ({className, fileList, studyId}) => {
  let fileListClass = classes('FileList', className);

  return (
    <ul className={fileListClass}>
      {fileList.length ? (
        fileList.map(({node}) => (
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
                deleteFile={() => deleteFile({variables: {kfId: node.kfId}})}
              />
            )}
          </Mutation>
        ))
      ) : (
        <h3 className="FileList--Empty">You don't have any files yet.</h3>
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
