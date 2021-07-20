import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Table, Checkbox, Popup} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import fontawesome from '@fortawesome/fontawesome';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckSquare, faQuestion} from '@fortawesome/fontawesome-free-solid';

/**
 * Data template list displays admin created templates for file process
 */

fontawesome.library.add(faCheckSquare, faQuestion);

const TemplateList = ({templates, selection, setSelection}) => {
  const [sorting, setSorting] = useState({
    column: 'modifiedAt',
    direction: 'descending',
  });

  const dateSort = (a, b) => new Date(a) - new Date(b);
  const stringSort = (a, b) =>
    a !== null && b !== null ? a.localeCompare(b) : 0;
  const columnSorts = {
    name: (f1, f2) =>
      stringSort(f1.node.dataTemplate.name, f2.node.dataTemplate.name),
    description: (f1, f2) =>
      stringSort(f1.node.description, f2.node.dataTemplate.description),
    modifiedAt: (f1, f2) =>
      dateSort(
        f1.node.dataTemplate.modifiedAt,
        f2.node.dataTemplate.modifiedAt,
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

  const onSelectOne = templateId => {
    if (selection.includes(templateId)) {
      setSelection(selection.filter(id => id !== templateId));
    } else {
      setSelection([...selection, templateId]);
    }
  };
  const onSelectAll = () => {
    if (selection.length === ordered.length) {
      setSelection([]);
    } else {
      setSelection(ordered.map(({node}) => node.id));
    }
  };

  return (
    <Table singleLine stackable selectable sortable compact celled>
      <Table.Header>
        <Table.Row>
          {setSelection && (
            <Table.HeaderCell
              textAlign="center"
              width="1"
              onClick={e => {
                e.stopPropagation();
                onSelectAll();
              }}
            >
              <Checkbox checked={selection.length === ordered.length} />
            </Table.HeaderCell>
          )}
          <Table.HeaderCell textAlign="center" width="1">
            Icon
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sorting.column === 'name' ? sorting.direction : null}
            onClick={handleSort('name')}
            className="px-20"
          >
            Name
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sorting.column === 'description' ? sorting.direction : null}
            onClick={handleSort('description')}
          >
            Description
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={sorting.column === 'modifiedAt' ? sorting.direction : null}
            textAlign="center"
            width="1"
            onClick={handleSort('modifiedAt')}
          >
            Last Modified
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ordered.map(({node}) => (
          <Table.Row
            key={node.id}
            className="cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              onSelectOne(node.id);
            }}
          >
            {setSelection && (
              <Table.Cell
                textAlign="center"
                onClick={e => {
                  e.stopPropagation();
                  onSelectOne(node.id);
                }}
              >
                <Checkbox
                  data-testid="file-select"
                  checked={selection.includes(node.id)}
                />
              </Table.Cell>
            )}
            <Table.Cell textAlign="center">
              <FontAwesomeIcon icon={node.dataTemplate.icon || 'question'} />
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
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

TemplateList.propTypes = {
  /** Array of event object*/
  templateList: PropTypes.array,
};

TemplateList.defaultProps = {
  templateList: [],
};

export default TemplateList;
