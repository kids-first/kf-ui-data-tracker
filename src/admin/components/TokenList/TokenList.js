import React from 'react';
import PropTypes from 'prop-types';
import {Button, Popup, Image, Input, List, Icon} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {longDate} from '../../../common/dateUtils';
/**
 * Token list is used to display tokens with the option of copy and delete
 */
const TokenList = ({tokens, deleteToken, newToken}) => (
  <List relaxed>
    {tokens &&
      tokens.length > 0 &&
      tokens.map(node => (
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
            <TimeAgo
              live={false}
              date={node.node.createdAt}
              title={longDate(node.node.createdAt)}
            />
          </List.Content>
          <List.Content floated="right">
            {newToken && node.node.id === newToken.id ? (
              <Input readOnly action value={newToken.token}>
                <input />
                <Popup
                  trigger={
                    <CopyToClipboard text={newToken.token}>
                      <Button icon>
                        <Icon name="copy" />
                      </Button>
                    </CopyToClipboard>
                  }
                  content="Copied!"
                  on="click"
                />
                <Button
                  icon
                  negative
                  onClick={() => deleteToken(node.node.name)}
                  data-testid="delete-token-button"
                >
                  <Icon name="trash" />
                </Button>
              </Input>
            ) : (
              <Input readOnly action value={node.node.token}>
                <input />
                <Button
                  icon
                  negative
                  onClick={() => deleteToken(node.node.name)}
                  data-testid="delete-token-button"
                >
                  <Icon name="trash" />
                </Button>
              </Input>
            )}
          </List.Content>
        </List.Item>
      ))}
  </List>
);

TokenList.propTypes = {
  /** Array of token object*/
  tokens: PropTypes.array,
  /** Action to delete token*/
  deleteToken: PropTypes.func,
  /** Newly created token when on the page*/
  newToken: PropTypes.object,
};

TokenList.defaultProps = {
  tokens: [],
};

export default TokenList;
