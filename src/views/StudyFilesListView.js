import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import FileElement from '../components/FileList/FileElement';
import {GridContainer} from 'kf-uikit';
/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (error) return `Error!: ${error}`;
      const files = !loading ? data.studyByKfId.files.edges : [];
      return (
        <GridContainer collapsed="cells" className="my-20 px-12">
          <h3 className="text-blue font-normal m-0 cell-12 row-1">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list cell-12 row-2">
            {loading ? (
              <ul className="FileList">
                <FileElement loading={loading} />
              </ul>
            ) : (
              <FileList fileList={files} studyId={props.match.params.kfId} />
            )}
          </section>
          <div className="row-3 cell-3-8">
            <UploadContainer />
          </div>
        </GridContainer>
      );
    }}
  </Query>
);

export default StudyFilesListView;
