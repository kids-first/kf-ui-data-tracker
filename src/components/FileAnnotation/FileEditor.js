import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'kf-uikit';
import SelectElement from './SelectElement';
import Badge from '../Badge/Badge';
/**
 * Form to add fields to a newly uploaded file
 */
const FileEditor = ({
  kfId,
  name,
  description,
  fileType,
  selectFileType,
  onSubmit,
  onNameChange,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <form onSubmit={e => onSubmit(e)} className="FileEditor">
      <div>
        {editing ? (
          <label className="max-w-full flex flex-row justify-between">
            <input
              className="FileEditor--Input"
              type="text"
              name="name"
              placeholder="Add your file name here..."
              defaultValue={name}
              onChange={e => onNameChange(e)}
            />
            <button
              className="p-4"
              onClick={() => {
                setEditing(false);
              }}
            >
              <span className="hidden">save file name</span>
              <Icon width={12} height={12} kind="save" />
            </button>
          </label>
        ) : (
          <h3 className="font-normal mt-0 mb-4 pl-2 text-blue">
            {name}
            <button
              className="pl-6 pt-4"
              onClick={() => {
                setEditing(true);
              }}
            >
              <span className="hidden">edit file name</span>
              <Icon width={12} height={12} kind="edit" />
            </button>
          </h3>
        )}

        <div className="FileEditor--Badge">
          <Badge state="new" />
          <Badge state="pendingApproval" />
        </div>
      </div>
      <div className="flex flex-row flex-wrap sm:flex-no-wrap">
        <div className="w-full sm:mr-6">
          <label>
            File description (required):
            <textarea
              className="FileEditor--TextArea sm:mb-0"
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
            value="SHM"
            icon="release"
            title="Shipping Manifest"
            body="Some helpful description."
            select={e => selectFileType(e)}
            selected={fileType === 'SHM'}
          />
          <SelectElement
            name="clin"
            value="CLN"
            icon="biospecimen"
            title="Clinical/Phenotype Data"
            body="Some helpful description."
            select={selectFileType}
            selected={fileType === 'CLN'}
          />
          <SelectElement
            name="sequening"
            value="SEQ"
            icon="customize"
            title="Sequencing Manifest"
            body="Some helpful description."
            select={selectFileType}
            selected={fileType === 'SEQ'}
          />
          <SelectElement
            name="other"
            value="OTH"
            icon="settings"
            title="Other"
            body="Some helpful description."
            select={selectFileType}
            selected={fileType === 'OTH'}
          />
          <div className="flex flex-row-reverse w-full mt-4">
            <Button type="submit" color="primary">
              Annotate File
            </Button>
          </div>
        </fieldset>
      </div>
    </form>
  );
};

FileEditor.propTypes = {
  /** The kf_id of the file */
  kfId: PropTypes.string.isRequired,
  /** The name of the file */
  name: PropTypes.string,
  /** The description for the file */
  description: PropTypes.string.isRequired,
  /** The value of the currently selected fileType's enum*/
  fileType: PropTypes.string,
  /** Action to perform when form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Action to perform when name input is updated */
  onNameChange: PropTypes.func.isRequired,
  /** Function for onChange event on file type selection */
  selectFileType: PropTypes.func.isRequired,
};

export default FileEditor;
