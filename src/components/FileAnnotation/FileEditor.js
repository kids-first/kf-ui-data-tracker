import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'kf-uikit';
import SelectElement from './SelectElement';

/**
 * Form to add fields to a newly uploaded file
 */
const FileEditor = ({kfId, name, description, fileType, onSubmit}) => (
  <form onSubmit={e => onSubmit(e)} className="FileEditor sm:flex-no-wrap">
    <div className="w-full sm:mr-6">
      <label>
        File name:
        <input
          className="FileEditor--Input "
          type="text"
          name="name"
          defaultValue={name}
        />
      </label>
      <label>
        File description (required):
        <textarea
          className="FileEditor--Input h-64 sm:mb-0"
          type="text"
          name="description"
          defaultValue={description}
        />
      </label>
    </div>
    <fieldset className="w-full">
      Select a file type (required):
      <SelectElement
        name="shipping"
        value="SHP"
        icon="release"
        title="Shipping Manifest"
        body="Some helpful description."
      />
      <SelectElement
        name="clin"
        value="CLN"
        icon="biospecimen"
        title="Clinical/Phenotype Data"
        body="Some helpful description."
      />
      <SelectElement
        name="sequening"
        value="SEQ"
        icon="customize"
        title="Sequencing Manifest"
        body="Some helpful description."
      />
      <SelectElement
        name="other"
        value="OTH"
        icon="info"
        title="Other"
        body="Some helpful description."
      />
      <div className="flex flex-row-reverse w-full">
        <Button type="submit">Save</Button>
      </div>
    </fieldset>
  </form>
);

FileEditor.propTypes = {
  /** The kf_id of the file */
  kfId: PropTypes.string.isRequired,
  /** The name of the file */
  name: PropTypes.string.isRequired,
  /** The description for the file */
  description: PropTypes.string.isRequired,
  /** The value of the currently selected fileType's enum*/
  fileType: PropTypes.string.isRequired,
  /** Action to perform when form is submitted */
  onSubmit: PropTypes.func.isRequired,
};

export default FileEditor;
