import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';

export const clientTypeDefs = gql`
  extend type UserNode {
    roles: [String]
    groups: [String]
  }
`;

export const resolvers = {
  UserNode: {
    roles: () => {
      const token =
        localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);

      return decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;
    },
    groups: () => {
      const token =
        localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const groups =
        decoded['https://kidsfirstdrc.org/groups'] || decoded.context.groups;

      return groups;
    },
  },
};
