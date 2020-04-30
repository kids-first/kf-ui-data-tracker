import React from 'react';
import {Checkbox, Icon, Item, Popup} from 'semantic-ui-react';

const ColumnSelector = ({columns, onChange}) => {
  const change = col => {
    const colIndex = columns.findIndex(c => c.key === col);
    columns[colIndex].visible = !columns[colIndex].visible;
    onChange(columns);
  };

  const selected = columns.filter(col => col.visible).map(col => col.key);

  return (
    <Popup
      basic
      position="bottom center"
      on="click"
      trigger={
        <span className="ui dropdown">
          Change Columns
          <Icon name="dropdown" />
        </span>
      }
      header="Select Columns to Display"
      content={columns.map(col => (
        <Item key={col.key}>
          <Checkbox
            label={col.name}
            checked={selected.includes(col.key)}
            onChange={() => change(col.key)}
          />
        </Item>
      ))}
    />
  );
};

export default ColumnSelector;
