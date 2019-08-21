import React from 'react';
import {graphql} from 'react-apollo';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react';
import {CavaticaProjectList} from '../components/CavaticaProjectList';

import {GET_PROJECTS} from '../state/queries';

const CavaticaProjectsView = ({projects: {allProjects, loading, error}}) => {
  return (
    <Container as={Segment} basic>
      <Header as="h3">
        <Button primary floated="right">
          Scan Cavatica
        </Button>
        Cavatica Projects
      </Header>
      <Segment basic>
        Listed are the Cavatica projects for analysis and investigator delivery
        and the studies they are related to. Projects created manually in
        Cavatica need to be scanned by the api to make them available for
        linking to studies. This may be done using the <i>Scan Cavatica</i>{' '}
        button.
      </Segment>
      <Segment basic>
        {loading && (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading projects...</Loader>
            </Dimmer>
          </Segment>
        )}
        {!loading && allProjects && (
          <CavaticaProjectList projects={allProjects.edges} />
        )}
      </Segment>
    </Container>
  );
};

export default graphql(GET_PROJECTS, {name: 'projects'})(CavaticaProjectsView);
