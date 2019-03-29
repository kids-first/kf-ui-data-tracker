import React from 'react';
import {Query} from 'react-apollo';

import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';

/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder componentName="File List" />;
      if (error) return `Error!: ${error}`;

      const files = data.studyByKfId.files.edges;

      return (
        <div className="mx-12 pb-16">
          <h3 className="text-blue font-normal">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list">
            <FileList fileList={files} studyId={props.match.params.kfId} />
            <UploadContainer />
          </section>
        </div>
      );
    }}
  </Query>
);

export default StudyFilesListView;
