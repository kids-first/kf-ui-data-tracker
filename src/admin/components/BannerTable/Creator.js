import React from 'react';
import {Label, Table} from 'semantic-ui-react';

import defaultAvatar from '../../../assets/defaultAvatar.png';

const Creator = ({displayName, picture, id}) => (
  <Table.Cell singleLine>
    <Label image className="ml-0">
      <img alt={displayName} src={picture || defaultAvatar} />
      {displayName}
    </Label>
  </Table.Cell>
);

export default Creator;
