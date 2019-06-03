import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import FileElement from '../components/FileList/FileElement';
import {GridContainer} from 'kf-uikit';
import FileUploadTarget from '../components/FileUpload/FileUploadTarget';
/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      // TODO: add styled error state
      if (error)
        return (
          <div>
            <h3 className="text-red text-center">Error! </h3>
            <p className="text-center">{error.message}</p>
          </div>
        );
      const files = !loading ? data.studyByKfId.files.edges : [];
      return (
        <GridContainer collapsed="cells" className="my-20 px-12">
          <h3 className="text-blue font-normal m-0 cell-12 row-1">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list cell-12 row-2">
            {loading ? (
              <ul className="FileList">
                <FileElement
                  loading={loading}
                  fileNode={{}}
                  fileListId={props.match.params.kfId}
                />
              </ul>
            ) : (
              <FileList fileList={files} studyId={props.match.params.kfId} />
            )}
          </section>
          <div className="row-3 cell-3-8">
            <UploadContainer
              studyId={props.match.params.kfId}
              refetchAfterUpload={[
                {
                  query: GET_STUDY_BY_ID,
                  variables: {kfId: props.match.params.kfId},
                },
              ]}
            >
              {({
                createFile,
                error,
                dragging,
                handleDragOver,
                handleDragEnter,
                handleDragLeave,
                uploadFile,
              }) => (
                <FileUploadTarget
                  error={error}
                  dragging={dragging}
                  handleDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  handleDrop={e => uploadFile(e.target.files[0], createFile)}
                  handleSelectedFile={e =>
                    uploadFile(e.target.files[0], createFile)
                  }
                  instructions="To upload files, drag and drop them here"
                />
              )}
            </UploadContainer>
          </div>
        </GridContainer>
      );
    }}
  </Query>
);

export default StudyFilesListView;
