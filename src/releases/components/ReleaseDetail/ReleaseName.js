import React, {useState} from 'react';
import {Icon, Button, Header, Form, Popup} from 'semantic-ui-react';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';

const ReleaseName = ({release, updateRelease}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(release.name);
  const [titleError, setTitleError] = useState('');
  const handleChange = (e, {value}) => {
    e.preventDefault();
    setTitle(value);
    setTitleError('');
    if (value.length === 0) {
      setTitleError('Release name is required');
    }
  };
  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'release name']
          : ['release name'],
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
            data-testid="e-input"
            type="text"
            name="release_name"
            placeholder="Name for release..."
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
                    updateRelease({
                      variables: {
                        id: release.id,
                        input: {
                          name: title,
                        },
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
                    setTitle(release.name);
                    setTitleError('');
                  }}
                />
              )}
            </Amplitude>
          </Form.Input>
        </Form>
      ) : (
        <Header as="h2" className="pt-10">
          {release.name}
          {updateRelease && (
            <Popup
              content="Edit release title"
              position="right center"
              inverted
              trigger={
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
              }
            />
          )}
        </Header>
      )}
    </Amplitude>
  );
};

export default ReleaseName;
