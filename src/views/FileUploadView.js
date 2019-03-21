import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { GET_STUDY_BY_ID } from '../state/queries';
import { CREATE_FILE } from '../state/mutations';
import { FileUploadTarget } from '../components/FileUpload';
import { renderWhileLoading, LoadingPlaceholder } from '../components/Loading';
import { GridContainer } from '../components/Grid';
import StudyHeader from '../components/StudyHeader/StudyHeader';

const UploadFile = (props, file) => {
  const {uploadFile, nodeId, kfId} = props;

  uploadFile({
    variables: {
      file,
      studyId: kfId,
    },
    update(
      cache,
      {
        data: {
          createFile: {file},
        },
      },
    ) {
      const id = nodeId;
      let data = cache.readQuery({
        query: GET_STUDY_BY_ID,
        variables: {id},
      });

      data.study.files.edges.push({__typename: 'FileNodeEdge', node: file});
      cache.writeQuery({
        query: GET_STUDY_BY_ID,
        variables: {id},
        data,
      });
    },
  });
};

const FileUploadView = ({
  studyData: {
    study: {
      name,
      shortName,
      kfId,
      modifiedAt,
      files: {edges: fileNodes},
    },
  },
  loading,
  error,
  uploadFile,
  match: {params: nodeId},
}) => {
  return (
    <div id="study" className="bg-lightGrey">
      <StudyHeader {...{ kfId, modifiedAt, shortName }} />
      <div className="study-content bg-white">
        <GridContainer>
          <h3 className="col-12">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list col-12">
            <ul className="w-full list-reset">
              {fileNodes.length
                ? fileNodes.map(({node: {id, name, downloadUrl}}) => (
                    <li key={id}>
                      <a href={downloadUrl} target="_blank">
                        {name}
                      </a>
                    </li>
                  ))
                : null}
            </ul>

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
                UploadFile({kfId, nodeId: nodeId.nodeId, uploadFile}, file)
              }
              onDrop={fileList => {
                if (!fileList.length) {
                  alert('Please Upload Study Files Only');
                  return;
                }
                let file = fileList[0];

                UploadFile({kfId, nodeId: nodeId.nodeId, uploadFile}, file);
              }}
            />
          </section>
        </GridContainer>
      </div>
    </div>
  );
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    options: props => ({
      variables: {
        id: props.match.params.nodeId,
      },
    }),
    name: 'studyData',
  }),
  graphql(CREATE_FILE, {
    name: 'uploadFile',
  }),
  renderWhileLoading(LoadingPlaceholder, 'studyData'),
)(FileUploadView);
