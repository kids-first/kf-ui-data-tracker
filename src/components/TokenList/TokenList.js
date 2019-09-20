import React from 'react';
import {Button, Popup, Image, Input, List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import defaultAvatar from '../../assets/defaultAvatar.png';

const TokenList = ({tokens, deleteToken}) => (
  <List relaxed>
    {tokens.map(node => (
      <List.Item key={node.node.id}>
        <Image
          avatar
          src={
            node.node.creator && node.node.creator.picture
              ? node.node.creator.picture
              : defaultAvatar
          }
          alt={
            node.node.creator && node.node.creator.username
              ? node.node.creator.username
              : 'unknown'
          }
        />
        <List.Content>
          <List.Header>{node.node.name}</List.Header>
          {node.node.creator && <>Created by {node.node.creator.username} </>}
          <TimeAgo live={false} date={node.node.createdAt} />
        </List.Content>
        <List.Content floated="right">
          <Input readOnly action value={node.node.token}>
            <input />
            {node.node.token.split('*').length !== 24 && (
              <Popup
                trigger={
                  <CopyToClipboard text={node.node.token}>
                    <Button icon>
                      <Icon name="copy" />
                    </Button>
                  </CopyToClipboard>
                }
                content="Copied!"
                on="click"
              />
            )}
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
