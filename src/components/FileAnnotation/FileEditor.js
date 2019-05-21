import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Button, Icon, GridContainer} from 'kf-uikit';
import SelectElement from './SelectElement';
import Badge from '../Badge/Badge';
import {
  Form,
  FormField,
  RadioButtonGroup,
  TextArea,
} from 'grommet';

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
    <Box fill>
      <Form onSubmit={e => onSubmit(e)} className="FileEditor">
        <FormField
          label="Name"
          name="name"
          help="Enter a name for this file"
          value={name}
          onChange={ev => onNameChange(ev)}
          required
        />
        <FormField
          component={TextArea}
          label="Description"
          name="description"
          help="Describe the purpose and contents of this file"
          value={description}
          onChange={ev => onDescriptionChange(ev)}
          required
        />
        <fieldset className="mt-8 cell-12 md:cell-6">
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
      </Form>
    </Box>
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
