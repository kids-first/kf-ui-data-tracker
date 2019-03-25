import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'kf-uikit';

const FileEditor = ({kfId, name, description, fileType, onSubmit}) => (
  <form onSubmit={e => onSubmit(e)}>
    <h1>Please enter info about your file</h1>
    {kfId}
    <br />
    <label>
      File Name
      <input className="border" type="text" name="name" defaultValue={name} />
    </label>
    <label>
      Description
      <input
        className="border"
        type="text"
        name="description"
        defaultValue={description}
      />
    </label>
    <label>
      File Type
      <input className="border" type="checkbox" name="shipping" /> Shipping
      Manifest
      <input className="border" type="checkbox" name="clin" />{' '}
      Clinical/Phenotype Data
      <input className="border" type="checkbox" name="sequening" /> Sequencing
      Manifest
      <input className="border" type="checkbox" name="other" /> Other
    </label>
    <Button type="submit">Save</Button>
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
