import CustomLink from './CustomLink';
import CustomParagraph from './CustomParagraph';
import EditorJs from 'react-editor-js';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import React from 'react';

const AdditionalFields = ({allowEdit, formikProps}) => {
  const {values, setFieldValue} = formikProps;
  const dataTemplate = {
    blocks: [
      {
        type: 'customText',
        data: {
          name: '',
          value: '',
        },
      },
      {
        type: 'customLink',
        data: {
          name: '',
          value: '',
        },
      },
    ],
  };

  return (
    <EditorJs
      readOnly={!allowEdit}
      onChange={(api, newData) => {
        setFieldValue('additionalFields', JSON.stringify(newData));
      }}
      tools={{
        paragraph: Paragraph,
        header: Header,
        customText: CustomParagraph,
        customLink: CustomLink,
      }}
      data={
        Object.keys(JSON.parse(values.additionalFields)).length > 0
          ? JSON.parse(values.additionalFields)
          : dataTemplate
      }
    />
  );
};

export default AdditionalFields;
