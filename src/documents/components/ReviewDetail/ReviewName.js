import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {Button, Form, Header, Icon, Popup} from 'semantic-ui-react';
import React, {useState} from 'react';

import PropTypes from 'prop-types';

/**
 * Displays data reviw title with editing stage
 */
const ReviewName = ({allReviews, reviewNode, updateReview}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(reviewNode.name);
  const [titleError, setTitleError] = useState('');
  const handleChange = (e, {value}) => {
    e.preventDefault();
    setTitle(value);
    setTitleError('');
    const existNames =
      allReviews.length > 0 ? allReviews.map(({node}) => node.name) : [];
    if (value.length === 0) {
      setTitleError('Data review name is required');
    } else if (existNames.includes(value)) {
      setTitleError('This name is used.');
    }
  };
  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'review name']
          : ['review name'],
      })}
    >
      {editing ? (
        <Form className="mt-30 pr-15">
          <LogOnMount eventType="name input opened" />
          <Form.Input
            size="large"
            required
            error={titleError.length > 0 ? titleError : null}
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
                    updateReview({
                      variables: {
                        id: reviewNode.id,
                        input: {
                          name: title,
                          description: reviewNode.descrition,
                        },
                      },
                    })
                      .then(() => {
                        setEditing(false);
                        setTitleError('');
                      })
                      .catch(err => setTitleError(err.message));
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
                    setTitle(reviewNode.name);
                    setTitleError('');
                  }}
                />
              )}
            </Amplitude>
          </Form.Input>
        </Form>
      ) : (
        <Header as="h2" className="pt-10">
          {reviewNode.name}
          {updateReview && (
            <Popup
              content="Edit document title"
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

ReviewName.propTypes = {
  /** Array of study object*/
  reviewNode: PropTypes.object,
  /** Function to update file node  */
  updateReview: PropTypes.func,
};

ReviewName.defaultProps = {
  reviewNode: null,
};

export default ReviewName;
