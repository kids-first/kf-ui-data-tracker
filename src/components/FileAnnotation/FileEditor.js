import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import {Icon, GridContainer} from 'kf-uikit';
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
  showStatus,
  renderButtons,
}) => {
  const [editingName, setEditingName] = useState(!showStatus);
  let editButtonClass = classes('pl-20', {hidden: !showStatus});
  let badgeClass = classes(showStatus ? 'flex' : 'hidden', 'row-2', 'cell-12');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="FileEditor"
    >
      <GridContainer collapsed="rows">
        {editingName ? (
          <label
            className="row-1 cell-12 flex justify-between"
            for="file_name_input"
          >
            <input
              data-testid="name-input"
              className="FileEditor--Input"
              type="text"
              name="file_name_input"
              placeholder="Add your file name here..."
              defaultValue={name}
              onChange={e => onNameChange(e)}
            />
            <button
              data-testid="save-name-button"
              className={editButtonClass}
              type="button"
              onClick={() => {
                setEditingName(false);
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
                setEditingName(true);
              }}
            >
              <span className="hidden">edit file name</span>
              <Icon width={12} height={12} kind="edit" />
            </button>
          </h3>
        )}
        <div className={badgeClass}>
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
        {renderButtons && (
          <div className="cell-12 flex justify-end mt-4">
            {renderButtons(history)}
          </div>
        )}
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
  onSubmit: PropTypes.func,
  /** Action to perform when name input is updated */
  onNameChange: PropTypes.func.isRequired,
  /** Function for onChange event on file type selection */
  selectFileType: PropTypes.func.isRequired,
  /** If to hide the save/cancel buttons and badge */
  showStatus: PropTypes.bool,
};

export default withRouter(FileEditor);
