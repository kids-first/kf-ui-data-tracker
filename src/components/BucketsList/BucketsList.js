import React from 'react';
import TimeAgo from 'react-timeago';
import {Header, Icon, List} from 'semantic-ui-react';

const BucketsList = ({buckets}) => (
  <List divided>
    {[...buckets]
      .sort((n1, n2) => {
        if (n1.node.deleted && !n2.node.deleted) {
          return 1;
        } else if (!n1.node.deleted && n2.node.deleted) {
          return -1;
        } else {
          if (!n1.node.study && n2.node.study) {
            return 1;
          } else if (n1.node.study && !n2.node.study) {
            return -1;
          } else {
            if (n1.node.study && n1.node.study) {
              return n1.node.study.kfId.localeCompare(n2.node.study.kfId);
            } else {
              return n1.node.name.localeCompare(n2.node.name);
            }
          }
        }
      })
      .map(({node}) => (
        <List.Item disabled={node.deleted} key={node.name}>
          <List.Content>
            {node.study && (
              <List.Content floated="right">
                <List.Header as={Header} size="tiny" textAlign="right">
                  {node.study.kfId}
                </List.Header>
                <List.Description>{node.study.name}</List.Description>
              </List.Content>
            )}
            <List.Header>{node.name}</List.Header>
            <List.Description>
              <List horizontal bulleted>
                <List.Item>
                  Created <TimeAgo date={node.createdOn} live={false} />
                </List.Item>
                {node.deleted && (
                  <List.Item>
                    <Icon name="warning" fitted color="red" /> Deleted
                  </List.Item>
                )}
              </List>
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
  </List>
);

export default BucketsList;
