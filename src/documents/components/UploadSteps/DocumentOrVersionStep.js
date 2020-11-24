import React from 'react';
import {Button, Grid, Header, Icon, Image} from 'semantic-ui-react';
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
      <Header icon>
        <Icon circular inverted color="blue" name="file outline" />
        <Header.Content>This is a new document</Header.Content>
        <Button
          content="Document"
          onClick={() => {
            setFieldValue('document');
            nextStep();
          }}
        />
      </Header>
    </Grid.Column>
    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
      <Header icon>
        <Icon circular inverted color="blue" name="copy outline" />
        This is a version of an existing document
        <Button
          content="Version"
          onClick={() => {
            setFieldValue('version');
            nextStep();
          }}
        />
      </Header>
    </Grid.Column>
  </>
);

export default DocumentOrVersionStep;
