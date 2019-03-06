import React from 'react';
import gql from 'graphql-tag';
import { graphql, Mutation } from 'react-apollo';
import { compose } from 'recompose';
import TimeAgo from 'react-timeago';
import { GET_STUDY_BY_ID, CREATE_FILE } from '../state/nodes';
import { renderWhileLoading, LoadingPlaceholder } from '../components/Loading';
import { GridContainer } from '../components/Grid';

const FileUploadView = ({
  studyData: {
    study: {
      name,
      shortName,
      kfId,
      modifiedAt,
      files: { edges: fileNodes },
    },
  },
  loading,
  error,
  uploadFile,
  match: { params: nodeId },
}) => {
  return (
    <div id="study" className="bg-lightGrey">
      <header className="study-header py-4 bg-lightGrey">
        <GridContainer>
          <div className="row-1 col-3">
            <div className="study-id-tag w-full">{kfId}</div>
            <span className="study-modified-date w-full mt-0">
              <small>
                last updated: <TimeAgo date={modifiedAt} />
              </small>
            </span>
          </div>
          <h2 className="mt-1 row-2 col-12">{shortName || name}</h2>
          <div className="study-contacts row-1 self-start">
            <h4 className="mt-0 font-bold">Contacts:</h4>
          </div>
        </GridContainer>
      </header>
      <div className="study-content bg-white">
        <GridContainer>
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

            <input
              type="file"
              required
              onChange={({
                target: {
                  validity,
                  files: [file],
                },
              }) => {
                validity.valid &&
                  uploadFile({
                    variables: {
                      file,
                      studyId: kfId,
                    },
                    update(
                      cache,
                      {
                        data: {
                          createFile: { file },
                        },
                      },
                    ) {
                      const id = nodeId.nodeId;
                      let data = cache.readQuery({
                        query: GET_STUDY_BY_ID,
                        variables: { id },
                      });
                      data.study.files.edges.push({ __typename: 'FileNodeEdge', node: file });
                      cache.writeQuery({
                        query: GET_STUDY_BY_ID,
                        variables: { id },
                        data,
                      });
                    },
                  });
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
