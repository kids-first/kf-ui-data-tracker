import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Button, Icon, GridContainer} from 'kf-uikit';
import SelectElement from './SelectElement';
import Badge from '../Badge/Badge';
import {fileTypeDetail} from '../../common/fileUtils';
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
  onDescriptionChange,
  history,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <form onSubmit={e => onSubmit(e)} className="FileEditor">
      <GridContainer collapsed="rows">
        {editing ? (
          <label className="row-1 cell-12 flex justify-between">
            <input
              data-testid="name-input"
              className="FileEditor--Input"
              type="text"
              name="name"
              placeholder="Add your file name here..."
              defaultValue={name}
              onChange={e => onNameChange(e)}
            />
            <button
              data-testid="save-name-button"
              className="pl-20"
              type="button"
              onClick={() => {
                setEditing(false);
              }}
            >
              <span className="hidden">save file name</span>
              <Icon width={12} height={12} kind="save" />
            </button>
          </label>
        ) : (
          <h3 className="row-1 cell-12 font-normal my-0 text-blue">
            {name}
            <button
              data-testid="edit-name-button"
              className="pl-20 pt-4"
              type="button"
              onClick={() => {
                setEditing(true);
              }}
            >
              <span className="hidden">edit file name</span>
              <Icon width={12} height={12} kind="edit" />
            </button>
          </h3>
        )}
        <div className="flex row-2 cell-12">
          <Badge state="new" />
          <Badge state="pendingApproval" />
        </div>
        <label className="mt-8 cell-12 md:cell-6">
          File description (required):
          <textarea
            data-testid="description-input"
            className="FileEditor--TextArea sm:mb-0 h-full"
            type="text"
            name="description"
            defaultValue={description}
            onChange={e => onDescriptionChange(e)}
          />
        </label>
        <fieldset className="mt-8 cell-12 md:cell-6">
          Select a file type (required):
          {Object.keys(fileTypeDetail).map(item => (
            <SelectElement
              key={item}
              value={item}
              select={e => selectFileType(e)}
              selected={fileType === item}
            />
          ))}
        </fieldset>
        <div className="cell-12 flex justify-end mt-4">
          <Button
            onClick={() => {
              history.goBack();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" className="ml-12">
            Annotate File
          </Button>
        </div>
      </GridContainer>
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

export default withRouter(FileEditor);
