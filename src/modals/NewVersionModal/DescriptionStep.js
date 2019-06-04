import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize} from '../../common/fileUtils';

/**
 * In this step, the user will describ the file that they have uploaded
 */
const DescriptionStep = ({file, handleDescription}) => {
  return (
    <>
      <h3>Summarize your changes</h3>
      <p>
        Help keep track of your document history by telling us what may have
        changed in this version
      </p>
      <b>File to be Uploaded:</b>
      <br />
      {file.name}{' '}
      <span className="text-darkGrey pl-16">{formatFileSize(file.size)}</span>
      <br />
      <div className="Form">
        <label className="font-bold required" htmlFor="description">
          Summarize document changes:
        </label>
        <br />
        <textarea
          data-testid="description-input"
          name="description"
          type="text"
          className="Form--TextArea"
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
