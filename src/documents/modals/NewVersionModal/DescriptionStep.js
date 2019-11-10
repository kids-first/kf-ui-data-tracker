import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize, lengthLimit} from '../../utilities';
import {Form, Label} from 'semantic-ui-react';
import {LogOnMount} from '@amplitude/react-amplitude';
import {withAnalyticsTracking} from '../../../analyticsTracking';

/**
 * In this step, the user will describ the file that they have uploaded
 */
const DescriptionStep = ({
  file,
  handleDescription,
  tracking: {
    logEvent,
    EVENT_CONSTANTS: {NEW_VERSION_, INPUT},
  },
}) => {
  return (
    <>
      <LogOnMount eventType={NEW_VERSION_.scope + 'STEP_1'} />
      <p>
        Help keep track of your document history by telling us what may have
        changed in this version
      </p>
      <Form>
        <Form.Field>
          <label>Uploaded File:</label>
          <span title={file.name}>{lengthLimit(file.name, 70)}</span>
          <Label size="mini" basic pointing="left">
            {formatFileSize(file.size)}
          </Label>
        </Form.Field>
        <Form.Field required>
          <label>Summarize document changes:</label>
          <Form.TextArea
            data-testid="description-input"
            name="description"
            type="text"
            onChange={ev => {
              logEvent(INPUT._CHANGE, {
                value: ev.target.value,
                input_type: 'text',
              });
              handleDescription(ev.target.value);
            }}
          />
        </Form.Field>
      </Form>
    </>
  );
};

DescriptionStep.propTypes = {
  /** The File that the user has chosen to upload */
  file: PropTypes.object,
  /** The function */
};

export default withAnalyticsTracking(DescriptionStep);
