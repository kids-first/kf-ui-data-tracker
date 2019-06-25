import React from 'react';
import {Query} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import NavBar from '../components/NavBar/NavBar';
import {Segment} from 'semantic-ui-react';

const NavBarView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (error) return `Error!: ${error}`;
      const study = data.studyByKfId;
      return (
        <section id="study">
          <Segment secondary basic>
            <StudyHeader {...study} loading={loading} />
          </Segment>
          <NavBar />
        </section>
      );
    }}
  </Query>
);

export default NavBarView;
