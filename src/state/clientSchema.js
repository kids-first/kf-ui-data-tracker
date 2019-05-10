import gql from 'graphql-tag';

export const clientTypeDefs = gql`
  extend type FileNode {
    status: String
  }

  extend type Mutation {
    updateFileStatus(id: ID!, status: String): FileNode
  }
`;

export const resolvers = {
  FileNode: {
    status: async (file, _args, {cache, getCacheKey}, info) => {
      const id = getCacheKey({__typename: file.__typename, id: file.id});
      const fragment = gql`
        fragment fileStatus on FileNode {
          status
        }
      `;
      const cachedFile = await cache.readFragment({fragment, id});
      const status =
        cachedFile && cachedFile.status != null ? cachedFile.status : 'staged';
      return status;
    },
  },
  Mutation: {
    updateFileStatus: async (_, {id, status}, {cache, getCacheKey}) => {
      const cacheId = getCacheKey({__typename: 'FileNode', id: id});
      const fragment = gql`
        fragment fileStatus on FileNode {
          status
        }
      `;
      const cachedFile = await cache.readFragment({fragment, id: cacheId});
      const updatedFileNode = {...cachedFile, status};
      await cache.writeData({id: cacheId, data: updatedFileNode});
      return updatedFileNode;
    },
  },
};
