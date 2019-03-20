import React from 'react';
import {Query} from 'react-apollo';
import {Link} from 'react-router-dom';
import {ALL_STUDIES} from '../state/queries';
import StudyCard from '../components/StudyCard';
import {renderWhileLoading, LoadingPlaceholder} from '../components/Loading';

const StudyListView = () => (
  <Query query={ALL_STUDIES}>
    {({loading, error, data}) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;
      return (
        <ul className="study-list grid-container list-reset">
          {data.allStudies.edges.map(node => (
            <li className="col-3 study-list--item" key={node.node.id}>
              <Link to={`/study/${node.node.id}/files`}>
                <StudyCard title={node.node.name}>{node.node.id}</StudyCard>
              </Link>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default StudyListView;
