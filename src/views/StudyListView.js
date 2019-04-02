import React from 'react';
import {Query} from 'react-apollo';
import {ALL_STUDIES} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {LoadingPlaceholder} from '../components/Loading';

const StudyListView = () => (
  <Query query={ALL_STUDIES}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder componentName="Study List" />;
      if (error) return `Error! ${error.message}`;
      if (data.allStudies.edges.length === 0)
        return (
          <div className="text-center text-mediumGrey px-8 pt-32">
            <h1>You don't have access to any studies yet.</h1>
            <h3>Your account is being reviewed for the proper permissions.</h3>
          </div>
        );
      return (
        <StudyList studyList={data.allStudies.edges} className="BodyContent" />
      );
    }}
  </Query>
);

export default StudyListView;
