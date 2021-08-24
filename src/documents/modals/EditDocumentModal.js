import React, {useRef, useState} from 'react';
import {
  Button,
  Message,
  Modal,
  Form,
  Header,
  Dimmer,
  Card,
} from 'semantic-ui-react';
import SelectElement from '../components/FileDetail/SelectElement';
import {
  TemplateCard,
  TypeCardPlaceholder,
} from '../components/UploadSteps/TypeCard';
import {fileTypeDetail} from '../../common/enums';
import {Formik, Field} from 'formik';

const EditDocumentModal = ({
  fileNode,
  onCloseDialog,
  studyId,
  updateFile,
  updateError,
  templates,
  evaluateResult,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    fileNode.templateVersion ? fileNode.templateVersion.id : '',
  );

  const formEl = useRef(null);
  const handleSubmit = fileType => {
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: selectedTemplate ? fileNode.fileType : fileType,
        templateVersion: selectedTemplate.length > 0 ? selectedTemplate : null,
      },
    })
      .then(resp => onCloseDialog())
      .catch(err => console.log(err));
  };

  return (
    <Formik
      initialValues={{
        file_type: fileNode.templateVersion
          ? ''
          : Object.keys(fileTypeDetail).includes(fileNode.fileType)
          ? fileNode.fileType
          : 'OTH',
      }}
      validate={vals => {
        let errors = {};
        if (!vals.file_type) {
          errors.file_type = 'Required';
        }
        return errors;
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        errors,
        touched,
        validateForm,
      }) => (
        <Modal open={true} onClose={onCloseDialog} size="large" closeIcon>
          <Modal.Header content="Edit Document Type" />
          <Modal.Content scrolling>
            <Header size="small">Templated Types</Header>
            <Dimmer.Dimmable>
              {templates.length ? (
                <Card.Group itemsPerRow={3}>
                  {templates.map(({node}) => (
                    <TemplateCard
                      node={node}
                      key={node.id}
                      studyId={studyId}
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                      setFieldValue={setFieldValue}
                      result={
                        evaluateResult.results
                          ? evaluateResult.results.filter(
                              r => r.templateVersion.id === node.id,
                            )
                          : []
                      }
                    />
                  ))}
                </Card.Group>
              ) : (
                <Card.Group itemsPerRow={3}>
                  <TypeCardPlaceholder />
                  <TypeCardPlaceholder />
                  <TypeCardPlaceholder />
                </Card.Group>
              )}
              <Dimmer active={templates.length === 0} inverted>
                <Header size="small">
                  No data templates available
                  <Header.Subheader>
                    <p className="mb-0">
                      Please contact organization administrators to create data
                      submission templates.
                    </p>
                    <p>
                      Data templates help to standardize how data is data
                      collected for this study.
                    </p>
                  </Header.Subheader>
                </Header>
              </Dimmer>
            </Dimmer.Dimmable>
            <Header size="small">General Types</Header>
            <Form onSubmit={handleSubmit} ref={formEl} className="mb-15">
              <Form.Field required>
                {Object.keys(fileTypeDetail).map(item => (
                  <Form.Field
                    key={item}
                    disabled={
                      fileNode.validTypes && !fileNode.validTypes.includes(item)
                    }
                  >
                    <Field
                      component={SelectElement}
                      name="file_type"
                      id={item}
                      label={item}
                      setSelectedTemplate={setSelectedTemplate}
                    />
                  </Form.Field>
                ))}
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {updateError && <Message negative content={updateError.message} />}
            <Button
              primary
              size="mini"
              type="button"
              onClick={e => {
                e.preventDefault();
                handleSubmit(values.file_type);
              }}
            >
              SAVE
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default EditDocumentModal;
