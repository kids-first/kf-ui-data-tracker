//@flow
import * as React from "react";
import gql from "graphql-tag";
import { graphql, OperationComponent } from "react-apollo";
import { compose } from "recompose";

import { GET_STUDY_BY_ID, CREATE_FILE } from "../state/nodes";
import type { StudyDataType, FileMutationType } from "../state/nodes";
import { FileUploadTarget } from "../components/FileUpload";
import { renderWhileLoading, LoadingPlaceholder } from "../components/Loading";
import { GridContainer } from "../components/Grid";
import StudyHeader from "../components/StudyHeader/StudyHeader";

type UploadFileProps = {
  uploadFile: Function,
  nodeId: String,
  kfId: String
};

type StudyDataResponse = {
  data: StudyDataType
};

const UploadFile = (props: UploadFileProps, file: File): void => {
  const { uploadFile, nodeId, kfId } = props;

  uploadFile({
    variables: {
      file,
      studyId: kfId
    },
    update(
      cache,
      {
        data: {
          createFile: { file }
        }
      }
    ) {
      const id: String = nodeId;
      let data = cache.readQuery({
        query: GET_STUDY_BY_ID,
        variables: { id: String }
      });

      data.study.files.edges.push({ __typename: "FileNodeEdge", node: file });
      cache.writeQuery({
        query: GET_STUDY_BY_ID,
        variables: { id },
        data
      });
    }
  });
};

const FileUploadView = ({
  studyData: {
    study: {
      name,
      shortName,
      kfId,
      modifiedAt,
      files: { edges: fileNodes }
    }
  },
  loading,
  error,
  uploadFile,
  match: { params: nodeId }
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
                ? fileNodes.map(({ node: { id, name, downloadUrl } }) => (
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
                  files: [file]
                }
              }) =>
                validity.valid &&
                UploadFile({ kfId, nodeId: nodeId.nodeId, uploadFile }, file)
              }
              onDrop={fileList => {
                if (!fileList.length) {
                  alert("Please Upload Study Files Only");
                  return;
                }
                let file = fileList[0];

                UploadFile({ kfId, nodeId: nodeId.nodeId, uploadFile }, file);
              }}
            />
          </section>
        </GridContainer>
      </div>
    </div>
  );
};

export const withStudyData: OperationComponent<StudyDataResponse> = graphql(
  GET_STUDY_BY_ID,
  {
    options: props => ({
      variables: {
        id: props.match.params.nodeId
      }
    }),
    name: "studyData"
  }
);

export const withFileMutation: OperationComponent<FileMutationType> = graphql(
  CREATE_FILE,
  {
    name: "uploadFile"
  }
);

export default compose(
  withStudyData,
  withFileMutation,
  renderWhileLoading(LoadingPlaceholder, "studyData")
)(FileUploadView);
