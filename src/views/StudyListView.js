import React from 'react';
import {Query} from 'react-apollo';
import {ALL_STUDIES} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {LoadingPlaceholder} from '../components/Loading';

const StudyListView = () => (
  <Query query={ALL_STUDIES}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder />;
      if (error) return `Error! ${error.message}`;
      return <StudyList studyList={data.allStudies.edges} />;
    }}
  </Query>
);

export default StudyListView;
