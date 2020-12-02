import React from 'react';
import {Card, Grid, Header, Icon, Image} from 'semantic-ui-react';
import documentChoice from '../../../assets/document_choice.svg';

const DocumentOrVersionStep = ({setFieldValue, nextStep}) => (
  <>
    <Grid.Column width={4}>
      <Image src={documentChoice} size="medium" centered rounded />
      <Header>Update or Create a Document</Header>
      <p>
        Select whether to use this file to create a new document or add it as a
        new version to an existing document.
      </p>
    </Grid.Column>
    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
      <Card
        fluid
        link
        color="blue"
        onClick={() => {
          setFieldValue('document');
          nextStep();
        }}
      >
        <Card.Content>
          <Icon
            circular
            inverted
            size="huge"
            color="blue"
            name="file outline"
          />
          <Card.Header className="pt-10">Document</Card.Header>
          <Card.Description>
            Choose this if the file is an entirely new document
          </Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
      <Card
        fluid
        link
        color="blue"
        onClick={() => {
          setFieldValue('version');
          nextStep();
        }}
      >
        <Card.Content>
          <Icon
            circular
            inverted
            size="huge"
            color="blue"
            name="copy outline"
          />
          <Card.Header className="pt-10">Version</Card.Header>
          <Card.Description>
            Pick this if the file is a revision of an existing document
          </Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
    <Grid.Row>
      <Grid.Column textAlign="right" width={16}>
        <em>Choose document or version to continue</em>
      </Grid.Column>
    </Grid.Row>
  </>
);

export default DocumentOrVersionStep;
