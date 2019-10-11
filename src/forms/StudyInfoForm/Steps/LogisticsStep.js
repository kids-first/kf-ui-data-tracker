import React from 'react';
import {
  Form,
  Segment,
  Container,
  Button,
  Confirm,
  List,
  Header,
  Image,
  Table,
} from 'semantic-ui-react';
import {workflowOptions} from '../../../common/enums';
import {prevNextStep} from '../../../common/notificationUtils';
import FormField from '../../FormField';
import Markdown from 'react-markdown';

const LogisticsStep = ({
  newStudy,
  formikProps,
  setActiveStep,
  setFocused,
  focused,
  setConfirmOpen,
  confirmOpen,
  workflowType,
  editing,
  setEditing,
  history,
  foldDescription,
  setFoldDescription,
  isAdmin,
}) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    validateForm,
  } = formikProps;
  const mapFields = [
    {
      required: false,
      id: 'releaseDate',
      name: 'Release Date',
      description:
        "The anticipated date on which this study's data will be made public in Kids First.",
      type: 'date',
    },
    {
      required: false,
      id: 'anticipatedSamples',
      name: 'Number of anticipated samples',
      description:
        'The anticipated number of samples awarded for sequencing for the study.',
      type: 'number',
    },
    {
      required: false,
      id: 'awardeeOrganization',
      name: 'Awardee organization',
      description: 'The organization responsible for this study.',
      type: 'text',
    },
  ];
  return (
    <>
      <Header
        as="h4"
        className="text-wrap-75"
        content="Provide details about the Kids First grant that this study was awarded."
      />
      {mapFields.map(item => (
        <FormField
          key={item.id}
          isAdmin={isAdmin}
          newStudy={newStudy}
          required={item.required}
          id={item.id}
          name={item.name}
          description={item.description}
          type={item.type}
          focused={focused === item.id}
          value={values[item.id]}
          touched={touched[item.id]}
          errors={errors[item.id]}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
          readOnly={!editing && !newStudy}
        />
      ))}
      {!editing && !newStudy ? (
        <>
          <Header as="h5">Description:</Header>
          <Segment
            attached={values.description.length > 0}
            className={foldDescription ? 'max-h-500' : 'x-scroll'}
          >
            {values.description && values.description.length > 0 ? (
              <Markdown
                source={values.description}
                renderers={{
                  image: Image,
                  table: props => <Table>{props.children}</Table>,
                  list: List,
                  listItem: List.Item,
                }}
              />
            ) : (
              <Header disabled className="mt-6" as="h5">
                No study description available.
              </Header>
            )}
          </Segment>
          {values.description && values.description.length > 0 && (
            <Button
              attached="bottom"
              onClick={() => setFoldDescription(!foldDescription)}
              className="mb-15"
            >
              {foldDescription ? 'Read More' : 'Read Less'}
            </Button>
          )}
        </>
      ) : (
        <FormField
          isAdmin={isAdmin}
          newStudy={newStudy}
          id="description"
          name="Description"
          description="Study description in markdown, commonly the X01 abstract
      text."
          type="text"
          focused={focused === 'description'}
          value={values.description}
          touched={touched.description}
          errors={errors.description}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleFocus={id => setFocused(id)}
        >
          <Form.TextArea
            className="noMargin"
            rows="15"
            type="text"
            name="description"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
            readOnly={!editing && !newStudy}
          />
        </FormField>
      )}
      <Button
        floated="left"
        type="button"
        onClick={() => prevNextStep('external', newStudy, history)}
        labelPosition="left"
        icon="left arrow"
        content="PREVIOUS"
      />
      {newStudy && (
        <Button
          primary
          floated="right"
          type="button"
          disabled={
            Object.keys(errors).length > 0 ||
            values.name.length === 0 ||
            values.externalId.length === 0
          }
          onClick={() => {
            validateForm().then(errors => {
              Object.keys(errors).length === 0 && setConfirmOpen(true);
            });
          }}
        >
          SUBMIT
        </Button>
      )}
      {editing && (
        <Button
          primary
          floated="right"
          type="submit"
          disabled={
            Object.keys(errors).length > 0 ||
            values.name.length === 0 ||
            values.externalId.length === 0
          }
        >
          SAVE
        </Button>
      )}
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
              {workflowType.length > 0 && (
                <List.Item>
                  Cavatica harmonization projects
                  <List.List>
                    {workflowType.map(type => (
                      <List.Item key={type}>
                        {
                          workflowOptions.filter(obj => obj.value === type)[0]
                            .text
                        }
                      </List.Item>
                    ))}
                  </List.List>
                </List.Item>
              )}
            </List>
          </Container>
        }
        confirmButton={
          <Button primary floated="right" type="submit" loading={isSubmitting}>
            SUBMIT
          </Button>
        }
      />
    </>
  );
};

export default LogisticsStep;
