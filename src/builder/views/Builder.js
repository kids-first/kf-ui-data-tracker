import React, {useState} from 'react';
import {
  Accordion,
  Button,
  Form,
  Message,
  Segment,
  Icon,
} from 'semantic-ui-react';
import {EditorState, ContentState} from 'draft-js';
import MarkdownEditor from '../../documents/components/FileDetail/MarkdownEditor';
import TypeChooser from '../components/TypeChooser';
import Mapper from '../components/Mapper';

const Builder = ({file}) => {
  const [step, setStep] = useState(0);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );

  const handleClick = (e, titleProps) => {
    const {index} = titleProps;
    setStep(index);
  };

  const handleSelectType = () => {
    setStep(2);
  };

  return (
    <>
      <Segment>
        <p>
          <Icon circular name="file" size="large" />
          <b>Uploaded File:</b> {file.name}
          <Button
            floated="right"
            primary
            icon="upload"
            labelPosition="left"
            content="Upload new file"
          />
        </p>
      </Segment>
      <Accordion fluid styled>
        <Accordion.Title active={step === 0} onClick={handleClick} index={0}>
          <Icon name="dropdown" />
          {step > 0 && <Icon name="check" color="green" />}
          Basic Info
        </Accordion.Title>
        <Accordion.Content active={step === 0}>
          <Form>
            <Form.Field required>
              <label htmlFor="file_name">Document Title:</label>
              <input
                name="file_name"
                placeholder="Phenotypic Data manifest for..."
              />
              <small>
                Please provide a descriptive title without dates or adjectives
                such as "new", "updated", "final", etc.
              </small>
            </Form.Field>
            <Form.Field>
              <label>Document Description:</label>
              <small>
                Describe what this file contains and its use in the study.
              </small>
              <Segment>
                <MarkdownEditor
                  editorState={editorState}
                  onEditorStateChange={e => {
                    setEditorState(e);
                  }}
                />
              </Segment>
            </Form.Field>
            <Button onClick={e => handleClick(e, {index: 1})}>Next</Button>
          </Form>
        </Accordion.Content>
        <Accordion.Title active={step === 1} onClick={handleClick} index={1}>
          <Icon name="dropdown" />
          {step > 1 && <Icon name="check" color="green" />}
          Document Type
        </Accordion.Title>
        <Accordion.Content active={step === 1}>
          <p>
            Select which type of document this is. The Data Coordinating Center
            requires that files adhere to the proper.{' '}
            <a href="/">format guidelines</a> for the respective file types.
          </p>
          <TypeChooser handleSelect={handleSelectType} />
        </Accordion.Content>
        <Accordion.Title active={step === 2} onClick={handleClick} index={2}>
          <Icon name="dropdown" />
          Mapping Configuration
        </Accordion.Title>
        <Accordion.Content active={step === 2}>
          <Message info icon>
            <Icon circular name="info" />
            To ensure this document is interpretted correctly in the Data
            Resource Center, confirm that the columns in the file are associated
            with the correct Kids First concepts. For some selected file types,
            a subset of column types may be required in the document so that it
            may be processed correctly. If the required columns can not be
            adequetly mapped below, the file may need to be manually transformed
            or a different file type may be necessary.
          </Message>
          <Mapper />
        </Accordion.Content>
      </Accordion>
      <Segment basic>
        <Button size="huge">Submit!</Button>
      </Segment>
    </>
  );
};
export default Builder;
