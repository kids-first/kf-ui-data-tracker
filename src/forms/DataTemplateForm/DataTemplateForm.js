import React, {Fragment, useState} from 'react';
import {
  Form,
  Image,
  Table,
  Dropdown,
  Input,
  Card,
  Checkbox,
  Label,
  Grid,
  Icon,
  Segment,
  Button,
  Header,
} from 'semantic-ui-react';
import {dataTemplateIcons} from '../../common/enums';
import {HeaderRow, EditRow, DisplayRow, dataTypeOptions} from './FieldTableRow';

/**
 * Displays a form for users to create/edit a data template
 */
const DataTemplateForm = ({
  formikProps,
  studyList,
  studyError,
  currentOrg,
  currentStep,
  studySelect,
  setStudySelect,
  onSelectOne,
  onSelectAll,
  handleUpload,
  fieldData,
  setFieldData,
  editing,
  setEditing,
}) => {
  const [iconOpen, setIconOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const defaultLogo =
    'https://raw.githubusercontent.com/kids-first/kf-ui-data-tracker/master/src/assets/logo.svg';

  const searched =
    search.length > 0
      ? fieldData.filter(f =>
          [f.name, f.label, f.accepted_values, f.description, f.instructions]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
      : fieldData;
  const filtered =
    filter.length > 0 ? searched.filter(f => f.data_type === filter) : searched;

  const withinOrg = currentOrg.id === formikProps.values.organization.id;

  return (
    <Form>
      {currentStep === 0 && (
        <Fragment>
          {withinOrg ? (
            <Form.Input
              className="image-input"
              readOnly
              fluid
              label="Organization"
              placeholder="Your current organization"
              iconPosition="left"
              icon={
                <Image
                  as={Icon}
                  avatar
                  src={formikProps.values.organization.image || defaultLogo}
                />
              }
              value={'  ' + formikProps.values.organization.name}
            />
          ) : (
            <Form.Input
              className="image-input"
              readOnly
              fluid
              label="Organization"
              placeholder="Your current organization"
              iconPosition="left"
              icon={
                <Image as={Icon} avatar src={currentOrg.image || defaultLogo} />
              }
              value={'  ' + currentOrg.name}
            />
          )}
          <Form.Input
            fluid
            required
            name="name"
            label="Name"
            placeholder="Data template name"
            value={formikProps.values.name}
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            error={
              formikProps.touched.name !== undefined && formikProps.errors.name
            }
            readOnly={!withinOrg}
          />
          {iconOpen ? (
            <div className="field">
              <label>
                Icon
                <Button
                  size="mini"
                  floated="right"
                  icon="caret up"
                  onClick={() => setIconOpen(false)}
                />
              </label>
              <Segment className="noMargin">
                {dataTemplateIcons.map(icon => (
                  <Button
                    animated
                    basic
                    key={icon}
                    size="small"
                    className="mb-5"
                    onClick={() => {
                      formikProps.setFieldValue('icon', icon);
                      setIconOpen(false);
                    }}
                  >
                    <Button.Content hidden>{icon}</Button.Content>
                    <Button.Content visible>
                      <Icon name={icon} />
                    </Button.Content>
                  </Button>
                ))}
              </Segment>
            </div>
          ) : (
            <Form.Input
              fluid
              name="icon"
              label="Icon"
              icon={
                dataTemplateIcons.includes(formikProps.values.icon)
                  ? formikProps.values.icon
                  : 'x'
              }
              iconPosition="left"
              placeholder="Semantic icon name"
              value={formikProps.values.icon}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.icon}
              action={
                <Button
                  icon="caret down"
                  onClick={() => setIconOpen(true)}
                  disabled={!withinOrg}
                />
              }
              readOnly={!withinOrg}
            />
          )}
          <Form.TextArea
            required
            name="description"
            label="Description"
            placeholder="Tell us more about your data template ..."
            value={formikProps.values.description}
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            error={
              formikProps.touched.description !== undefined &&
              formikProps.errors.description
            }
            readOnly={!withinOrg}
          />
        </Fragment>
      )}
      {currentStep === 1 && (
        <Fragment>
          <Input
            floated="left"
            icon="search"
            iconPosition="left"
            placeholder="Search fields"
            disabled={fieldData.length === 0}
            onChange={(e, {value}) => {
              setSearch(value);
            }}
            value={search}
          />
          <span className="pl-16 pr-5">Filter by:</span>
          <Dropdown
            selection
            clearable
            placeholder="Field Types"
            disabled={fieldData.length === 0}
            value={filter}
            options={dataTypeOptions}
            onChange={(ev, data) => {
              setFilter(data.value);
            }}
          />
          {withinOrg && (
            <>
              <Button
                compact
                primary
                size="large"
                floated="right"
                icon="upload"
                labelPosition="right"
                content="Import Fields"
                as="label"
                htmlFor="file"
              />
              <input
                hidden
                multiple
                id="file"
                type="file"
                onChange={e => handleUpload(e.target.files[0])}
              />
              <Button
                content="Add Field"
                floated="right"
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newId = Math.random()
                    .toString(36)
                    .substring(2, 15);
                  const newField = {
                    accepted_values: null,
                    data_type: '',
                    description: '',
                    instructions: '',
                    key: null,
                    label: '',
                    missing_values: null,
                    required: false,
                    tempId: newId,
                  };
                  setEditing([newId, ...editing]);
                  setFieldData([newField, ...fieldData]);
                }}
              />
            </>
          )}
          <Table celled>
            <Table.Header>
              <HeaderRow editable={withinOrg} />
            </Table.Header>
            {fieldData.length > 0 ? (
              <Table.Body>
                {filtered.map((f, index) => (
                  <Fragment key={f.tempId + String(index)}>
                    {editing.includes(f.tempId) ? (
                      <EditRow
                        field={f}
                        editing={editing}
                        setEditing={setEditing}
                        fieldData={fieldData}
                        setFieldData={setFieldData}
                        editable={withinOrg}
                      />
                    ) : (
                      <DisplayRow
                        field={f}
                        editing={editing}
                        setEditing={setEditing}
                        fieldData={fieldData}
                        setFieldData={setFieldData}
                        editable={withinOrg}
                      />
                    )}
                  </Fragment>
                ))}
              </Table.Body>
            ) : (
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan="7" textAlign="center" disabled>
                    Please import your field definition file or click to add a
                    field
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            )}
          </Table>
        </Fragment>
      )}
      {currentStep === 2 && (
        <Grid verticalAlign="middle" centered>
          <Grid.Column width={5}>
            <Card fluid>
              <Card.Content>
                <Header as="h4">Template</Header>
              </Card.Content>
              <Card.Content>
                <Header
                  as="h4"
                  icon
                  disabled={
                    formikProps.values.name.length === 0 ||
                    formikProps.values.description.length === 0
                  }
                >
                  <Icon name={formikProps.values.icon || 'question'} />
                  {formikProps.values.name ||
                    'Please input the data template name from step 1'}
                  <Header.Subheader>
                    {formikProps.values.description ||
                      'Please input the data template description from step 1'}
                  </Header.Subheader>
                </Header>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={1}>
            <Icon name="arrow right" size="big" color="grey" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content className="text-right">
                <Header as="h4" floated="left" className="noMargin">
                  Studies
                </Header>
                {withinOrg && (
                  <Checkbox
                    label="Select All"
                    checked={studySelect.length === studyList.length}
                    onChange={() => onSelectAll()}
                  />
                )}
              </Card.Content>
              <Card.Content>
                {studyList.length > 0 ? (
                  studyList
                    .filter(
                      ({node}) =>
                        node.organization.id ===
                        (formikProps.values.organization.id
                          ? formikProps.values.organization.id
                          : currentOrg.id),
                    )
                    .map(({node}) => (
                      <Label
                        as={Button}
                        basic
                        fluid
                        className="mb-5 text-left"
                        key={node.id}
                        color={studySelect.includes(node.id) ? 'blue' : 'grey'}
                        onClick={() => {
                          if (withinOrg) {
                            onSelectOne(node.id);
                          }
                        }}
                      >
                        <Icon name="server" />
                        <span
                          className={
                            studySelect.includes(node.id)
                              ? 'text-black pr-5'
                              : 'text-grey pr-5'
                          }
                        >
                          {node.name}
                        </span>
                        <code className="text-grey text-normal">
                          {node.kfId}
                        </code>
                      </Label>
                    ))
                ) : studyError ? (
                  <span className="text-red">{studyError.message}</span>
                ) : (
                  <span className="text-grey">No study data avalilable</span>
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      )}
    </Form>
  );
};

export default DataTemplateForm;
