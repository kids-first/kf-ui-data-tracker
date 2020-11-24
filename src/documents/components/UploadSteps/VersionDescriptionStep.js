import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Form, Grid, Header, Image, Segment} from 'semantic-ui-react';
import {draftToMarkdown} from 'markdown-draft-js';
import MarkdownEditor from '../FileDetail/MarkdownEditor';
import {convertToRaw} from 'draft-js';
import documentText from '../../../assets/font.svg';

const VersionDescriptionStep = ({
  nextStep,
  previousStep,
  editorState,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
  isValid,
  setEditorState,
  setFieldValue,
  setFieldTouched,
}) => (
  <>
    <Grid.Row>
      <Grid.Column width={4}>
        <Image src={documentText} size="medium" centered rounded />
        <Header>Provide Details</Header>
        <p>
          Explain briefly or in detail what changes this new file introduces to
          the document as compared to the last version of the document.
        </p>
      </Grid.Column>
      <Grid.Column width={12}>
        <Form.Field required>
          <Header>Change Description</Header>
          <Segment color={touched.file_desc && errors.file_desc ? 'red' : null}>
            <MarkdownEditor
              editorState={editorState}
              onEditorStateChange={e => {
                setFieldTouched('file_desc');
                setEditorState(e);
                const rawState = convertToRaw(e.getCurrentContent());
                const mdText = draftToMarkdown(rawState);
                setFieldValue('file_desc', mdText);
              }}
            />
          </Segment>
        </Form.Field>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16} textAlign="right">
        <Button content="Back" onClick={previousStep} />
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'upload button']
              : ['button', 'upload button'],
          })}
        >
          {({logEvent}) => (
            <Button
              primary
              data-testid="new-file-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              onClick={() => isValid && logEvent('click')}
            >
              Create
            </Button>
          )}
        </Amplitude>
      </Grid.Column>
    </Grid.Row>
  </>
);

export default VersionDescriptionStep;
