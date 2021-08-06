import React, {Fragment, useState} from 'react';
import {
  Button,
  Header,
  Icon,
  Modal,
  Dimmer,
  Loader,
  Grid,
  Card,
  Label,
  Table,
  Form,
  TextArea,
  Message,
} from 'semantic-ui-react';
import {HeaderRow, DisplayRow} from '../forms/DataTemplateForm/FieldTableRow';
import {stringSort, shallowEqual, comparerFlatArray} from '../common/sortUtils';

const DataTemplateConfirmModal = ({
  open,
  formikProps,
  fieldData,
  studyList,
  studyError,
  studySelect,
  setEditConfirm,
  handleModalClose,
  updateDataTemplate,
  updateTemplateVersion,
}) => {
  const [creating, setCreating] = useState([]);
  const [creationError, setCreationError] = useState([]);
  const [summary, setSummary] = useState('');

  const comparerArray = otherArray => {
    return function(current) {
      return (
        otherArray.filter(function(other) {
          return (
            other.label === current.label &&
            other.required === current.required &&
            other.data_type === current.data_type &&
            other.description === current.description &&
            other.instructions === current.instructions &&
            (other.accepted_values &&
              other.accepted_values.sort().join(',')) ===
              (current.accepted_values &&
                current.accepted_values.sort().join(','))
          );
        }).length === 0
      );
    };
  };

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
  const oldFieldDefinitions = formikProps.values.existFields;
  const oldFields = oldFieldDefinitions.sort((f1, f2) =>
    stringSort(f1.label, f2.label),
  );
  const newFields = fieldData.sort((f1, f2) => stringSort(f1.label, f2.label));
  const added = newFields.filter(comparerArray(oldFields));
  const removed = oldFields.filter(comparerArray(newFields));
  const existed = formikProps.values.existFields.map(f => f.tempId);
  const rmEdit = added.map(f => f.tempId);

  const oldStudies = formikProps.values.studies;
  const addedStudies = studySelect.filter(comparerFlatArray(oldStudies));
  const removedStudies = oldStudies.filter(comparerFlatArray(studySelect));

  return (
    <Modal
      closeIcon
      size="fullscreen"
      onClose={handleModalClose}
      open={open.length > 0}
      closeOnDimmerClick={false}
    >
      {creating.length > 0 && (
        <Dimmer active inverted>
          <Loader inverted>
            {creating.map(m => (
              <p key={m}>{m}</p>
            ))}
          </Loader>
        </Dimmer>
      )}
      <Modal.Header>Please confirm your changes</Modal.Header>
      <Modal.Content scrolling>
        {creationError.length > 0 && (
          <Message negative icon>
            <Icon name="warning circle" />
            <Message.Content>
              <Message.Header>Error</Message.Header>
              {creationError.map(m => (
                <p key={m}>{m}</p>
              ))}
            </Message.Content>
          </Message>
        )}
        <Header as="h4">Data template and applied stuides</Header>
        <Grid verticalAlign="middle" centered>
          <Grid.Column width={5}>
            <Card
              fluid
              color={
                !shallowEqual(templateInput, formikProps.values.origin)
                  ? 'yellow'
                  : 'grey'
              }
            >
              <Card.Content>
                <Header floated="left" as="h4" className="noMargin">
                  Template
                </Header>
                {!shallowEqual(templateInput, formikProps.values.origin) && (
                  <Header floated="right" as="h4" color="yellow">
                    Updated
                  </Header>
                )}
              </Card.Content>
              <Card.Content>
                <Header as="h4" icon>
                  <Icon name={formikProps.values.icon} />
                  {formikProps.values.name}
                  <Header.Subheader>
                    {formikProps.values.description}
                  </Header.Subheader>
                </Header>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={1}>
            <Icon name="arrow right" size="big" color="grey" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card
              fluid
              color={
                addedStudies.concat(removedStudies).length > 0
                  ? 'yellow'
                  : 'grey'
              }
            >
              <Card.Content className="text-right">
                <Header floated="left" as="h4" className="noMargin">
                  Studies
                </Header>
                <Header
                  floated="right"
                  as="h4"
                  color={
                    addedStudies.concat(removedStudies).length > 0
                      ? 'yellow'
                      : 'grey'
                  }
                >
                  {studySelect.length} studies selected
                </Header>
              </Card.Content>
              <Card.Content>
                {studyList.length > 0 ? (
                  <>
                    {studyList
                      .filter(({node}) => studySelect.includes(node.id))
                      .map(({node}) => (
                        <Label
                          as={Button}
                          basic
                          fluid
                          className="mb-5 text-left"
                          key={node.id}
                          color={
                            addedStudies.includes(node.id) ? 'green' : 'blue'
                          }
                        >
                          <Icon
                            name={
                              addedStudies.includes(node.id) ? 'add' : 'server'
                            }
                          />
                          <span className="text-black pr-5">{node.name}</span>
                          <code className="text-grey text-normal">
                            {node.kfId}
                          </code>
                        </Label>
                      ))}
                    {studyList
                      .filter(({node}) => removedStudies.includes(node.id))
                      .map(({node}) => (
                        <Label
                          as={Button}
                          basic
                          fluid
                          className="mb-5 text-left"
                          key={node.id}
                          color="grey"
                        >
                          <Icon name="remove" />
                          <span className="text-grey pr-5">{node.name}</span>
                          <code className="text-grey text-normal">
                            {node.kfId}
                          </code>
                        </Label>
                      ))}
                  </>
                ) : studyError ? (
                  <span className="text-red">{studyError.message}</span>
                ) : (
                  <span className="text-grey">No study data avalilable</span>
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        {added.concat(removed).length > 0 && (
          <Fragment>
            <Header as="h4">
              Updated fields definitions{' '}
              <span className="text-12 text-normal text-red pl-16">
                Change summary is required
              </span>
            </Header>
            <Form>
              <TextArea
                required
                placeholder="Tell us more about the changes made for the fields below"
                value={summary}
                onChange={(e, {value}) => {
                  setSummary(value);
                }}
              />
            </Form>
            <Table celled>
              <Table.Header>
                <HeaderRow status="Status" />
              </Table.Header>
              <Table.Body>
                {added.length > 0 &&
                  added
                    .filter(f => existed.includes(f.tempId))
                    .map((f, index) => (
                      <DisplayRow
                        key={f.label + index}
                        field={f}
                        status="UPDATED"
                      />
                    ))}
                {added.length > 0 &&
                  added
                    .filter(f => !existed.includes(f.tempId))
                    .map((f, index) => (
                      <DisplayRow
                        key={f.label + index}
                        field={f}
                        status="ADDED"
                      />
                    ))}
                {removed.length > 0 &&
                  removed
                    .filter(f => !rmEdit.includes(f.tempId))
                    .map((f, index) => (
                      <DisplayRow
                        key={f.label + index}
                        field={f}
                        status="REMOVED"
                      />
                    ))}
              </Table.Body>
            </Table>
          </Fragment>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button content="Back" onClick={() => setEditConfirm(false)} />
        <Button
          primary
          content="Save"
          icon="save"
          labelPosition="right"
          disabled={added.concat(removed).length > 0 && summary.length === 0}
          onClick={() => {
            setCreationError([]);
            setCreating([...creating, 'Updating data template']);
            updateDataTemplate({
              variables: {
                id: formikProps.values.id,
                input: templateInput,
              },
            })
              .then(resp => {
                setCreating([
                  ...creating.filter(m => m !== 'Updating data template'),
                  'Updating field definitions',
                ]);
                updateTemplateVersion({
                  variables: {
                    id: formikProps.values.versionId,
                    input: {
                      description: summary,
                      fieldDefinitions: JSON.stringify(fieldDefInput),
                      studies: studySelect,
                    },
                  },
                })
                  .then(resp => {
                    setCreating(
                      creating.filter(m => m !== 'Updating field definitions'),
                    );
                    handleModalClose();
                  })
                  .catch(err => {
                    console.log(err);
                    setCreationError([...creationError, err.message]);
                    setCreating(
                      creating.filter(m => m !== 'Updating field definitions'),
                    );
                  });
              })
              .catch(err => {
                console.log(err);
                setCreationError([...creationError, err.message]);
                setCreating(
                  creating.filter(m => m !== 'Updating data template'),
                );
              });
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DataTemplateConfirmModal;
