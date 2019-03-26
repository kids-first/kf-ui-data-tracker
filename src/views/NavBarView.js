import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import NavBar from '../components/NavBar/NavBar';

const NavBarView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder />;
      if (error) return `Error!: ${error}`;
      const study = data.studyByKfId;
      return (
        <div id="study" className="bg-lightGrey">
          <StudyHeader {...study} />
          <div className="study-content bg-white">
            <NavBar />
          </div>
        </div>
      );
    }}
  </Query>
);

export default NavBarView;
