import React, {useState} from 'react';
import {
  Table,
  Dropdown,
  Input,
  Checkbox,
  Icon,
  Button,
  Popup,
  Divider,
} from 'semantic-ui-react';

export const dataTypeOptions = [
  {
    key: 'string',
    text: 'string',
    value: 'string',
  },
  {
    key: 'number',
    text: 'number',
    value: 'number',
  },
  {
    key: 'boolean',
    text: 'boolean',
    value: 'boolean',
  },
  {
    key: 'date',
    text: 'date',
    value: 'date',
  },
  {
    key: 'enum',
    text: 'enum',
    value: 'enum',
  },
];

export const EditRow = ({
  field,
  editing,
  setEditing,
  fieldData,
  setFieldData,
  editable,
}) => {
  const [fieldInput, setFieldInput] = useState(field);
  return (
    <Table.Row>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Key..."
          value={fieldInput.key ? fieldInput.key : ''}
          onChange={(e, {value}) => {
            setFieldInput({...fieldInput, key: value});
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Label..."
          value={fieldInput.label}
          onChange={(e, {value}) => {
            setFieldInput({...fieldInput, label: value});
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          fluid
          selection
          compact
          placeholder="Type..."
          options={dataTypeOptions}
          value={fieldInput.data_type}
          onChange={(e, {value}) => {
            setFieldInput({...fieldInput, data_type: value});
          }}
        />
      </Table.Cell>
      <Table.Cell
        textAlign="center"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          setFieldInput({...fieldInput, required: !fieldInput.required});
        }}
      >
        <Checkbox
          checked={fieldInput.required}
          onChange={e => {
            e.stopPropagation();
            e.preventDefault();
            setFieldInput({...fieldInput, required: !fieldInput.required});
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Values separated by ' , '"
          value={
            fieldInput.accepted_values
              ? fieldInput.accepted_values.join(',')
              : ''
          }
          onChange={(e, {value}) => {
            setFieldInput({
              ...fieldInput,
              accepted_values: value ? value.split(',') : [],
            });
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Values separated by ' , '"
          value={
            fieldInput.missing_values ? fieldInput.missing_values.join(',') : ''
          }
          onChange={(e, {value}) => {
            setFieldInput({
              ...fieldInput,
              missing_values: value ? value.split(',') : [],
            });
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Description..."
          value={fieldInput.description}
          onChange={(e, {value}) => {
            setFieldInput({...fieldInput, description: value});
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          className="no-border"
          placeholder="Instructions..."
          value={fieldInput.instructions}
          onChange={(e, {value}) => {
            setFieldInput({...fieldInput, instructions: value});
          }}
        />
      </Table.Cell>
      {editable && (
        <Table.Cell textAlign="center">
          <Button.Group fluid size="small">
            <Popup
              inverted
              position="top center"
              content="Save"
              trigger={
                <Button
                  basic
                  compact
                  icon="save"
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    setEditing([...editing].filter(i => i !== field.tempId));
                    const editedField = {
                      accepted_values: fieldInput.accepted_values
                        ? fieldInput.accepted_values.filter(v => v !== '')
                        : null,
                      data_type: fieldInput.data_type,
                      description: fieldInput.description,
                      instructions: fieldInput.instructions,
                      key: fieldInput.key,
                      label: fieldInput.label,
                      missing_values: fieldInput.missing_values
                        ? fieldInput.missing_values.filter(v => v !== '')
                        : null,
                      required: fieldInput.required,
                      tempId: fieldInput.tempId,
                    };
                    if (
                      fieldData.length > 0 &&
                      fieldData.filter(obj => obj.tempId === fieldInput.tempId)
                        .length > 0
                    ) {
                      setFieldData([
                        ...fieldData.filter(
                          obj => obj.tempId !== fieldInput.tempId,
                        ),
                        editedField,
                      ]);
                    } else {
                      setFieldData([...fieldData, editedField]);
                    }
                  }}
                />
              }
            />
            <Popup
              position="top center"
              header="Are you sure?"
              content={
                <>
                  This field will be removed from current template
                  <Divider />
                  <Button
                    negative
                    fluid
                    icon={<Icon name="trash alternate" />}
                    content="Delete"
                    onClick={e => {
                      e.stopPropagation();
                      setEditing([...editing].filter(i => i !== field.tempId));
                      setFieldData(
                        [...fieldData].filter(f => f.tempId !== field.tempId),
                      );
                    }}
                  />
                </>
              }
              on="click"
              trigger={
                <Button
                  basic
                  compact
                  icon="trash alternate"
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              }
            />
          </Button.Group>
        </Table.Cell>
      )}
    </Table.Row>
  );
};

export const DisplayRow = ({
  field,
  editing,
  setEditing,
  fieldData,
  setFieldData,
  status,
  editable,
}) => (
  <Table.Row
    positive={status === 'ADDED'}
    negative={status === 'REMOVED'}
    warning={status === 'UPDATED'}
  >
    <Table.Cell>{field.key ? field.key : '--'}</Table.Cell>
    <Table.Cell>{field.label ? field.label : '--'}</Table.Cell>
    <Table.Cell textAlign="center">
      {field.data_type ? field.data_type : '--'}
    </Table.Cell>
    <Table.Cell textAlign="center">
      {field.required ? <Icon name="check" color="green" /> : <Icon name="x" />}
    </Table.Cell>
    <Popup
      disabled={
        !field.accepted_values ||
        (field.accepted_values && field.accepted_values.join(',').length <= 40)
      }
      wide="very"
      position="top left"
      trigger={
        <Table.Cell>
          {field.accepted_values
            ? field.accepted_values.join(',').substring(0, 40) +
              (field.accepted_values.join(',').length > 40 ? '...' : '')
            : '--'}
        </Table.Cell>
      }
      content={field.accepted_values ? field.accepted_values.join(',') : '--'}
    />
    <Popup
      disabled={
        !field.missing_values ||
        (field.missing_values && field.missing_values.join(',').length <= 40)
      }
      wide="very"
      position="top left"
      trigger={
        <Table.Cell>
          {field.missing_values
            ? field.missing_values.join(',').substring(0, 40) +
              (field.missing_values.join(',').length > 40 ? '...' : '')
            : '--'}
        </Table.Cell>
      }
      content={field.missing_values ? field.missing_values.join(',') : '--'}
    />
    <Popup
      disabled={
        !field.description ||
        (field.description && field.description.length <= 40)
      }
      wide="very"
      position="top left"
      trigger={
        <Table.Cell>
          {field.description
            ? field.description.substring(0, 40) +
              (field.description.length > 40 ? '...' : '')
            : '--'}
        </Table.Cell>
      }
      content={field.description}
    />
    <Popup
      disabled={
        !field.instructions ||
        (field.instructions && field.instructions.length <= 40)
      }
      wide="very"
      position="top left"
      trigger={
        <Table.Cell>
          {field.instructions
            ? field.instructions.substring(0, 40) +
              (field.instructions.length > 40 ? '...' : '')
            : '--'}
        </Table.Cell>
      }
      content={field.description}
    />
    {editable && (
      <>
        {status ? (
          <Table.Cell textAlign="center">{status}</Table.Cell>
        ) : (
          <Table.Cell textAlign="center">
            <Button.Group fluid size="small">
              <Popup
                inverted
                position="top center"
                content="Edit"
                trigger={
                  <Button
                    basic
                    compact
                    icon="pencil"
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      setEditing([...editing, field.tempId]);
                    }}
                  />
                }
              />
              <Popup
                position="top center"
                header="Are you sure?"
                content={
                  <>
                    This field will be removed from current template
                    <Divider />
                    <Button
                      negative
                      fluid
                      icon={<Icon name="trash alternate" />}
                      content="Delete"
                      onClick={e => {
                        e.stopPropagation();
                        setFieldData(
                          [...fieldData].filter(f => f.tempId !== field.tempId),
                        );
                      }}
                    />
                  </>
                }
                on="click"
                trigger={
                  <Button
                    basic
                    compact
                    icon="trash alternate"
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                }
              />
            </Button.Group>
          </Table.Cell>
        )}
      </>
    )}
  </Table.Row>
);

export const HeaderRow = ({status, editable}) => (
  <Table.Row>
    <Popup
      inverted
      position="top center"
      content="Canonical name or identifier for the field"
      trigger={<Table.HeaderCell>Key</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="Human friendly name for the field"
      trigger={<Table.HeaderCell>Label</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="The data type of this field's values"
      trigger={<Table.HeaderCell>Data Type</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="Whether the field is required to be populated"
      trigger={<Table.HeaderCell width="1">Required</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="The list of acceptable values this field may be populated with"
      trigger={<Table.HeaderCell>Accepted Values</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="Values that a submitter may use if the data for this field is unknown or unavailable for whatever reason"
      trigger={<Table.HeaderCell>Missing Values</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="Description for the field"
      trigger={<Table.HeaderCell>Description</Table.HeaderCell>}
    />
    <Popup
      inverted
      position="top center"
      content="Instructions or best practices for the data submitter on how to populate this field"
      trigger={<Table.HeaderCell>Instructions</Table.HeaderCell>}
    />
    {editable && (
      <Table.HeaderCell width="1">
        {status ? status : 'Actions'}
      </Table.HeaderCell>
    )}
  </Table.Row>
);
