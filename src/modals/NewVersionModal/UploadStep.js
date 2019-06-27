import React from 'react';
import PropTypes from 'prop-types';
import UploadContainer from '../../containers/UploadContainer';
import {Message} from 'semantic-ui-react';
/**
 * In this step, the user will upload a file using a dropzone or file dialog.
 */
const UploadStep = ({handleUpload}) => (
  <>
    <Message compact info>
      Adding changes to existing documents in your study? You can upload all new
      information here! And you can rest easy knowing that any previous versions
      of your documents are automatically archived, and available to you for
      easy download/review at any time.
    </Message>
    <UploadContainer handleUpload={handleUpload} />
  </>
);

UploadStep.propTypes = {
  /** Function that will be called when a file is selected */
  handleUpload: PropTypes.func.isRequired,
};

export default UploadStep;
