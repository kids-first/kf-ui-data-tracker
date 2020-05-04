import React from 'react';
import {
  Form,
  Segment,
  Button,
  List,
  Header,
  Image,
  Table,
} from 'semantic-ui-react';
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
  allowEdit,
}) => {
  const {values, errors, touched, handleChange, handleBlur} = formikProps;
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
          allowEdit={allowEdit}
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
          allowEdit={allowEdit}
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
    </>
  );
};

export default LogisticsStep;
