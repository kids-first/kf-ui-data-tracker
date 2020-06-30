import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Header, Icon, Segment} from 'semantic-ui-react';

/**
 * Step 3 in multi-step uplaod modal.
 * Confirmation screen that closes after a 3 second timer.
 */
const SuccessStep = ({fileToUpdate, handleCloseDialog, history, seconds}) => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="check" color="green" />
        Updated Document {fileToUpdate.name}
      </Header>
      <Segment.Inline>
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'view document button']
              : ['button', 'view document button'],
          })}
        >
          {({logEvent}) => (
            <Button
              primary
              onClick={() => {
                logEvent('click');
                history.push(
                  `${window.location.pathname}/${fileToUpdate.kfId}`,
                );
              }}
            >
              View Document
            </Button>
          )}
        </Amplitude>
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'close modal button']
              : ['button', 'close modal button'],
          })}
        >
          {({logEvent}) => (
            <Button
              onClick={() => {
                logEvent('click');
                handleCloseDialog();
              }}
            >
              Exit ({3 - seconds})
            </Button>
          )}
        </Amplitude>
      </Segment.Inline>
    </Segment>
  );
};

SuccessStep.propTypes = {
  /** Existing study file node that version was created for */
  fileToUpdate: PropTypes.object.isRequired,
  /** Function to close modal  */
  handleCloseDialog: PropTypes.func,
  /** Rect-router history object  */
  history: PropTypes.object,
  /** Incrementing integer for countdown time to close modal */
  seconds: PropTypes.number.isRequired,
};

const TrackedSuccessStep = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'upload success step']
        : ['upload success step'],
    })}
  >
    <SuccessStep {...props} />
  </Amplitude>
);

export default TrackedSuccessStep;
