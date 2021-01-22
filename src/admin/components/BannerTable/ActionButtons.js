import React from 'react';
import {
  Icon,
  Divider,
  Responsive,
  Popup,
  Button,
  Table,
} from 'semantic-ui-react';

const ActionButtons = ({handleDelete, handleEdit}) => (
  <Table.Cell>
    <Button.Group basic size="small">
      {/* Edit Banner */}
      <Popup
        content="Edit banner"
        trigger={<Button icon="edit" onClick={(e) => handleEdit()} />}
      />
      {/* Delete Banner */}
      <Popup
        trigger={
          <Responsive
            as={Button}
            minWidth={Responsive.onlyTablet.minWidth}
            basic
            compact
            onClick={(e) => e.stopPropagation()}
            icon={<Icon name="trash alternate" />}
          />
        }
        header="Are you sure?"
        content={
          <>
            This banner will be deleted
            <Divider />
            <Button
              negative
              fluid
              icon={<Icon name="trash alternate" />}
              content="Delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
          </>
        }
        on="click"
        position="top right"
      />
      ;
    </Button.Group>
  </Table.Cell>
);

export default ActionButtons;
