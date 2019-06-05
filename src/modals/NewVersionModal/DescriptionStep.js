import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize} from '../../common/fileUtils';

/**
 * In this step, the user will describ the file that they have uploaded
 */
const DescriptionStep = ({file, handleDescription}) => {
  return (
    <>
      <h3 className="text-blue font-bold font-body">Summarize your changes</h3>
      <p className="mb-32 font-title ml-8">
        Help keep track of your document history by telling us what may have
        changed in this version
      </p>
      <b>Uploaded File:</b>
      <p className="mb-32 font-title ml-8">
        {file.name}
        <span className="text-mediumGrey text-xs pl-16">
          {formatFileSize(file.size)}
        </span>
      </p>
      <div>
        <label className="font-bold Form--Label-required" htmlFor="description">
          Summarize document changes (required):
        </label>
        <textarea
          data-testid="description-input"
          name="description"
          type="text"
          className="Form--TextArea--dialog"
          onChange={ev => handleDescription(ev.target.value)}
        />
      </div>
    </>
  );
};

DescriptionStep.propTypes = {
  /** The File that the user has chosen to upload */
  file: PropTypes.object,
  /** The function */
};

export default DescriptionStep;
