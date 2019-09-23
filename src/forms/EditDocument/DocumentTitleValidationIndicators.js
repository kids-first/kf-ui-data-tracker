import React from 'react';
import {List, Icon} from 'semantic-ui-react';
const DocumentTitleValidationIndicators = ({errors}) => {
  return (
    <List size="tiny">
      <List.Item>
        <Icon
          name={
            errors.file_name && errors.file_name.existing_similarity
              ? 'info circle'
              : 'check'
          }
          color={
            errors.file_name && errors.file_name.existing_similarity
              ? 'teal'
              : ''
          }
        />
        Document Title should be unique within study.
      </List.Item>

      <List.Item>
        <Icon
          name={
            (errors.file_name && errors.file_name.file_ext) ||
            (errors.file_name && errors.file_name.upload_similarity)
              ? 'x'
              : 'check'
          }
          color={
            (errors.file_name && errors.file_name.file_ext) ||
            (errors.file_name && errors.file_name.upload_similarity)
              ? 'red'
              : ''
          }
        />
        Name your document different than the uploaded file to help give us more
        context.
      </List.Item>

      <List.Item>
        <Icon
          name={errors.file_name && errors.file_name.dates ? 'x' : 'check'}
          color={errors.file_name && errors.file_name.dates ? 'red' : ''}
        />
        Avoid using specific dates, they can be recorded in the contents section
        or metadata.
      </List.Item>
    </List>
  );
};
export default DocumentTitleValidationIndicators;
