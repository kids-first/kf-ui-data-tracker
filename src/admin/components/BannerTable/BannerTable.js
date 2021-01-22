import React from 'react';
import {Dimmer, Loader, Icon, Table, Segment, Header} from 'semantic-ui-react';

import ActionButtons from './ActionButtons';
import BannerDate from './BannerDate';
import Creator from './Creator';
import BannerMessage from './BannerMessage';
import Severity from './Severity';

const COLUMNS = [
  {key: 'message', name: 'Message'},
  {key: 'creator', name: 'Creator'},
  {key: 'severity', name: 'Severity'},
  {key: 'startDate', name: 'Start'},
  {key: 'endDate', name: 'End'},
  {key: 'enabled', name: 'Enabled'},
];

const BannerTable = ({loading, error, banners, handleDelete, handleEdit}) => {
  // Banners still loading
  if (loading) {
    return (
      <Segment padded="very">
        <Dimmer active inverted>
          <Loader inverted>Loading banners...</Loader>
        </Dimmer>
      </Segment>
    );
  }

  // Add new banner placeholder
  if (banners.length === 0) {
    return (
      <Segment placeholder>
        <Header icon>
          <Icon color="grey" name="announcement" />
          Add a banner to display on Data Tracker
        </Header>
      </Segment>
    );
  }

  // Table header
  const headerCells = COLUMNS.map((item) => (
    <Table.HeaderCell key={item.key}>{item.name}</Table.HeaderCell>
  ));

  // Banner table
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          {headerCells}
          <Table.HeaderCell key="actions">Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {banners.map(({node}) => (
          <Table.Row key={node.id}>
            <BannerMessage key={node.id + 'message'} message={node.message} />
            <Creator
              key={node.id + 'creator'}
              displayName={node.creator.displayName}
              picture={node.creator.picture}
            />
            <Severity key={node.id + 'severity'} severity={node.severity} />
            <BannerDate key={node.id + 'startDate'} date={node.startDate} />
            <BannerDate key={node.id + 'endDate'} date={node.endDate} />
            <Table.Cell singleLine>
              <Icon
                name="check"
                color={node.enabled === true ? 'green' : 'grey'}
                size="large"
              />
            </Table.Cell>
            <ActionButtons
              key={node.id + 'actions'}
              handleDelete={() => handleDelete(node.id)}
              handleEdit={() => handleEdit(node.id)}
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default BannerTable;
