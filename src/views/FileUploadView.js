import React from 'react';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';

import { GET_STUDY_BY_ID } from '../state/queries';
import { CREATE_FILE } from '../state/mutations';
import { FileUploadTarget } from '../components/FileUpload';
import { renderWhileLoading, LoadingPlaceholder } from '../components/Loading';
import { GridContainer } from '../components/Grid';
import StudyHeader from '../components/StudyHeader/StudyHeader';

const FileUploadView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{id: props.match.params.nodeId}}>
    {({loading, error, data}) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      const study = data.study;
      const files = data.study.files.edges;
      return (
        <div id="study" className="bg-lightGrey">
          <StudyHeader {...study} />
          <div className="study-content bg-white">
            <GridContainer>
              <h3 className="col-12">
                Upload Study Files & Manifests for DRC Approval
              </h3>
              <section className="study-file-list col-12">
                <ul className="w-full list-reset">
                  {files.length
                    ? files.map(({node: {id, name, downloadUrl}}) => (
                        <li key={id}>
                          <a href={downloadUrl} target="_blank">
                            {name}
                          </a>
                        </li>
                      ))
                    : null}
                </ul>

                <Mutation
                  mutation={CREATE_FILE}
                  refetchQueries={res => [
                    {
                      query: GET_STUDY_BY_ID,
                      variables: {id: props.match.params.nodeId},
                    },
                  ]}
                >
                  {(createFile, {data}) => (
                    <FileUploadTarget
                      className="my-4"
                      instructions="To upload files, drag and drop them here"
                      handleSelectedFile={({
                        target: {
                          validity,
                          files: [file],
                        },
                      }) =>
                        validity.valid &&
                        createFile({variables: {file, studyId: study.kfId}})
                      }
                      onDrop={fileList => {
                        if (!fileList.length) {
                          alert('Please Upload Study Files Only');
                          return;
                        }
                        let file = fileList[0];
                      }}
                    />
                  )}
                </Mutation>
              </section>
            </GridContainer>
          </div>
        </div>
      );
    }}
  </Query>
);

export default FileUploadView;
