import React from 'react';
import {Button, Container, Header, Image, List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import CopyButton from '../CopyButton/CopyButton';

const TokenList = ({tokens, deleteToken}) => (
  <List relaxed>
    {tokens.map(node => (
      <List.Item key={node.node.id}>
        <List.Content floated="right">
          <Button icon negative onClick={() => deleteToken(node.node.name)}>
            <Icon name="trash" />
          </Button>
        </List.Content>
        <List.Content floated="right">
          <Header size="tiny" block>
            {node.node.token} <CopyButton text={node.node.token} />
          </Header>
        </List.Content>
        {node.node.creator && <Image avatar src={node.node.creator.picture} />}
        <List.Content>
          <List.Header>{node.node.name}</List.Header>
          {node.node.creator && <>Created by {node.node.creator.username} </>}
          <TimeAgo live={false} date={node.node.createdAt} />
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default TokenList;
