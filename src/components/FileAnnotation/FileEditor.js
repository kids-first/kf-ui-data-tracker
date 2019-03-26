import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'kf-uikit';
import SelectElement from './SelectElement';
const FileEditor = ({kfId, name, description, fileType, onSubmit}) => (
  <form onSubmit={e => onSubmit(e)} className="FileEditor">
    <div className="w-full mr-6">
      <label>
        File name:
        <input
          className="FileEditor--Input mb-6"
          type="text"
          name="name"
          defaultValue={name}
        />
      </label>
      <label>
        File description (required):
        <textarea
          className="FileEditor--Input h-64"
          type="text"
          name="description"
          defaultValue={description}
        />
      </label>
    </div>
    <fieldset className="w-full">
      <label>
        Select a file type (required):
        <SelectElement
          name="shipping"
          icon="release"
          title="Shipping Manifest"
          body="Some helpful description."
        />
        <SelectElement
          name="clin"
          icon="biospecimen"
          title="Clinical/Phenotype Data"
          body="Some helpful description."
        />
        <SelectElement
          name="sequening"
          icon="customize"
          title="Sequencing Manifest"
          body="Some helpful description."
        />
        <SelectElement
          name="other"
          icon="info"
          title="Other"
          body="Some helpful description."
        />
      </label>
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
  /** Action to perform when form is submitted */
  onSubmit: PropTypes.func.isRequired,
};

export default FileEditor;
