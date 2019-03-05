import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Card} from 'kf-uikit';
import classes from 'classnames';

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

const CardClass = classes('study-card');

const InvestigatorsView = () => (
  <Query query={STUDY_QUERY}>
    {({client, loading, data}) => {
      if (loading) {
        return <p>Loading...</p>;
      }
      return (
        <ul className="grid-container  list-reset study-list">
          {data.allStudies.edges.map(node => (
            <li className=" col-3 study-list--item" key={node.node.id}>
              <Card className={CardClass} title={node.node.name}>
                {node.node.kfId}
              </Card>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default InvestigatorsView;
