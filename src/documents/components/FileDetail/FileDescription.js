import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Segment,
  Header,
  Image,
  Table,
  Popup,
} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import MarkdownEditor from './MarkdownEditor';
import {draftToMarkdown} from 'markdown-draft-js';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
/**
 * Displays study document description on markdown or editing mode
 */
const FileDescription = ({fileNode, updateFile}) => {
  const [editing, setEditing] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(fileNode.description || ''),
    ),
  );

  const saveDescription = () => {
    const rawState = convertToRaw(editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        description: mdText,
      },
    });
    setEditing(false);
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
        {updateFile && !editing && (
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
                  floated="right"
                  primary
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
            source={fileNode.description}
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

FileDescription.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object,
  /** Function to update file node  */
  updateFile: PropTypes.func,
};

FileDescription.defaultProps = {
  fileNode: null,
};

export default FileDescription;
