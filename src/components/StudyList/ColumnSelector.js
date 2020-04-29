import React from 'react';
import {Checkbox, Icon, Item, Popup} from 'semantic-ui-react';

const ColumnSelector = ({selected, available, onChange}) => {
  const change = col => {
    if (selected.includes(col)) {
      selected.splice(selected.indexOf(col), 1);
      onChange([...selected]);
    } else {
      onChange([...selected, col]);
    }
  };

  return (
    <Popup
      basic
      position="bottom"
      on="click"
      trigger={
        <span className="ui dropdown">
          Change Columns
          <Icon name="dropdown" />
        </span>
      }
      header="Select Columns to Display"
      content={Object.keys(available).map(col => (
        <Item key={col}>
          <Checkbox
            label={available[col]}
            checked={selected.includes(col)}
            onChange={() => change(col)}
          >
            {col}
          </Checkbox>
        </Item>
      ))}
    />
  );
};

export default ColumnSelector;
