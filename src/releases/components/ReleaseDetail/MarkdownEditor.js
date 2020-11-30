import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useMutation} from '@apollo/react-hooks';
import {UPDATE_RELEASE} from '../../mutations';
import {
  Button,
  Header,
  Icon,
  Segment,
  Table,
  Message,
  Popup,
} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {draftToMarkdown} from 'markdown-draft-js';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

/**
 * Displays a release description
 **/
const MarkdownEditor = ({releaseId, description, allowed}) => {
  const [updateRelease] = useMutation(UPDATE_RELEASE);

  const editorStyle = {
    cursor: 'text',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '128px',
    verticalAlign: 'bottom',
    transition: 'all .3s, height 0s',
    overflow: 'auto',
    resize: 'vertical',
  };

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(description || ''),
    ),
  );

  const saveDescription = () => {
    const rawState = convertToRaw(editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    updateRelease({
      variables: {
        id: releaseId,
        input: {
          description: mdText,
        },
      },
    })
      .then(resp => {
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });
    setEditing(false);
  };

  return (
    <>
      <Header as="h4" color="grey">
        Description
        {allowed && !editing && (
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
        <div>
          <Segment>
            <Editor
              editorStyle={editorStyle}
              editorState={editorState}
              onEditorStateChange={e => setEditorState(e)}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'list',
                  'link',
                  'emoji',
                  'image',
                  'history',
                ],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic'],
                },
                blockType: {
                  inDropdown: true,
                  options: [
                    'Normal',
                    'H1',
                    'H2',
                    'H3',
                    'H4',
                    'Blockquote',
                    'Code',
                  ],
                },
                emoji: {
                  emojis: [
                    '😀',
                    '😋',
                    '😦',
                    '👍',
                    '👎',
                    '👌',
                    '👻',
                    '🐛',
                    '🔥',
                    '🎉',
                    '🎊',
                    '🎁',
                    '📦',
                    '📊',
                    '📈',
                    '🔇',
                    '🔈',
                    '📅',
                    '✅',
                    '❎',
                    '💯',
                    '❤️',
                  ],
                },
              }}
            />
          </Segment>
          <Segment basic clearing className="noMargin noPadding">
            <Button
              floated="right"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button floated="right" primary onClick={() => saveDescription()}>
              Save
            </Button>
          </Segment>
        </div>
      ) : (
        <>
          {description ? (
            <Segment basic secondary className="x-scroll">
              <Markdown
                source={description}
                renderers={{
                  image: Image,
                  table: props => <Table>{props.children}</Table>,
                }}
              />
            </Segment>
          ) : (
            <em>No release description. Please add one.</em>
          )}
        </>
      )}
      {error && <Message warning compact size="mini" content={error} />}
    </>
  );
};
MarkdownEditor.propTypes = {
  releaseId: propTypes.string.isRequired,
  description: propTypes.string,
};

MarkdownEditor.defaultProps = {
  description: null,
};

export default MarkdownEditor;
