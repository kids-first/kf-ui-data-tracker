import gql from 'graphql-tag';

export const clientTypeDefs = gql`
  extend type FileNode {
    status: String
  }
`;

export const resolvers = {
  FileNode: {
    status: () => null,
  },
};
