import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Segment,
  Container,
  Label,
  Button,
  Message,
  Grid,
  Confirm,
  List,
} from 'semantic-ui-react';
import {Formik} from 'formik';

const NewStudyForm = ({submitValue, apiErrors}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Segment padded="very" clearing>
      <Formik
        initialValues={{
          externalId: '',
          name: '',
          shortName: '',
          description: '',
          releaseDate: '',
          anticipatedSamples: 0,
          awardeeOrganization: '',
        }}
        validate={values => {
          let errors = {};
          if (!values.externalId) {
            errors.externalId = 'Required';
          }
          if (!values.name) {
            errors.name = 'Required';
          }
          if (values.anticipatedSamples < 0) {
            errors.anticipatedSamples = 'Invalid number of anticipated samples';
          }
          return errors;
        }}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(false);
          setConfirmOpen(false);
          var inputObject = values;
          if (values.releaseDate.length === 0) {
            inputObject.releaseDate = null;
          }
          submitValue(inputObject);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          validateForm,
          setErrors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid doubling stackable>
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
                    Identifier used by external systems, often the PHS ID if the
                    study is registered with dbGaP.
                  </Message>
                </Grid.Column>
              </Grid.Row>
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
                    Full name of the study, often the full title of the X01
                    grant application.
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
                  <Form.Field>
                    <label>Release date:</label>
                    <Form.Input
                      fluid
                      type="date"
                      name="releaseDate"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.releaseDate}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Message size="small">
                    The anticipated date on which this study's data will be made
                    public in Kids First.
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
                    The anticipated number of samples awarded for sequencing for
                    the study.
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
                <Grid.Column width={16}>
                  <Form.Field>
                    <label>Description:</label>
                    <Message size="small">
                      Study description in markdown, commonly the X01 abstract
                      text.
                    </Message>
                    <Form.TextArea
                      type="text"
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={13}>
                  {apiErrors && (
                    <Message size="mini" negative>
                      {apiErrors}
                    </Message>
                  )}
                </Grid.Column>
                <Grid.Column width={3}>
                  <Button
                    primary
                    floated="right"
                    type="button"
                    disabled={Object.keys(errors).length > 0}
                    onClick={() => {
                      validateForm().then(errors => {
                        Object.keys(errors).length === 0 &&
                          setConfirmOpen(true);
                      });
                    }}
                  >
                    SUBMIT
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Confirm
              open={confirmOpen}
              onCancel={() => setConfirmOpen(false)}
              onConfirm={handleSubmit}
              header="Create Study"
              content={
                <Container as={Segment} basic padded>
                  <p>The following resources will be created for this study</p>
                  <List bulleted>
                    <List.Item>Dataservice study</List.Item>
                    <List.Item>S3 bucket</List.Item>
                    <List.Item>Cavatica delivery project</List.Item>
                    <List.Item>Cavatica harmonization projects</List.Item>
                  </List>
                </Container>
              }
              confirmButton={
                <Button
                  primary
                  floated="right"
                  type="submit"
                  loading={isSubmitting}
                >
                  SUBMIT
                </Button>
              }
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

NewStudyForm.propTypes = {
  /** Function to perform on form submission */
  submitValue: PropTypes.func.isRequired,
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
};

export default NewStudyForm;
