import React, {useState} from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Icon, Popup, Table} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const KfId = ({kfId}) => {
  const [copied, setCopied] = useState(false);

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'kfid']
          : ['kfid'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top left"
          trigger={
            <CopyToClipboard
              text={kfId}
              onCopy={() => {
                setCopied(true);
                logEvent('copy');
                setTimeout(() => {
                  setCopied(false);
                }, 700);
              }}
            >
              <Table.Cell singleLine width="1">
                <code>{kfId}</code>
              </Table.Cell>
            </CopyToClipboard>
          }
          content={
            copied ? <Icon name="check" color="green" /> : 'Copy to clipboard'
          }
        />
      )}
    </Amplitude>
  );
};

export default KfId;
