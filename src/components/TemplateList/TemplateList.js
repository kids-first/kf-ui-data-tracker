import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Checkbox,
  Popup,
  Icon,
  Image,
  Dropdown,
  Button,
  Input,
  Divider,
  Segment,
  Header,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import {dataTemplateIcons} from '../../common/enums';
import {dateSort, stringSort, booleanSort} from '../../common/sortUtils';

/**
 * Data template list displays admin created templates for file process
 */
const TemplateList = ({
  templates,
  selection,
  setSelection,
  setOpen,
  organization,
  setFieldValue,
  setFieldData,
  setStudySelect,
  deleteDataTemplate,
  organizationsList,
}) => {
  const [sorting, setSorting] = useState({
    column: 'modifiedAt',
    direction: 'descending',
  });
  const [filter, setFilter] = useState(organization.id);
  const [search, setSearch] = useState('');

  const defaultLogo =
    'https://raw.githubusercontent.com/kids-first/kf-ui-data-tracker/master/src/assets/logo.svg';

  const columnSorts = {
    name: (f1, f2) =>
      stringSort(f1.node.dataTemplate.name, f2.node.dataTemplate.name),
    description: (f1, f2) =>
      stringSort(
        f1.node.dataTemplate.description,
        f2.node.dataTemplate.description,
      ),
    modifiedAt: (f1, f2) =>
      dateSort(
        f1.node.dataTemplate.modifiedAt,
        f2.node.dataTemplate.modifiedAt,
      ),
    organization: (f1, f2) =>
      stringSort(
        f1.node.dataTemplate.organization.name,
        f2.node.dataTemplate.organization.name,
      ),
    studies: (f1, f2) =>
      booleanSort(
        f1.node.studies && f1.node.studies.edges.length > 0,
        f2.node.studies && f2.node.studies.edges.length > 0,
      ),
  };

  const handleSort = column => () => {
    const direction =
      sorting.column !== column
        ? 'ascending'
        : sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSorting({
      column,
      direction,
    });
  };

  const sorted = templates
    .concat()
    .sort(
      (f1, f2) =>
        columnSorts.hasOwnProperty(sorting.column) &&
        columnSorts[sorting.column](f1, f2),
    );
  const ordered = sorting.direction === 'ascending' ? sorted : sorted.reverse();
  const searched =
    search.length > 0
      ? ordered.filter(obj =>
          [obj.node.dataTemplate.name, obj.node.dataTemplate.description]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
      : ordered;
  const filtered =
    filter.length > 0
      ? searched.filter(obj => obj.node.dataTemplate.organization.id === filter)
      : searched;

  const onSelectOne = templateId => {
    if (selection.includes(templateId)) {
      setSelection(selection.filter(id => id !== templateId));
    } else {
      setSelection([...selection, templateId]);
    }
  };
  const onSelectAll = () => {
    if (selection.length === filtered.length) {
      setSelection([]);
    } else {
      setSelection(
        filtered.map(
          ({node}) =>
            Buffer.from(node.id, 'base64')
              .toString('utf8')
              .split(':')[1],
        ),
      );
    }
  };

  const orgOpt = organizationsList
    ? organizationsList.map(({node}) => ({
        key: node.id,
        text: node.name,
        value: node.id,
        image: {
          avatar: true,
          src: node.image || defaultLogo,
        },
      }))
    : [];
  const orgOptions = orgOpt.sort((o1, o2) => stringSort(o1.text, o2.text));

  return (
    <>
      {!setSelection && (
        <>
          <Input
            floated="left"
            icon="search"
            iconPosition="left"
            placeholder="Search templates..."
            disabled={templates.length === 0}
            onChange={(e, {value}) => {
              setSearch(value);
            }}
            value={search}
          />
          <span className="pl-16 pr-5">Filter by:</span>
          <Dropdown
            selection
            clearable
            placeholder="Organizations"
            disabled={templates.length === 0}
            value={filter}
            options={orgOptions}
            onChange={(ev, data) => {
              setFilter(data.value);
            }}
          />
          {setOpen && (
            <Button
              primary
              floated="right"
              content="Create"
              icon="add"
              labelPosition="right"
              onClick={() => {
                setFieldValue('id', null);
                setFieldValue('name', '');
                setFieldValue('description', '');
                setFieldValue('icon', 'file excel');
                setFieldValue('organization', organization);
                setOpen('Create');
              }}
            />
          )}
        </>
      )}
      {templates.length > 0 ? (
        <Table
          singleLine
          stackable
          selectable
          sortable
          compact
          celled
          className="mb-50"
        >
          <Table.Header>
            <Table.Row>
              {setSelection ? (
                <Table.HeaderCell
                  textAlign="center"
                  width="1"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectAll();
                  }}
                >
                  <Checkbox checked={selection.length === filtered.length} />
                </Table.HeaderCell>
              ) : (
                <Table.HeaderCell
                  textAlign="center"
                  width="1"
                  sorted={
                    sorting.column === 'organization' ? sorting.direction : null
                  }
                  onClick={handleSort('organization')}
                >
                  Org
                </Table.HeaderCell>
              )}
              <Table.HeaderCell textAlign="center" width="1">
                Icon
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sorting.column === 'name' ? sorting.direction : null}
                onClick={handleSort('name')}
              >
                Name
              </Table.HeaderCell>
              {!setSelection && (
                <Table.HeaderCell
                  width="1"
                  sorted={
                    sorting.column === 'studies' ? sorting.direction : null
                  }
                  onClick={handleSort('studies')}
                >
                  Used in Studies
                </Table.HeaderCell>
              )}
              <Table.HeaderCell
                sorted={
                  sorting.column === 'description' ? sorting.direction : null
                }
                onClick={handleSort('description')}
              >
                Description
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorting.column === 'modifiedAt' ? sorting.direction : null
                }
                textAlign="center"
                width="1"
                onClick={handleSort('modifiedAt')}
              >
                Last Modified
              </Table.HeaderCell>
              {!setSelection && (
                <Table.HeaderCell textAlign="center" width="1">
                  Actions
                </Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.length > 0 ? (
              filtered.map(({node}) => (
                <Table.Row
                  key={node.id}
                  className="cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    if (setSelection) {
                      onSelectOne(
                        Buffer.from(node.id, 'base64')
                          .toString('utf8')
                          .split(':')[1],
                      );
                    }
                  }}
                >
                  {setSelection ? (
                    <Table.Cell textAlign="center">
                      <Checkbox
                        data-testid="file-select"
                        checked={selection.includes(
                          Buffer.from(node.id, 'base64')
                            .toString('utf8')
                            .split(':')[1],
                        )}
                      />
                    </Table.Cell>
                  ) : (
                    <Popup
                      position="top center"
                      content={node.dataTemplate.organization.name}
                      trigger={
                        <Table.Cell textAlign="center">
                          <Image
                            avatar
                            src={
                              node.dataTemplate.organization.image ||
                              defaultLogo
                            }
                          />
                        </Table.Cell>
                      }
                    />
                  )}
                  <Table.Cell textAlign="center">
                    <Icon
                      name={
                        node.dataTemplate.icon &&
                        dataTemplateIcons.includes(node.dataTemplate.icon)
                          ? node.dataTemplate.icon
                          : 'file outline'
                      }
                    />
                  </Table.Cell>
                  <Popup
                    position="top center"
                    disabled={node.dataTemplate.name.length <= 50}
                    content={node.dataTemplate.name}
                    trigger={
                      <Table.Cell>
                        {node.dataTemplate.name.substring(0, 50)}
                        {node.dataTemplate.name.length > 50 && '...'}
                      </Table.Cell>
                    }
                  />
                  {!setSelection && (
                    <Table.Cell
                      textAlign="center"
                      sorted={
                        sorting.column === 'studies' ? sorting.direction : null
                      }
                      onClick={handleSort('studies')}
                    >
                      {node.studies && node.studies.edges.length > 0 ? (
                        <Icon name="check" />
                      ) : (
                        <Icon name="window minimize outline" />
                      )}
                    </Table.Cell>
                  )}
                  <Popup
                    wide
                    position="top center"
                    disabled={node.dataTemplate.description.length <= 75}
                    content={node.dataTemplate.description}
                    trigger={
                      <Table.Cell>
                        {node.dataTemplate.description.substring(0, 75)}
                        {node.dataTemplate.description.length > 75 && '...'}
                      </Table.Cell>
                    }
                  />
                  <Table.Cell textAlign="center">
                    <TimeAgo
                      date={node.dataTemplate.modifiedAt}
                      live={false}
                      title={longDate(node.dataTemplate.modifiedAt)}
                    />
                  </Table.Cell>
                  {!setSelection && (
                    <Table.Cell textAlign="center">
                      {organization.id === node.dataTemplate.organization.id ? (
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
                                  setFieldValue('id', node.dataTemplate.id);
                                  setFieldValue('versionId', node.id);
                                  setFieldValue('name', node.dataTemplate.name);
                                  setFieldValue(
                                    'description',
                                    node.dataTemplate.description,
                                  );
                                  setFieldValue(
                                    'icon',
                                    node.dataTemplate.icon || '',
                                  );
                                  setFieldValue(
                                    'organization',
                                    node.dataTemplate.organization.id,
                                  );
                                  setFieldValue('origin', {
                                    name: node.dataTemplate.name,
                                    description: node.dataTemplate.description,
                                    icon: node.dataTemplate.icon || '',
                                    organization:
                                      node.dataTemplate.organization.id,
                                  });
                                  setFieldValue('organization', {
                                    id: node.dataTemplate.organization.id,
                                    name: node.dataTemplate.organization.name,
                                    image: node.dataTemplate.organization.image,
                                  });
                                  setFieldValue(
                                    'fieldDefinitions',
                                    node.fieldDefinitions,
                                  );
                                  const fieldDefinitions = JSON.parse(
                                    node.fieldDefinitions,
                                  ).fields.map((f, index) => ({
                                    ...f,
                                    tempId: String(index),
                                  }));
                                  setFieldValue(
                                    'existFields',
                                    fieldDefinitions,
                                  );
                                  setFieldData(fieldDefinitions);
                                  const studyList =
                                    node.studies &&
                                    node.studies.edges.length > 0
                                      ? node.studies.edges.map(
                                          ({node}) => node.id,
                                        )
                                      : [];
                                  setFieldValue('studies', studyList);
                                  setStudySelect(studyList);
                                  setOpen('Save');
                                }}
                              />
                            }
                          />
                          <Popup
                            position="top center"
                            header="Are you sure?"
                            content={
                              <>
                                You can only delete templates that are not being
                                used by any studies
                                <Divider />
                                <Button
                                  negative
                                  fluid
                                  disabled={node.studies.edges.length > 0}
                                  icon={<Icon name="trash alternate" />}
                                  content="Delete"
                                  onClick={e => {
                                    deleteDataTemplate({
                                      variables: {id: node.dataTemplate.id},
                                    });
                                    e.stopPropagation();
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
                      ) : (
                        <Button.Group>
                          <Popup
                            inverted
                            position="top center"
                            content="View"
                            trigger={
                              <Button
                                basic
                                compact
                                icon="eye"
                                onClick={e => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setFieldValue('id', node.dataTemplate.id);
                                  setFieldValue('versionId', node.id);
                                  setFieldValue('name', node.dataTemplate.name);
                                  setFieldValue(
                                    'description',
                                    node.dataTemplate.description,
                                  );
                                  setFieldValue(
                                    'icon',
                                    node.dataTemplate.icon || '',
                                  );
                                  setFieldValue(
                                    'organization',
                                    node.dataTemplate.organization.id,
                                  );
                                  setFieldValue('origin', {
                                    name: node.dataTemplate.name,
                                    description: node.dataTemplate.description,
                                    icon: node.dataTemplate.icon || '',
                                    organization:
                                      node.dataTemplate.organization.id,
                                  });
                                  setFieldValue('organization', {
                                    id: node.dataTemplate.organization.id,
                                    name: node.dataTemplate.organization.name,
                                    image: node.dataTemplate.organization.image,
                                  });
                                  setFieldValue(
                                    'fieldDefinitions',
                                    node.fieldDefinitions,
                                  );
                                  const fieldDefinitions = JSON.parse(
                                    node.fieldDefinitions,
                                  ).fields.map((f, index) => ({
                                    ...f,
                                    tempId: String(index),
                                  }));
                                  setFieldValue(
                                    'existFields',
                                    fieldDefinitions,
                                  );
                                  setFieldData(fieldDefinitions);
                                  const studyList =
                                    node.studies &&
                                    node.studies.edges.length > 0
                                      ? node.studies.edges.map(
                                          study => study.node.id,
                                        )
                                      : [];
                                  setFieldValue('studies', studyList);
                                  setStudySelect(studyList);
                                  setOpen('Save');
                                }}
                              />
                            }
                          />
                        </Button.Group>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            ) : (
              <Table.Row disabled>
                <Table.Cell colSpan="6" textAlign="center" className="py-14">
                  No data templates matching your search term. Try searching by
                  template name or description.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      ) : (
        <Segment placeholder>
          <Header icon disabled>
            <Icon name="file outline" />
            No data templates created
          </Header>
        </Segment>
      )}
    </>
  );
};

TemplateList.propTypes = {
  templateList: PropTypes.array,
};

TemplateList.defaultProps = {
  templateList: [],
};

export default TemplateList;
