import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Card,
  Header,
  Icon,
  Menu,
  Popup,
  Segment,
  Image,
  Table,
} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {formatFileSize, downloadFile, lengthLimit} from '../../utilities';

/**
 * Displays study document version in card format
 */

const VersionCard = ({version, downloadFileMutation, studyId, fileId}) => {
  const [copied, setCopied] = useState('');
  return (
    <Card fluid className="mt-6">
      <Card.Content className="py-14" floated="left">
        <Menu
          as={Segment}
          secondary
          compact
          floated="right"
          className="noPadding min-h-22"
        >
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'preview button']
                : ['button', 'preview button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                content="Preview this Version"
                position="top left"
                inverted
                trigger={
                  <Menu.Item
                    className="p-5 noMargin"
                    onClick={e => {
                      logEvent('click');
                      e.stopPropagation();
                      window.open(
                        `/study/${studyId}/documents/${fileId}/versions/${version.kfId}`,
                      );
                    }}
                  >
                    <Icon name="eye" />
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'download button']
                : ['button', 'download button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                inverted
                position="top left"
                content="Download this version"
                trigger={
                  <Menu.Item
                    className="p-5 noMargin"
                    onClick={e => {
                      logEvent('click');
                      e.stopPropagation();
                      downloadFile(
                        studyId,
                        fileId,
                        version.kfId,
                        downloadFileMutation,
                      );
                    }}
                  >
                    <Icon name="download" />
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [
                    ...inheritedProps.scope,
                    'button',
                    'copy download url button',
                  ]
                : ['button', 'copy download url button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                inverted
                position="top left"
                content={
                  copied === 'url' ? (
                    <Icon name="checkmark" color="green" />
                  ) : (
                    'Copy download link'
                  )
                }
                trigger={
                  <CopyToClipboard
                    text={version.downloadUrl}
                    onCopy={() => {
                      logEvent('click');
                      setCopied('url');
                      setTimeout(() => {
                        setCopied('');
                      }, 700);
                    }}
                  >
                    <Menu.Item className="p-5 noMargin">
                      <Icon name="copy" />
                    </Menu.Item>
                  </CopyToClipboard>
                }
              />
            )}
          </Amplitude>
        </Menu>
        <Header as="h5" floated="left" className="noMargin">
          {lengthLimit(version.fileName, 70)}
        </Header>
        <Card.Meta className="noMargin ml-10">
          {version.size ? formatFileSize(version.size, true) : 'Size Unknown'}
        </Card.Meta>
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'copy version ID button']
              : ['button', 'copy version ID button'],
          })}
        >
          {({logEvent}) => (
            <Popup
              inverted
              position="top left"
              content={
                copied === 'id' ? (
                  <Icon name="checkmark" color="green" />
                ) : (
                  'Copy version ID'
                )
              }
              trigger={
                <CopyToClipboard
                  text={version.kfId}
                  onCopy={() => {
                    logEvent('click');
                    setCopied('id');
                    setTimeout(() => {
                      setCopied('');
                    }, 700);
                  }}
                >
                  <Card.Meta as="a" className="noMargin ml-10">
                    <code>{version.kfId}</code>
                  </Card.Meta>
                </CopyToClipboard>
              }
            />
          )}
        </Amplitude>
        <Card.Description>
          <Segment basic secondary className="x-scroll">
            <Markdown
              source={version.description || 'No version summary added ...'}
              renderers={{
                image: Image,
                table: props => <Table>{props.children}</Table>,
              }}
              linkTarget="_blank"
            />
          </Segment>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default VersionCard;
