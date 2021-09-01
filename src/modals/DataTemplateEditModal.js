import React, {useState} from 'react';
import {
  Button,
  Modal,
  Dimmer,
  Loader,
  Step,
  Message,
  Segment,
  Popup,
  Icon,
} from 'semantic-ui-react';
import DataTemplateForm from '../forms/DataTemplateForm/DataTemplateForm';

const DataTemplateEditModal = ({
  formikProps,
  open,
  setOpen,
  currentStep,
  setCurrentStep,
  editing,
  setEditing,
  fieldData,
  setFieldData,
  studySelect,
  setStudySelect,
  creationError,
  setCreationError,
  studyIds,
  currentOrg,
  onSelectOne,
  onSelectAll,
  handleUpload,
  createDataTemplate,
  createTemplateVersion,
  setEditConfirm,
  studyList,
  studyError,
  editable,
}) => {
  const [creating, setCreating] = useState('');

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

  return (
    <Modal
      closeIcon
      size="fullscreen"
      onClose={() => {
        setOpen('');
        setCurrentStep(0);
        setFieldData([]);
        setEditing([]);
        if (setStudySelect) {
          setCreationError('');
          setStudySelect(studyIds);
          setEditConfirm(false);
        }
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
          ? `${editable ? 'Edit' : 'View'} Data Template`
          : 'Create New Data Template'}
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description className="mb-15">
          Organization administrators can create data submission templates to
          standardize how data is data collected for their studies.
          {(Object.keys(formikProps.errors).length > 0 ||
            fieldData.length === 0 ||
            editing.length > 0) && (
            <p className="text-12 text-red">
              Before you submit please check if you have missing input or
              unsaved fields.
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
          {['Describe', 'Add Fields', 'Add to Studies'].map((step, stepNum) => (
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
          ))}
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
            onSelectOne={onSelectOne || null}
            onSelectAll={onSelectAll || null}
            handleUpload={handleUpload || null}
            fieldData={fieldData}
            setFieldData={setFieldData}
            editing={editing}
            setEditing={setEditing}
            editable={editable}
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
          content={
            currentOrg.id === formikProps.values.organization.id
              ? 'Close'
              : 'Cancel'
          }
          onClick={() => {
            setOpen('');
            setCurrentStep(0);
            setCreationError('');
            setFieldData([]);
            setEditing([]);
            setStudySelect(studyIds);
            setEditConfirm(false);
          }}
        />
        {editable && (
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
              setEditing([]);
              const templateInput = {
                name: formikProps.values.name,
                description: formikProps.values.description,
                icon: formikProps.values.icon,
                organization: currentOrg.id,
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
              if (open === 'Create' && createDataTemplate) {
                setCreating('Creating data template');
                createDataTemplate({
                  variables: {input: templateInput},
                })
                  .then(resp => {
                    createTemplateVersion({
                      variables: {
                        input: {
                          dataTemplate:
                            resp.data.createDataTemplate.dataTemplate.id,
                          description: 'init template fields',
                          fieldDefinitions: JSON.stringify(fieldDefInput),
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
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default DataTemplateEditModal;
