import React from 'react';
import PropTypes from 'prop-types';
import {GridContainer} from 'kf-uikit';
import SelectElement from '../components/FileAnnotation/SelectElement';
import Badge from '../components/Badge/Badge';
import {fileTypeDetail} from '../common/fileUtils';
/**
 * Form to edit document information
 */
const EditDocumentForm = ({
  fileType,
  fileName,
  fileDescription,
  onFileTypeChange,
  onNameChange,
  onDescriptionChange,
}) => {
  return (
    <form className="pt-16">
      <GridContainer>
        <label
          className="Form--Label row-1 cell-3 text-right Form--Label-required"
          htmlFor="file_name"
        >
          Document Title:
        </label>
        <input
          data-testid="name-input"
          className="Form--Input border border-grey row-1 cell-9"
          type="text"
          name="file_name"
          placeholder="Phenotypic Data manifest for..."
          defaultValue={fileName}
          onChange={e => onNameChange(e)}
        />
        <label
          className="Form--Label row-2 cell-3 text-right"
          htmlFor="file_name"
        >
          Approval Status:
        </label>
        <div className="row-2 cell-9">
          <Badge state="PEN" />
        </div>
        <label
          className="Form--Label row-3 cell-3 text-right Form--Label-required"
          htmlFor="file_type"
        >
          Document Type:
        </label>
        <fieldset name="file_type" className="row-3 cell-9">
          {Object.keys(fileTypeDetail).map(item => (
            <SelectElement
              key={item}
              value={item}
              select={e => onFileTypeChange(e)}
              selected={fileType === item}
            />
          ))}
        </fieldset>
        <label
          className="Form--Label row-4 cell-3 text-right Form--Label-required"
          htmlFor="description"
        >
          Describe document contents:
        </label>
        <textarea
          data-testid="description-input"
          className="Form--TextArea border border-grey w-full row-4 cell-9"
          type="text"
          name="description"
          defaultValue={fileDescription}
          onChange={e => onDescriptionChange(e)}
        />
      </GridContainer>
    </form>
  );
};

EditDocumentForm.propTypes = {
  /** The title of the file */
  fileName: PropTypes.string,
  /** The description for the file */
  fileDescription: PropTypes.string,
  /** The value of the currently selected fileType's enum*/
  fileType: PropTypes.string,
  /** Action to perform when name input is updated */
  onNameChange: PropTypes.func.isRequired,
  /** Action to perform when description input is updated */
  onDescriptionChange: PropTypes.func.isRequired,
  /** Action to perform when fileType input is updated */
  onFileTypeChange: PropTypes.func.isRequired,
};

export default EditDocumentForm;
