import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Icon, GridContainer} from 'kf-uikit';
import SelectElement from './SelectElement';
import Badge from '../Badge/Badge';
import {Button, Checkbox, Form, TextArea, Radio} from 'semantic-ui-react';

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
    <Form onSubmit={e => onSubmit(e)} className="FileEditor ">
      <Form.Field>
        <label>Resource Name:</label>
        <input
          required
          placeholder="Add your file name here..."
          defaultValue={name}
          onChange={e => onNameChange(e)}
        />
      </Form.Field>
      <Form.Field>
        <label>What kind of resource is this?</label>
      </Form.Field>
      {[
        {
          title: 'Shipping Manifest',
          name: 'shipping',
          value: 'SHM',
          desc: 'Some helpful description.',
          icon: 'release',
        },
        {
          title: 'Clinical/Phenotype Data',
          name: 'shipping',
          value: 'CLN',
          desc: 'Some helpful description.',
          icon: 'biospecimen',
        },
        {
          title: 'Sequencing Manifest',
          name: 'sequencing',
          value: 'SEQ',
          desc: 'Some helpful description.',
          icon: 'customize',
        },
        {
          title: 'Other',
          name: 'other',
          value: 'OTH',
          desc: 'Some helpful description.',
          icon: 'settings',
        },
      ].map(({name, value, title, icon, desc}) => (
        <Form.Field>
          <SelectElement
            icon={icon}
            group="fileType"
            title={title}
            name={name}
            value={value}
            desc={desc}
            select={e => selectFileType(e)}
            selected={fileType === value}
          />
        </Form.Field>
      ))}

      <Form.Field>
        <label>Describe your resource: </label>
        <TextArea
          required
          placeholder="This file links participans to biospecimens..."
          defaultValue={description}
          onChange={e => onDescriptionChange(e)}
        />
      </Form.Field>
      <div className="text-right">
        <Button
          circular
          basic
          onClick={() => {
            history.goBack();
          }}
        >
          Cancel
        </Button>
        <Button circular type="submit" color="teal">
          Upload Resource
        </Button>
      </div>
    </Form>
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
