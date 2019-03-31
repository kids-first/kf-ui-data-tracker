import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import FileElement from '../components/FileList/FileElement';
/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (error) return `Error!: ${error}`;
      const files = !loading ? data.studyByKfId.files.edges : [];
      return (
        <div className="sm:px-20 p-2 BodyContent">
          <h3 className="text-blue font-normal">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list">
            {loading ? (
              <ul className="FileList">
                <FileElement loading={loading} />
              </ul>
            ) : (
              <FileList fileList={files} studyId={props.match.params.kfId} />
            )}
            <UploadContainer />
          </section>
        </div>
      );
    }}
  </Query>
);

export default StudyFilesListView;
