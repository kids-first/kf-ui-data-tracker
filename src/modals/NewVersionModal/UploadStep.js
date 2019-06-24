import React from 'react';
import PropTypes from 'prop-types';
import UploadContainer from '../../containers/UploadContainer';
import {GridContainer} from 'kf-uikit';

/**
 * In this step, the user will upload a file using a dropzone or file dialog.
 */
const UploadStep = ({handleUpload}) => (
  <GridContainer fullWidth collapsed centered={false}>
    <p className="row-1 cell-3-8 font-title mt-0 mx-auto ">
      Adding new data or changes to files in your study? You can upload all new
      information here! And you can rest easy knowing that any previous versions
      of your documents are automatically archived, and available to you for
      easy download/review at any time.
    </p>
    <div className="row-2 cell-3-8 my-12">
      <UploadContainer handleUpload={handleUpload} />
    </div>
  </GridContainer>
);

UploadStep.propTypes = {
  /** Function that will be called when a file is selected */
  handleUpload: PropTypes.func.isRequired,
};

export default UploadStep;
