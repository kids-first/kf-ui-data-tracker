import React from 'react';
import {Header, Loader, List, Icon, Image, Table} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import {longDate} from '../../../common/dateUtils';

const ReleaseList = ({loading, releases}) => {
  const coordUrl = process.env.REACT_APP_COORD_UI + 'releases/';

  if (loading) {
    return <Loader>Loading...</Loader>;
  }

  if (!loading && releases.length === 0) {
    return (
      <Header disabled textAlign="center" as="h4">
        No releases data available for current study.
      </Header>
    );
  }

  return (
    <List divided>
      {releases.map(r => (
        <List.Item>
          <List.Icon name="tag" verticalAlign="middle" />
          <List.Content>
            <List.Header>
              <a
                className="text-blue"
                as="a"
                href={`${coordUrl + r.node.kfId}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {r.node.version + ' - ' + r.node.name + ' '}
              </a>
              <Icon link size="small" name="external" />
            </List.Header>
            <List.Description>on {longDate(r.node.createdAt)}</List.Description>
            <List.Description>
              <Markdown
                source={r.node.description}
                renderers={{
                  image: Image,
                  table: props => <Table>{props.children}</Table>,
                }}
              />
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default ReleaseList;
