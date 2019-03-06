import React from 'react';
import gql from 'graphql-tag';
import { graphql, Mutation } from 'react-apollo';
import { compose } from 'recompose';
import TimeAgo from 'react-timeago';
import { GET_STUDY_BY_ID } from '../state/nodes';
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
            <Mutation
              mutation={gql`
                mutation($file: Upload!, $studyId: String!) {
                  createFile(file: $file, studyId: $studyId) {
                    success
                    file {
                      id
                      name
                    }
                  }
                }
              `}
            >
              {mutate => (
                <input
                  type="file"
                  required
                  onChange={({
                    target: {
                      validity,
                      files: [file],
                    },
                  }) => {
                    validity.valid && mutate({ variables: { file, studyId: kfId } });
                  }}
                />
              )}
            </Mutation>
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
      fetchPolicy: 'network-only',
    }),
    name: 'studyData',
  }),
  renderWhileLoading(LoadingPlaceholder, 'studyData'),
)(FileUploadView);
