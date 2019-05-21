import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Icon, GridContainer} from 'kf-uikit';
import SelectElement from './SelectElement';
import Badge from '../Badge/Badge';
import {
  Form,
  Box,
  Button,
  CheckBox,
  Grommet,
  FormField,
  RadioButtonGroup,
  RangeInput,
  Select,
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

  const Sel = ({title, value}) => <div className="SelectElement">{title}</div>;

  return (
    <Box fill>
      <Form onSubmit={e => onSubmit(e)} className="FileEditor">
        <FormField
          label="Name"
          name="name"
          help="Enter a name for this file"
          value={name}
          onChange={ev => onNameChange(ev)}
          validate={v => {
            if (v !== undefined && v.length == 0) {
              return 'Please enter a name';
            } else {
              return null;
            }
          }}
        />
        <FormField
          component={TextArea}
          label="Description"
          name="description"
          help="Describe the purpose and contents of this file"
          value={description}
          onChange={ev => onDescriptionChange(ev)}
          validate={v => {
            if (v !== undefined && v.length == 0) {
              return 'Please enter a description';
            } else {
              return null;
            }
          }}
        />
        <FormField label="File Type" name="fileType">
          <RadioButtonGroup
            name="ft"
            value={fileType}
            onChange={ev => selectFileType(ev)}
            options={[
              {
                id: 'SHP',
                value: 'SHP',
                label: (
                  <SelectElement
                    title="Shipping Manifest"
                    body="Some helpful description."
                    icon="release"
                  />
                ),
              },
              {
                id: 'CLN',
                value: 'CLN',
                label: (
                  <SelectElement
                    title="Clinical/Phenotype Data"
                    body="Some helpful description."
                    icon="biospecimen"
                  />
                ),
              },
              {
                id: 'SEQ',
                value: 'SEQ',
                label: (
                  <SelectElement
                    title="Sequencing Manifest"
                    body="Some helpful description."
                    icon="customize"
                  />
                ),
              },
              {
                id: 'OTH',
                value: 'OTH',
                label: (
                  <SelectElement
                    title="Other"
                    body="Some helpful description."
                    icon="settings"
                  />
                ),
              },
            ]}
          />
        </FormField>

        <Box gap="small" direction="row" justify="end">
          <Button
            label="Cancel"
            onClick={() => {
              history.goBack();
            }}
          />
          <Button label="Annotate File" type="submit" primary />
        </Box>
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
