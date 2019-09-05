import React from 'react';
import {Form, Label, Message, Grid} from 'semantic-ui-react';

const EditStudyForm = ({formikProps}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
  return (
    <Grid doubling stackable>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field required>
            <label>Study name:</label>
            <Form.Input
              fluid
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={
                touched.name !== undefined &&
                errors.name !== undefined &&
                errors.name.length > 0
              }
            />
            {touched.name && errors.name && errors.name.length > 0 && (
              <Label pointing basic color="red">
                {errors.name}
              </Label>
            )}
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            Full name of the study, often the full title of the X01 grant
            application.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Study short name:</label>
            <Form.Input
              fluid
              type="text"
              name="shortName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.shortName}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The name that will appear under portal facets.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field required>
            <label>External ID:</label>
            <Form.Input
              fluid
              type="text"
              name="externalId"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.externalId}
              error={
                touched.externalId !== undefined &&
                errors.externalId !== undefined &&
                errors.externalId.length > 0
              }
            />
            {touched.externalId &&
              errors.externalId &&
              errors.externalId.length > 0 && (
                <Label pointing basic color="red">
                  {errors.externalId}
                </Label>
              )}
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            Identifier used by external systems, often the PHS ID if the study
            is registered with dbGaP.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Version:</label>
            <Form.Input
              fluid
              type="text"
              name="version"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.version}
              error={
                touched.version && errors.version && errors.version.length > 0
              }
            />
            {touched.version && errors.version && errors.version.length > 0 && (
              <Label pointing basic color="red">
                {errors.version}
              </Label>
            )}
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            Study version, often the provided by the data access authority.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Release date:</label>
            <Form.Input
              fluid
              type="date"
              name="releaseDate"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.releaseDate == null ? '' : values.releaseDate}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The anticipated date on which this study's data will be made public
            in Kids First.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Number of anticipated samples:</label>
            <Form.Input
              fluid
              type="number"
              name="anticipatedSamples"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.anticipatedSamples}
              error={
                touched.anticipatedSamples !== undefined &&
                errors.anticipatedSamples !== undefined &&
                errors.anticipatedSamples.length > 0
              }
            />
            {touched.anticipatedSamples &&
              errors.anticipatedSamples &&
              errors.anticipatedSamples.length > 0 && (
                <Label pointing basic color="red">
                  {errors.anticipatedSamples}
                </Label>
              )}
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The anticipated number of samples awarded for sequencing for the
            study.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Awardee organization:</label>
            <Form.Input
              fluid
              type="text"
              name="awardeeOrganization"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.awardeeOrganization}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The organization responsible for this study.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>Attribution:</label>
            <Form.Input
              fluid
              type="text"
              name="attribution"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.attribution}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The URL providing more information about the study.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={8}>
          <Form.Field>
            <label>S3 Bucket:</label>
            <Form.Input
              fluid
              type="text"
              name="bucket"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.bucket}
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={8}>
          <Message size="small">
            The s3 bucket where data for this study resides.
          </Message>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row verticalAlign="middle">
        <Grid.Column width={16}>
          <Form.Field>
            <label>Description:</label>
            <Message size="small">
              Study description in markdown, commonly the X01 abstract text.
            </Message>
            <Form.TextArea
              rows="15"
              type="text"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
            />
          </Form.Field>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default EditStudyForm;
