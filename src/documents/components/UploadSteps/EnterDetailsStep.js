import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Input,
  Message,
  Segment,
} from 'semantic-ui-react';
import {draftToMarkdown} from 'markdown-draft-js';
import MarkdownEditor from '../FileDetail/MarkdownEditor';
import {convertToRaw} from 'draft-js';
import documentText from '../../../assets/font.svg';

const EnterDetailsStep = ({
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
          Please give a unique name that the DRC may use to refer to the new
          document with and describe the purpose of it. Useful information to
          provide in the description may include the source of the data, its
          structure, or how frequently it will be updated.
        </p>
      </Grid.Column>
      <Grid.Column width={12}>
        <Form.Field error={touched.file_name && !!errors.file_name} required>
          <Header>Document Name</Header>
          <Input
            data-testid="name-input"
            type="text"
            name="file_name"
            placeholder="Phenotypic Data manifest for..."
            value={values.file_name}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.file_name === 'exists' && (
            <Message
              negative
              icon="warning"
              header="Document Already Exists"
              content="A document with this name already exists in the study. Consider updating the existing document instead of creating a new document"
            />
          )}
          <small>
            Please provide a descriptive title without dates or adjectives such
            as "new", "updated", "final", etc.
          </small>
        </Form.Field>

        <Form.Field required>
          <Header>Description</Header>
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

export default EnterDetailsStep;
