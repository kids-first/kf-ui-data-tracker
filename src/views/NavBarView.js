import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import NavBar from '../components/NavBar/NavBar';
import {GridContainer} from 'kf-uikit';

const NavBarView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder componentName="Study Page" />;
      if (error) return `Error!: ${error}`;
      const study = data.studyByKfId;
      return (
        <section id="study">
          <div className="bg-lightGrey">
            <StudyHeader {...study} />
          </div>
          <div className="border-b-2 .border-mediumGrey">
            <GridContainer className="px-12">
              <NavBar />
            </GridContainer>
          </div>
        </section>
      );
    }}
  </Query>
);

export default NavBarView;
