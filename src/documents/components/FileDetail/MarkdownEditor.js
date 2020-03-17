import React from 'react';
import PropTypes from 'prop-types';
import {Editor} from 'react-draft-wysiwyg';
/**
 * Markdown editor
 */
const MarkdownEditor = ({editorState, onEditorStateChange}) => (
  <Editor
    editorState={editorState}
    onEditorStateChange={onEditorStateChange}
    toolbar={{
      options: ['inline', 'blockType', 'list', 'link', 'emoji', 'history'],
      inline: {
        inDropdown: false,
        options: ['bold', 'italic'],
      },
      blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote', 'Code'],
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
);

MarkdownEditor.propTypes = {
  /** The editor state object */
  editorState: PropTypes.object.isRequired,
  /** Function triggered on editor state change */
  onEditorStateChange: PropTypes.func.isRequired,
};

export default MarkdownEditor;
