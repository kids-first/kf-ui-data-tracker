import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize, lengthLimit} from '../../utilities';
import {Form, Label} from 'semantic-ui-react';
/**
 * In this step, the user will describ the file that they have uploaded
 */
const DescriptionStep = ({file, handleDescription}) => {
  return (
    <>
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
            onChange={ev => handleDescription(ev.target.value)}
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

export default DescriptionStep;
