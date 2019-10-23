import React from 'react';
import {sortFilesBySimilarity} from '../utilities';
import {STUDY_DOCS_SIMILARITY_THRESHOLD} from '../../common/globals';
import {Message, List, Icon, Button} from 'semantic-ui-react';

const ExistingDocsMessage = ({
  existingDocs,
  fileNameInput,
  errors,
  setShowDialog,
}) => {
  const similarStudyDocs = sortFilesBySimilarity(
    {name: fileNameInput},
    existingDocs,
    STUDY_DOCS_SIMILARITY_THRESHOLD,
  );
  const SimilarTitleContent = () => (
    <>
      We found &nbsp;
      <strong>
        {similarStudyDocs.matches.length}&nbsp; similar document titles &nbsp;
      </strong>
      in this study.
      <details>
        <List>
          {similarStudyDocs.matches.map(doc => (
            <List.Item key={doc.target}>
              <List.Icon name="file" />
              {doc.target} (
              {
                existingDocs.filter(({node}) => node.name === doc.target)[0]
                  .node.versions.edges.length
              }{' '}
              versions)
            </List.Item>
          ))}
        </List>
      </details>
    </>
  );

  const CopiedFileContent = () => (
    <>Looks like this may be a copy of an existing file.</>
  );

  return (
    <Message info icon size="small">
      <Icon name="info circle" />
      <Message.Content>
        <Message.Header>Update Existing Document Instead?</Message.Header>
        {errors.file_name.upload_similarity && <CopiedFileContent />}
        {errors.file_name.existing_similarity && <SimilarTitleContent />}
      </Message.Content>

      <Button color="blue" floated="right" onClick={() => setShowDialog(true)}>
        Update Existing Document
      </Button>
    </Message>
  );
};

export default ExistingDocsMessage;
