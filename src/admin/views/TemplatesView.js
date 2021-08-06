import React, {Fragment, useState} from 'react';
import {Formik} from 'formik';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  ALL_TEMPLATE_VERSIONS,
  MY_PROFILE,
  ALL_STUDIES,
} from '../../state/queries';
import {
  UPLOAD_FIEID_DEFINITIONS,
  CREATE_DATA_TEMPLATE,
  UPDATE_DATA_TEMPLATE,
  CREATE_TEMPLATE_VERSION,
  UPDATE_TEMPLATE_VERSION,
} from '../../state/mutations';
import {
  Button,
  Container,
  Header,
  Icon,
  Message,
  Segment,
  Placeholder,
  Modal,
  Step,
  Popup,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import TemplateList from '../../components/TemplateList/TemplateList';
import DataTemplateForm from '../../forms/DataTemplateForm/DataTemplateForm';
import DataTemplateConfirmModal from '../../modals/DataTemplateConfirmModal';
import {dataTemplateIcons} from '../../common/enums';

const TemplatesView = () => {
  const [open, setOpen] = useState('');
  const [creating, setCreating] = useState('');
  const [creationError, setCreationError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [editConfirm, setEditConfirm] = useState(false);
  const [fieldData, setFieldData] = useState([]);
  const [editing, setEditing] = useState([]);

  const [uploadFieldDefinitions] = useMutation(UPLOAD_FIEID_DEFINITIONS);
  const [createDataTemplate] = useMutation(CREATE_DATA_TEMPLATE);
  const [updateDataTemplate] = useMutation(UPDATE_DATA_TEMPLATE);
  const [createTemplateVersion] = useMutation(CREATE_TEMPLATE_VERSION, {
    refetchQueries: [
      {
        query: ALL_TEMPLATE_VERSIONS,
      },
    ],
  });
  const [updateTemplateVersion] = useMutation(UPDATE_TEMPLATE_VERSION);

  const {loading, data, refetch, error} = useQuery(ALL_TEMPLATE_VERSIONS, {
    fetchPolicy: 'network-only',
  });
  const allTemplates = data && data.allTemplateVersions;

  const {data: profileData} = useQuery(MY_PROFILE);
  const profile = profileData && profileData.myProfile;
  const organizations = profile && profile.organizations;
  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }
  if (!currentOrg) {
    currentOrg = organizations && organizations.edges[0].node;
    localStorage.setItem('currentOrganization', JSON.stringify(currentOrg));
  }

  const {error: studyError, data: studyData} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'cache-first',
    variables: {
      organization: currentOrg && currentOrg.id,
    },
  });
  const allStudies = studyData && studyData.allStudies;
  const studyList = allStudies ? allStudies.edges : [];
  const studyIds = studyList.map(({node}) => node.id);
  const [studySelect, setStudySelect] = useState(studyIds);
  const onSelectOne = id => {
    if (studySelect.includes(id)) {
      setStudySelect(studySelect.filter(i => i !== id));
    } else {
      setStudySelect([...studySelect, id]);
    }
  };
  const onSelectAll = () => {
    if (studySelect.length === studyList.length) {
      setStudySelect([]);
    } else {
      setStudySelect(studyIds);
    }
  };

  const checkStepWarning = (stepNum, errors) => {
    if (stepNum === currentStep) {
      return <></>;
    } else {
      if (stepNum === 0 && Object.keys(errors).length > 0) {
        return (
          <Popup
            inverted
            position="top center"
            content="Missing required fields"
            trigger={
              <Icon name="warning circle" color="red" className="ml-5" />
            }
          />
        );
      } else if (stepNum === 1 && fieldData.length === 0) {
        return (
          <Popup
            inverted
            position="top center"
            content="Add at least one field"
            trigger={
              <Icon name="warning circle" color="red" className="ml-5" />
            }
          />
        );
      } else if (stepNum === 2 && studySelect.length === 0) {
        return (
          <Popup
            inverted
            position="top center"
            content="No study selected"
            trigger={
              <Icon name="warning circle" color="yellow" className="ml-5" />
            }
          />
        );
      } else {
        return <></>;
      }
    }
  };

  const handleUpload = file => {
    uploadFieldDefinitions({
      variables: {file: file},
    })
      .then(resp => {
        const fieldDefinitions = JSON.parse(
          resp.data.uploadFieldDefinitions.fieldDefinitions,
        ).fields.map((f, index) => ({
          ...f,
          tempId: String(index),
        }));
        setFieldData(fieldDefinitions);
        setCreationError('');
        setEditing([]);
      })
      .catch(err => {
        console.log(err);
        setCreationError(err.message);
        setEditing([]);
      });
  };

  const handleModalClose = () => {
    setOpen('');
    setCurrentStep(0);
    setCreationError('');
    setFieldData([]);
    setStudySelect(studyIds);
    setEditConfirm(false);
    refetch();
  };

  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Templates</title>
      </Helmet>
      <Header as="h2">
        Manage Data Templates
        <Header.Subheader>
          Organization administrators can create data submission templates to
          standardize how data is data collected for their studies.
        </Header.Subheader>
      </Header>
      <Formik
        initialValues={{
          id: null,
          versionId: null,
          name: '',
          description: '',
          icon: 'file excel',
          organization: currentOrg.id,
          fieldDefinitions: '',
          studies: [],
          origin: {},
          existFields: [],
        }}
        validate={vals => {
          let errors = {};
          ['name', 'description'].forEach(function(field) {
            if (!vals[field]) {
              errors[field] = 'Required';
            }
          });
          if (!dataTemplateIcons.includes(vals.icon)) {
            errors.icon = 'Invalid icon';
          }
          return errors;
        }}
      >
        {formikProps => (
          <Fragment>
            <Segment basic vertical>
              {error && (
                <Message
                  negative
                  icon="warning circle"
                  header="Error"
                  content={error.message}
                />
              )}
              {allTemplates && (
                <TemplateList
                  templates={allTemplates.edges}
                  setOpen={setOpen}
                  organization={currentOrg.id}
                  setFieldValue={formikProps.setFieldValue}
                  setFieldData={setFieldData}
                  setStudySelect={setStudySelect}
                />
              )}
            </Segment>
            {editConfirm ? (
              <DataTemplateConfirmModal
                open={open}
                formikProps={formikProps}
                fieldData={fieldData}
                studyList={studyList}
                studyError={studyError}
                studySelect={studySelect}
                setEditConfirm={setEditConfirm}
                handleModalClose={handleModalClose}
                updateDataTemplate={updateDataTemplate}
                updateTemplateVersion={updateTemplateVersion}
              />
            ) : (
              <Modal
                closeIcon
                size="fullscreen"
                onClose={() => {
                  setOpen('');
                  setCurrentStep(0);
                  setCreationError('');
                  setFieldData([]);
                  setStudySelect(studyIds);
                  setEditConfirm(false);
                }}
                open={open.length > 0}
                closeOnDimmerClick={false}
              >
                {creating.length > 0 && (
                  <Dimmer active inverted>
                    <Loader inverted>{creating}</Loader>
                  </Dimmer>
                )}
                <Modal.Header>
                  {formikProps.values.id
                    ? 'Edit Data Template'
                    : 'Create New Data Template'}
                </Modal.Header>
                <Modal.Content scrolling>
                  <Modal.Description className="mb-15">
                    Organization administrators can create data submission
                    templates to standardize how data is data collected for
                    their studies.
                    {(Object.keys(formikProps.errors).length > 0 ||
                      fieldData.length === 0 ||
                      editing.length > 0) && (
                      <p className="text-12 text-red">
                        Before you submit please check if you have missing input
                        or unsaved fields.
                      </p>
                    )}
                  </Modal.Description>
                  {creationError && (
                    <Message
                      negative
                      icon="warning circle"
                      header="Error"
                      content={creationError}
                    />
                  )}
                  <Step.Group ordered widths={3} attached="top" fluid>
                    {['Describe', 'Add Fields', 'Add to Studies'].map(
                      (step, stepNum) => (
                        <Step
                          key={stepNum}
                          active={stepNum === currentStep}
                          onClick={() => {
                            setCurrentStep(stepNum);
                          }}
                        >
                          <Step.Content>
                            <Step.Title>
                              {step}
                              {checkStepWarning(stepNum, formikProps.errors)}
                            </Step.Title>
                          </Step.Content>
                        </Step>
                      ),
                    )}
                  </Step.Group>
                  <Segment attached className="min-h-350">
                    <DataTemplateForm
                      formikProps={formikProps}
                      studyList={studyList}
                      studyError={studyError}
                      currentOrg={currentOrg}
                      currentStep={currentStep}
                      studySelect={studySelect}
                      setStudySelect={setStudySelect}
                      onSelectOne={onSelectOne}
                      onSelectAll={onSelectAll}
                      handleUpload={handleUpload}
                      fieldData={fieldData}
                      setFieldData={setFieldData}
                      editing={editing}
                      setEditing={setEditing}
                    />
                  </Segment>
                </Modal.Content>
                <Modal.Actions>
                  {currentStep !== 0 && (
                    <Button
                      floated="left"
                      content="Back"
                      icon="left arrow"
                      labelPosition="left"
                      onClick={() => {
                        setCurrentStep(currentStep - 1);
                      }}
                    />
                  )}
                  {currentStep !== 2 && (
                    <Button
                      content="Next"
                      icon="right arrow"
                      labelPosition="right"
                      onClick={() => {
                        setCurrentStep(currentStep + 1);
                      }}
                    />
                  )}
                  <Button
                    content="Cancel"
                    onClick={() => {
                      setOpen('');
                      setCurrentStep(0);
                      setCreationError('');
                      setFieldData([]);
                      setStudySelect(studyIds);
                      setEditConfirm(false);
                    }}
                  />
                  <Button
                    primary
                    content={open}
                    icon={open === 'Create' ? 'add' : 'save'}
                    labelPosition="right"
                    disabled={
                      Object.keys(formikProps.errors).length > 0 ||
                      fieldData.length === 0 ||
                      editing.length > 0
                    }
                    onClick={() => {
                      setCreationError('');
                      const templateInput = {
                        name: formikProps.values.name,
                        description: formikProps.values.description,
                        icon: formikProps.values.icon,
                        organization: formikProps.values.organization,
                      };
                      const fieldDefInput = {
                        fields: fieldData.map(f => ({
                          accepted_values: f.accepted_values,
                          data_type: f.data_type,
                          description: f.description,
                          instructions: f.instructions,
                          key: f.key,
                          label: f.label,
                          missing_values: f.missing_values,
                          required: f.required,
                        })),
                      };
                      if (open === 'Create') {
                        setCreating('Creating data template');
                        createDataTemplate({
                          variables: {input: templateInput},
                        })
                          .then(resp => {
                            createTemplateVersion({
                              variables: {
                                input: {
                                  dataTemplate:
                                    resp.data.createDataTemplate.dataTemplate
                                      .id,
                                  description: 'init template fields',
                                  fieldDefinitions: JSON.stringify(
                                    fieldDefInput,
                                  ),
                                  studies: studySelect,
                                },
                              },
                            })
                              .then(resp => {
                                setCreating('');
                                setOpen('');
                              })
                              .catch(err => {
                                console.log(err);
                                setCreationError(err.message);
                                setCreating('');
                              });
                          })
                          .catch(err => {
                            console.log(err);
                            setCreationError(err.message);
                            setCreating('');
                          });
                      } else if (open === 'Save') {
                        setEditConfirm(true);
                      }
                    }}
                  />
                </Modal.Actions>
              </Modal>
            )}
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default TemplatesView;
