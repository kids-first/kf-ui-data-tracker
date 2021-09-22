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
  version,
  studyId,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  evaluateResult,
  setFieldValue,
}) => {
  const matchedTemplates = evaluateResult.results
    ? evaluateResult.results
        .filter(r => r.matchesTemplate)
        .map(r => r.templateVersion.id)
    : [];

  return (
    <>
      <Grid.Row>
        <Grid.Column width={4}>
          <Image src={documentSelection} size="medium" centered rounded />
          <Header>Choose Document Type</Header>
          <p>Help the DRC by indicating what type of file this is.</p>
          <Header size="small">Templated Types</Header>
          <p>
            Templated types reflect the data templates your organization has
            setup for your studies. They follow a defined file structure and can
            help the DRC process the file faster.
          </p>
          <Header size="small">General Types</Header>
          <p>
            Use a General type if your file does not conform to any of the
            Templated types or if the Templated types do not provide the
            appropriate categorization for your file. General types are still
            important to help the DRC organize and find files.
          </p>
        </Grid.Column>
        <Grid.Column width={12}>
          {evaluateResult.graphQLErrors && (
            <Message
              negative
              icon="warning circle"
              header="Error"
              content={evaluateResult.graphQLErrors[0].message}
            />
          )}
          <Form.Field required>
            <Header size="small">Templated Types</Header>
            <Dimmer.Dimmable>
              {templates.length ? (
                <Card.Group itemsPerRow={3}>
                  {templates
                    .filter(({node}) => matchedTemplates.includes(node.id))
                    .map(({node}) => (
                      <TemplateCard
                        node={node}
                        key={node.id}
                        studyId={studyId}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        setFieldValue={setFieldValue}
                        result={
                          evaluateResult.results
                            ? evaluateResult.results.filter(
                                r => r.templateVersion.id === node.id,
                              )
                            : []
                        }
                      />
                    ))}
                  {templates
                    .filter(({node}) => !matchedTemplates.includes(node.id))
                    .map(({node}) => (
                      <TemplateCard
                        node={node}
                        key={node.id}
                        studyId={studyId}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        setFieldValue={setFieldValue}
                        result={
                          evaluateResult.results
                            ? evaluateResult.results.filter(
                                r => r.templateVersion.id === node.id,
                              )
                            : []
                        }
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
              <Dimmer active={templates.length === 0} inverted>
                <Header size="small">
                  No data templates available
                  <Header.Subheader>
                    <p className="mb-0">
                      Please contact organization administrators to create data
                      submission templates.
                    </p>
                    <p>
                      Data templates help to standardize how data is data
                      collected for this study.
                    </p>
                  </Header.Subheader>
                </Header>
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
                  setSelectedTemplate={setSelectedTemplate}
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
};

export default ChooseTypeStep;
