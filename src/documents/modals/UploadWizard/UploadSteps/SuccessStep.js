import React from 'react';
import PropTypes from 'prop-types';
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
        <Button
          primary
          onClick={() => {
            history.push(`${window.location.pathname}/${fileToUpdate.kfId}`);
          }}
        >
          View Document
        </Button>
        <Button
          onClick={() => {
            handleCloseDialog();
          }}
        >
          Exit ({3 - seconds})
        </Button>
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

export default SuccessStep;