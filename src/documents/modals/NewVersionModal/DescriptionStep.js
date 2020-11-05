import React from 'react';
import PropTypes from 'prop-types';
import {formatFileSize, lengthLimit} from '../../utilities';
import {Form, Label, Segment} from 'semantic-ui-react';
import MarkdownEditor from '../../components/FileDetail/MarkdownEditor';
/**
 * In this step, the user will describ the file that they have uploaded
 */
const DescriptionStep = ({file, description, handleDescription}) => {
  return (
    <>
      <p>
        Help keep track of your document history by telling us what may have
        changed in this version
      </p>
      <Form>
        <Form.Field>
          <label>Uploaded File:</label>
          <span title={file.name}>{lengthLimit(file.name, 70)}</span>
          <Label size="mini" basic pointing="left">
            {formatFileSize(file.size)}
          </Label>
        </Form.Field>
        <Form.Field required>
          <label>Summarize document changes:</label>
          <Segment>
            <MarkdownEditor
              editorState={description}
              onEditorStateChange={e => handleDescription(e)}
            />
          </Segment>
        </Form.Field>
      </Form>
    </>
  );
};

DescriptionStep.propTypes = {
  /** The File that the user has chosen to upload */
  file: PropTypes.object,
  /** The function */
};

export default DescriptionStep;
