import React from 'react';
import {
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
  Header,
  Image,
  Message,
} from 'semantic-ui-react';
import {Field} from 'formik';
import documentSelection from '../../../assets/selection.svg';
import {TypeCard, TypeCardPlaceholder, TemplateCard} from './TypeCard';

const ChooseTypeStep = ({
  generalTypes,
  expeditedTypes,
  nextStep,
  previousStep,
}) => (
  <>
    <Grid.Row>
      <Grid.Column width={4}>
        <Image src={documentSelection} size="medium" centered rounded />
        <Header>Choose File Type</Header>
        <p>Help the DRC by indicating what type of file this is.</p>
        <Header size="small">Expedited Types</Header>
        <p>
          Expedited types follow a defined file structure and can help the DRC
          process the file faster
        </p>
        <Header size="small">General Types</Header>
        <p>
          General types provide a classification for the DRC to help organize
          and find files
        </p>
      </Grid.Column>
      <Grid.Column width={12}>
        <Form.Field required>
          <Header size="small">
            <Icon name="shipping fast" />
            Expedited Types
          </Header>
          <Dimmer.Dimmable>
            {expeditedTypes.length ? (
              <Card.Group itemsPerRow={3}>
                {expeditedTypes.map(item => (
                  <Field
                    expedited
                    component={TypeCard}
                    name="file_type"
                    id={item}
                    label={item}
                    key={item}
                  />
                ))}
              </Card.Group>
            ) : (
              <Card.Group itemsPerRow={3}>
                <TypeCardPlaceholder />
                <TypeCardPlaceholder />
                <TypeCardPlaceholder />
              </Card.Group>
            )}
            <Dimmer active={!expeditedTypes.length} inverted>
              <Header size="small">No expedited types available</Header>
              <p>
                If you'd like to have this file processed faster, please
                consider formatting the file according to one of the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={urls.expeditedFiles}
                >
                  file types
                </a>
                .
              </p>
            </Dimmer>
          </Dimmer.Dimmable>
          <Header size="small">General Types</Header>
          <Card.Group itemsPerRow={3}>
            {generalTypes.map(item => (
              <Field
                component={TypeCard}
                name="file_type"
                id={item}
                label={item}
                key={item}
              />
            ))}
          </Card.Group>
        </Form.Field>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column textAlign="right" width={16}>
        <Button content="Back" onClick={previousStep} />
        <Button primary content="Next" onClick={nextStep} />
      </Grid.Column>
    </Grid.Row>
  </>
);

export default ChooseTypeStep;
