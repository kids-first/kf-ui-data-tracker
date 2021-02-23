import React from 'react';
import {Popup, Table} from 'semantic-ui-react';

const InvestigatorName = ({investigatorName}) => {
  // Return an empty cell
  if (!investigatorName)
    return (
      <Table.Cell singleLine width="1">
        -
      </Table.Cell>
    );
  // Return the full investigator's name
  if (investigatorName.length <= 20)
    return (
      <Table.Cell singleLine width="1">
        {investigatorName}
      </Table.Cell>
    );

  // The name is too long so truncate and put full content in a popup
  const name = investigatorName.substring(0, 20);
  return (
    <Popup
      inverted
      hoverable
      position="top center"
      trigger={
        <Table.Cell
          singleLine
          width="1"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {name}...
        </Table.Cell>
      }
      content={investigatorName}
    />
  );
};

export default InvestigatorName;
