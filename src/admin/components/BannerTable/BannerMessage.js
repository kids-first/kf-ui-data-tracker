import React from 'react';
import {Icon, Table} from 'semantic-ui-react';

const BannerMessage = ({message}) => (
  <Table.Cell>
    <Icon name="announcement" color="grey" />
    {message}
  </Table.Cell>
);

export default BannerMessage;
