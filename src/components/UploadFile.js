import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const UPLOAD_FILE_QUERY = gql`
  mutation($file: Upload!, $studyId: String!) {
    createFile(file: $file, studyId: $studyId) {
      success
      file {
        name
      }
    }
  }
`;

const UploadFile = ({ mutate, uploadsQuery }) => {
  const handleChange = ({
    target: {
      validity,
      files: [file],
    },
  }) =>
    validity.valid &&
    mutate({
      variables: { file },
      update(
        proxy,
        {
          data: { singleUpload },
        },
      ) {
        const data = proxy.readQuery({ query: uploadsQuery });
        data.uploads.push(singleUpload);
        proxy.writeQuery({ query: uploadsQuery, data });
      },
    });

  return <input type="file" required onChange={handleChange} />;
};

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      mimetype
      path
    }
  }
`)(UploadFile);
