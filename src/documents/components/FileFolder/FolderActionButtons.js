import {Button, Icon, Popup} from 'semantic-ui-react';

import {Amplitude} from '@amplitude/react-amplitude';
import React from 'react';

/**
 * Simple Icon Buttons to edit folder name, add subfolder and remove folder
 */
const FolderActionButtons = ({
  fileNode,
  setRenameOpen,
  setInputOpen,
  setDeleteOpen,
}) => {
  return (
    <Button.Group fluid size="small">
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'edit folder name button']
            : ['button', 'edit folder name button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="top left"
            content="Edit folder name"
            trigger={
              <Button
                basic
                compact
                icon="pencil"
                onClick={e => {
                  logEvent('click');
                  e.stopPropagation();
                  setRenameOpen(fileNode);
                }}
              />
            }
          />
        )}
      </Amplitude>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'add subfolder button']
            : ['button', 'add subfolder button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="top left"
            content="Add subfolder"
            trigger={
              <Button
                basic
                compact
                onClick={e => {
                  logEvent('click');
                  e.stopPropagation();
                  setInputOpen(fileNode.title);
                }}
                className="px-9"
              >
                <Icon.Group>
                  <Icon name="folder" />
                  <Icon corner name="add" />
                </Icon.Group>
              </Button>
            }
          />
        )}
      </Amplitude>

      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'remove folder button']
            : ['button', 'remove folder button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="top left"
            content="Remove folder"
            trigger={
              <Button
                basic
                compact
                icon="trash alternate"
                onClick={e => {
                  logEvent('click');
                  e.stopPropagation();
                  setDeleteOpen(fileNode);
                }}
              />
            }
          />
        )}
      </Amplitude>
    </Button.Group>
  );
};

export default FolderActionButtons;
