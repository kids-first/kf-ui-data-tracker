import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

// Example query to get studies
const STUDY_QUERY = gql`
  {
    allStudies {
      edges {
        node {
          id
          kfId
          name
        }
      }
    }
  }
`;

const InvestigatorListView = () => (
  <Query query={STUDY_QUERY}>
    {({client, loading, data}) => {
      if (loading) {
        return <p>Loading...</p>;
      }
      return (
        <ul>
          {data.allStudies.edges.map(node => (
            <li key={node.node.id}>
              {node.node.kfId}: {node.node.name}
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default InvestigatorListView;
