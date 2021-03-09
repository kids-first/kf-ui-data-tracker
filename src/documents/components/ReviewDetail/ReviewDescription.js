import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {
  Button,
  Header,
  Icon,
  Image,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import {ContentState, EditorState, convertToRaw} from 'draft-js';
import React, {useState} from 'react';

import Markdown from 'react-markdown';
import MarkdownEditor from '../FileDetail/MarkdownEditor';
import PropTypes from 'prop-types';
import {draftToMarkdown} from 'markdown-draft-js';

/**
 * Displays data review description on markdown or editing mode
 */
const ReviewDescription = ({reviewNode, updateReview}) => {
  const [editing, setEditing] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(reviewNode.description || ''),
    ),
  );
  const [editError, setEditError] = useState('');

  const saveDescription = () => {
    const rawState = convertToRaw(editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    updateReview({
      variables: {
        id: reviewNode.id,
        input: {
          name: reviewNode.name,
          description: mdText,
        },
      },
    })
      .then(() => setEditing(false))
      .catch(err => setEditError(err.message));
  };

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'file description']
          : ['file description'],
      })}
    >
      <Header as="h4" color="grey">
        Description
        {updateReview && !editing && (
          <Popup
            content="Edit document description"
            position="right center"
            inverted
            trigger={
              <Button
                size="mini"
                labelPosition="left"
                className="ml-15 text-primary"
                onClick={() => setEditing(true)}
              >
                <Icon name="pencil" />
                Edit
              </Button>
            }
          />
        )}
      </Header>
      {editing ? (
        <>
          <LogOnMount eventType="editor opened" />
          <Segment>
            <MarkdownEditor
              editorState={editorState}
              onEditorStateChange={e => setEditorState(e)}
            />
          </Segment>
          <Segment basic clearing className="noMargin noPadding">
            {editError && <span className="text-red">{editError}</span>}
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
                  floated="right"
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
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
                  primary
                  disabled={editError.length > 0}
                  floated="right"
                  onClick={() =>
                    instrument('update description', saveDescription())
                  }
                >
                  Save
                </Button>
              )}
            </Amplitude>
          </Segment>
        </>
      ) : (
        <Segment basic secondary className="x-scroll">
          <Markdown
            source={reviewNode.description}
            renderers={{
              image: Image,
              table: props => <Table>{props.children}</Table>,
            }}
            linkTarget="_blank"
          />
        </Segment>
      )}
    </Amplitude>
  );
};

ReviewDescription.propTypes = {
  /** Array of study object*/
  reviewNode: PropTypes.object,
  /** Function to update file node  */
  updateReview: PropTypes.func,
};

ReviewDescription.defaultProps = {
  reviewNode: null,
};

export default ReviewDescription;
