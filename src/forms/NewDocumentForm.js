import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, GridContainer} from 'kf-uikit';
import SelectElement from '../components/FileAnnotation/SelectElement';
import {fileTypeDetail} from '../common/fileUtils';

/**
 * A form for uploading a new document.
 * The form will invoke the handleSubmit handle upon submission passing it
 * fileName, fileType, and fileDescription values.
 */
const NewFileForm = ({handleSubmit, handleCancel, errors}) => {
  const [fileType, setFileType] = useState();
  const [fileName, setFileName] = useState();
  const [fileDescription, setFileDescription] = useState();

  return (
    <form
      onSubmit={ev => {
        ev.preventDefault();
        handleSubmit(fileName, fileType, fileDescription);
      }}
      className="Form"
    >
      <GridContainer collapsed="rows">
        <label
          className="row-1 cell-3 text-right Form--Label Form--Label-required"
          htmlFor="file_name"
        >
          Document Title:
        </label>
        <input
          data-testid="name-input"
          className="Form--Input row-1 cell-7"
          type="text"
          name="file_name"
          placeholder="Phenotypic Data manifest for..."
          defaultValue={fileName}
          onChange={e => setFileName(e.target.value)}
        />
        <label
          className="row-2 cell-3 text-right Form--Label Form--Label-required"
          htmlFor="file_type"
        >
          Document Type:
        </label>
        <fieldset name="file_type" className="row-2 cell-7 md:cell-7">
          {Object.keys(fileTypeDetail).map(item => (
            <SelectElement
              key={item}
              value={item}
              select={e => setFileType(e.target.value)}
              selected={fileType === item}
            />
          ))}
        </fieldset>
        <label
          className="row-3 cell-3 text-right Form--Label Form--Label-required"
          htmlFor="description"
        >
          Describe document contents:
        </label>
        <textarea
          data-testid="description-input"
          className="Form--TextArea row-3 cell-7"
          type="text"
          name="description"
          defaultValue={fileDescription}
          onChange={e => setFileDescription(e.target.value)}
        />
        <div className="row-4 cell-12 Form--Actions">
          {errors && <div className="text-red">{errors}</div>}
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="submit"
            color="primary"
            disabled={!fileName || !fileType || !fileDescription}
          >
            UPLOAD
          </Button>
        </div>
      </GridContainer>
    </form>
  );
};

NewFileForm.propTypes = {
  /** Function to perform on form submission */
  handleSubmit: PropTypes.func.isRequired,
  /** Function to perform when the cancel button is clicked */
  handleCancel: PropTypes.func.isRequired,
  /** Any errors that occured when submitting the form */
  errors: PropTypes.string,
};

export default NewFileForm;
