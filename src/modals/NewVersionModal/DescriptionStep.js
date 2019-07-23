import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize} from '../../common/fileUtils';
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
          <span title={file.name}>
            {file.name.length > 70
              ? file.name.substring(0, 70) + '...'
              : file.name}
          </span>
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
