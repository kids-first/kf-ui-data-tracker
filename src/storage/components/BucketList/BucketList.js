import React from 'react';
import {List, Statistic} from 'semantic-ui-react';
import {formatFileSize} from '../../../documents/utilities';

const BucketItem = ({bucket}) => {
  const hasInventory = bucket.inventories.edges.length > 0;

  return (
    <List.Item key={bucket.id}>
      {hasInventory && (
        <List.Content floated="right">
          <Statistic
            size="tiny"
            value={formatFileSize(bucket.inventories.edges[0].node.totalBytes)}
          />
        </List.Content>
      )}
      <List.Icon name="aws" size="large" verticalAlign="middle" />
      <List.Content>
        <List.Header>{bucket.name}</List.Header>
        <List.Description>
          <List bulleted horizontal>
            <List.Item>{bucket.createdOn}</List.Item>
            {bucket.study && <List.Item>{bucket.study.kfId}</List.Item>}
            {bucket.study.shortName && (
              <List.Item>{bucket.study.shortName}</List.Item>
            )}
          </List>
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

const BucketList = ({buckets}) => {
  if (!buckets) return 'Loading';

  return (
    <List divided>
      {buckets.map(({node}, i) => (
        <BucketItem bucket={node} />
      ))}
    </List>
  );
};

export default BucketList;
