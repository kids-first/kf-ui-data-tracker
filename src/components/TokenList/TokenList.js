import React from 'react';
import {Button, Popup, Image, Input, List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const TokenList = ({tokens, deleteToken}) => (
  <List relaxed>
    {tokens.map(node => (
      <List.Item key={node.node.id}>
        {node.node.creator && <Image avatar src={node.node.creator.picture} />}
        <List.Content>
          <List.Header>{node.node.name}</List.Header>
          {node.node.creator && <>Created by {node.node.creator.username} </>}
          <TimeAgo live={false} date={node.node.createdAt} />
        </List.Content>
        <List.Content floated="right">
          <Input readOnly action value={node.node.token}>
            <input />
            <Popup
              trigger={
                <Button icon>
                  <CopyToClipboard text={node.node.token}>
                    <Icon name="copy" />
                  </CopyToClipboard>
                </Button>
              }
              content="Copied!"
              on="click"
            />
            <Button icon negative onClick={() => deleteToken(node.node.name)}>
              <Icon name="trash" />
            </Button>
          </Input>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default TokenList;
