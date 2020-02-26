import React from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {Segment, Grid, Header, Icon, Card} from 'semantic-ui-react';

const NewStudySelectionView = () => (
  <>
    <Helmet>
      <title>KF Data Tracker - New study selection</title>
    </Helmet>
    <Grid as={Segment} basic container stackable>
      <Grid.Column width={16} textAlign="left">
        <Header as="h1">Choose a study type</Header>
      </Grid.Column>
      <Grid.Row>
        <Grid.Column width={8} textAlign="center">
          <Card
            data-testid="delivery-card"
            fluid
            as={Link}
            to={`/study/new-study/info`}
            header={
              <Header icon>
                <Icon name="dna" />
                Delivery Study
              </Header>
            }
            description="Create a study to deliver data to investigators and end users on the Kids First Portal"
          />
        </Grid.Column>
        <Grid.Column width={8} textAlign="center">
          <Card
            data-testid="research-card"
            fluid
            as={Link}
            to={`/study/new-research-study`}
            header={
              <Header icon>
                <Icon name="flask" />
                Research Study
              </Header>
            }
            description="Create a study to contain projects to analyze other studies in Kids First"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>
);

export default NewStudySelectionView;
