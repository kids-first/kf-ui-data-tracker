import React from 'react';
import {Query} from 'react-apollo';

import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import {GridContainer} from '../components/Grid';
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
        <GridContainer>
          <h3 className="col-12 text-blue font-normal">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list col-12">
            <FileList fileList={files} />
            <UploadContainer />
          </section>
        </GridContainer>
      );
    }}
  </Query>
);

export default StudyFilesListView;
