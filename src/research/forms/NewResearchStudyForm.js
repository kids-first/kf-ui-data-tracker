import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Container,
  Segment,
  Message,
  Header,
  Icon,
  Button,
  List,
  Image,
  Table,
  Dropdown,
} from 'semantic-ui-react';
import {Formik} from 'formik';
import {
  fieldLabel,
  trackedResearchStudyFields,
} from '../../common/notificationUtils';
import FormField from '../../forms/FormField';
import Markdown from 'react-markdown';
import avatarM from '../../assets/avatarM.png';
import avatarF from '../../assets/avatarF.png';
import kfLogo from '../../assets/logo.svg';
import d3bLogo from '../../assets/d3bLogo.svg';
/**
 * A form for the user to create or update a study, displaying in three steps
 */
const NewResearchStudyForm = ({
  submitValue,
  apiErrors,
  studyNode,
  newStudy,
  editing,
  history,
  isAdmin,
}) => {
  const [focused, setFocused] = useState('');
  const [foldDescription, setFoldDescription] = useState(true);
  const [contactSelection, setContactSelection] = useState([]);
  const [accountSelection, setAccountSelection] = useState('');
  const contactOptions = [
    {
      key: 'allison',
      value: 'allison',
      text: 'Allison',
      image: {avatar: true, src: avatarF},
    },
    {
      key: 'dan',
      value: 'dan',
      text: 'Dan',
      image: {avatar: true, src: avatarM},
    },
  ];
  const accountOptions = [
    {
      key: 'kidsFirst',
      value: 'kidsFirst',
      text: 'Kids First',
      image: {avatar: true, src: kfLogo},
    },
    {
      key: 'd3b',
      value: 'd3b',
      text: 'D3b',
      image: {avatar: true, src: d3bLogo},
    },
  ];
  const missingValueMessage = values => {
    let fields = trackedResearchStudyFields.map(field => {
      if (
        !studyNode[field] ||
        studyNode[field].length === 0 ||
        studyNode[field] === 0
      ) {
        return field;
      } else return null;
    });
    return fields.filter(field => field !== null);
  };
  const initialValues = {
    name: studyNode && studyNode.name ? studyNode.name : '',
    shortName: studyNode && studyNode.shortName ? studyNode.shortName : '',
    description:
      studyNode && studyNode.description ? studyNode.description : '',
    contact: studyNode && studyNode.contact ? studyNode.contact : [],
    account: studyNode && studyNode.account ? studyNode.account : '',
  };
  const mapFields = [
    {
      required: true,
      id: 'name',
      name: 'Study Name',
      description:
        'Full name of the study, often the full title of the X01 grant application.',
    },
    {
      required: false,
      id: 'shortName',
      name: 'Study Short Name',
      description: 'The name that will appear under portal facets.',
    },
  ];
  return (
    <Formik
      initialValues={initialValues}
      validate={values => {
        let errors = {};
        if (!values.name) {
          errors.name = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, {setSubmitting}) => {
        setSubmitting(false);
        const generatedExternalId = values.name
          .replace(/\s+/g, '-')
          .toLowerCase();
        var inputObject = {
          name: values.name,
          shortName: values.shortName,
          description: values.description,
          externalId: generatedExternalId,
        };
        if (newStudy) {
          submitValue({input: inputObject, workflowType: []});
        } else {
          submitValue(values);
        }
      }}
    >
      {formikProps => (
        <Fragment>
          {apiErrors && (
            <Message
              negative
              icon="attention"
              header="Error"
              content={apiErrors}
            />
          )}
          {!newStudy &&
            isAdmin &&
            missingValueMessage(formikProps.values).length > 0 && (
              <Message negative icon>
                <Icon name="warning circle" />
                <Message.Content>
                  <Message.Header>Missing values</Message.Header>
                  <p>Please add values to the following fields:</p>
                  <List bulleted horizontal>
                    {missingValueMessage(formikProps.values).map(item => (
                      <List.Item key={item} content={fieldLabel[item]} />
                    ))}
                  </List>
                </Message.Content>
              </Message>
            )}
          <Container
            as={Segment}
            basic
            clearing
            className={newStudy || editing ? 'grey-container p-20' : 'p-20'}
          >
            <Form onSubmit={formikProps.handleSubmit}>
              {mapFields.map(item => (
                <FormField
                  key={item.id}
                  isAdmin={isAdmin}
                  newStudy={newStudy}
                  required={item.required}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  focused={focused === item.id}
                  value={formikProps.values[item.id]}
                  touched={formikProps.touched[item.id]}
                  errors={formikProps.errors[item.id]}
                  handleChange={formikProps.handleChange}
                  handleBlur={formikProps.handleBlur}
                  handleFocus={id => setFocused(id)}
                  readOnly={!editing && !newStudy}
                />
              ))}
              {!editing && !newStudy ? (
                <>
                  <Header as="h5">Description:</Header>
                  <Segment
                    attached={formikProps.values.description.length > 0}
                    className={foldDescription ? 'max-h-500' : 'x-scroll'}
                  >
                    {formikProps.values.description &&
                    formikProps.values.description.length > 0 ? (
                      <Markdown
                        source={formikProps.values.description}
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
                  {formikProps.values.description &&
                    formikProps.values.description.length > 0 && (
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
                  value={formikProps.values.description}
                  touched={formikProps.touched.description}
                  errors={formikProps.errors.description}
                  handleChange={formikProps.handleChange}
                  handleBlur={formikProps.handleBlur}
                  handleFocus={id => setFocused(id)}
                >
                  <Form.TextArea
                    className="noMargin"
                    rows="15"
                    type="text"
                    name="description"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.description}
                    readOnly={!editing && !newStudy}
                  />
                </FormField>
              )}
              <FormField
                isAdmin={isAdmin}
                newStudy={newStudy}
                id="contact"
                name="Contact"
                description="Select the contacts associated with this research study."
                focused={focused === 'contact'}
                value={formikProps.values.contact}
                touched={
                  typeof formikProps.touched.contact === 'boolean'
                    ? formikProps.touched.contact
                    : true
                }
                errors={formikProps.errors.contact}
                handleChange={formikProps.handleChange}
                handleBlur={formikProps.handleBlur}
                handleFocus={id => setFocused(id)}
              >
                <Dropdown
                  id="contact"
                  name="contact"
                  placeholder="Select Contacts"
                  fluid
                  selection
                  clearable
                  multiple
                  options={contactOptions}
                  onChange={(e, {value}) => {
                    setContactSelection(value);
                    formikProps.handleChange(true);
                  }}
                  onBlur={formikProps.handleBlur}
                  value={contactSelection}
                />
              </FormField>
              <FormField
                isAdmin={isAdmin}
                newStudy={newStudy}
                required
                id="account"
                name="Account"
                description="Select one account associated with this research study."
                focused={focused === 'account'}
                value={formikProps.values.account}
                touched={formikProps.touched.account}
                errors={formikProps.errors.account}
                handleChange={formikProps.handleChange}
                handleBlur={formikProps.handleBlur}
                handleFocus={id => setFocused(id)}
              >
                <Dropdown
                  id="account"
                  name="account"
                  placeholder="Select Account"
                  fluid
                  selection
                  clearable
                  options={accountOptions}
                  onChange={(e, {value}) => {
                    setAccountSelection(value);
                    formikProps.handleChange(true);
                  }}
                  onBlur={formikProps.handleBlur}
                  value={accountSelection}
                />
              </FormField>
              {editing && (
                <Button
                  primary
                  floated="right"
                  type="submit"
                  disabled={
                    Object.keys(formikProps.errors).length > 0 ||
                    formikProps.values.name.length === 0
                  }
                >
                  SAVE
                </Button>
              )}
              {newStudy && (
                <Button
                  primary
                  floated="right"
                  type="button"
                  loading={formikProps.isSubmitting}
                  disabled={
                    Object.keys(formikProps.errors).length > 0 ||
                    formikProps.values.name.length === 0
                  }
                  onClick={() => {
                    formikProps.validateForm().then(errors => {
                      Object.keys(formikProps.errors).length === 0 &&
                        formikProps.handleSubmit();
                    });
                  }}
                >
                  SUBMIT
                </Button>
              )}
            </Form>
          </Container>
        </Fragment>
      )}
    </Formik>
  );
};

NewResearchStudyForm.propTypes = {
  /** Function to perform on form submission */
  submitValue: PropTypes.func.isRequired,
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
};

export default NewResearchStudyForm;
