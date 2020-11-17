import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Icon, Button, Header, Form} from 'semantic-ui-react';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
/**
 * Displays study document title with editing stage and validation
 */
const FileName = ({fileNode, updateFile, studyFiles}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(fileNode.name);
  const [titleError, setTitleError] = useState('');
  const handleChange = (e, {value}) => {
    e.preventDefault();
    setTitle(value);
    setTitleError('');
    const existNames =
      studyFiles.length > 0 ? studyFiles.map(({node}) => node.name) : [];
    if (value.length === 0) {
      setTitleError('Document name is required');
    } else if (existNames.includes(value)) {
      setTitleError('This is name is used.');
    }
  };
  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'file name']
          : ['file name'],
      })}
    >
      {editing ? (
        <Form className="mt-30 pr-15">
          <LogOnMount eventType="name input opened" />
          <Form.Input
            size="large"
            required
            error={
              titleError.length > 0
                ? {
                    content: titleError,
                  }
                : false
            }
            data-testid="name-input"
            type="text"
            name="file_name"
            placeholder="Phenotypic Data manifest for..."
            value={title}
            onChange={handleChange}
            action
          >
            <input />
            <Amplitude
              eventProperties={inheritedProps => ({
                ...inheritedProps,
                scope: inheritedProps.scope
                  ? [...inheritedProps.scope, 'cancel button']
                  : ['cancel button'],
              })}
            >
              {({instrument}) => (
                <Button
                  primary
                  disabled={titleError.length > 0}
                  icon="save"
                  onClick={() => {
                    updateFile({
                      variables: {
                        kfId: fileNode.kfId,
                        fileType: fileNode.fileType,
                        name: title,
                      },
                    }).catch(err => console.log(err));
                    setEditing(false);
                    setTitleError('');
                  }}
                />
              )}
            </Amplitude>
            <Amplitude
              eventProperties={inheritedProps => ({
                ...inheritedProps,
                scope: inheritedProps.scope
                  ? [...inheritedProps.scope, 'save button']
                  : ['save button'],
              })}
            >
              {({instrument}) => (
                <Button
                  icon="cancel"
                  onClick={() => {
                    setEditing(false);
                    setTitle(fileNode.name);
                    setTitleError('');
                  }}
                />
              )}
            </Amplitude>
          </Form.Input>
        </Form>
      ) : (
        <Header as="h2" className="pt-10">
          {fileNode.name}
          {updateFile && (
            <Button
              size="mini"
              labelPosition="left"
              className="ml-15 text-primary"
              data-testid="edit-title"
              onClick={() => setEditing(true)}
            >
              <Icon name="pencil" />
              Edit
            </Button>
          )}
        </Header>
      )}
    </Amplitude>
  );
};

FileName.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object,
  /** Function to update file node  */
  updateFile: PropTypes.func,
};

FileName.defaultProps = {
  fileNode: null,
};

export default FileName;
