import React from 'react';
import {sortFilesBySimilarity} from '../utilities';
import {STUDY_DOCS_SIMILARITY_THRESHOLD} from '../../common/globals';
import {Message, List, Icon, Button} from 'semantic-ui-react';

const ExistingDocsMessage = ({
  existingDocs,
  fileNameInput,
  errors,
  setShowDialog,
  newFile,
}) => {
  const similarStudyDocs = sortFilesBySimilarity(
    {name: fileNameInput},
    existingDocs,
    STUDY_DOCS_SIMILARITY_THRESHOLD,
  );
  const SimilarTitleContent = () => (
    <>
      {errors.file_name.exact_matches ? (
        <strong>Documents with this name already exist in this study.</strong>
      ) : (
        <span>
          We found &nbsp;
          <strong>
            {similarStudyDocs.matches.length}&nbsp; similar document titles
            &nbsp;
          </strong>
          in this study.
        </span>
      )}
      <details>
        <List>
          {similarStudyDocs.matches.map((doc, index) => (
            <List.Item key={doc.target + index}>
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
    <Message info icon size="small" error={errors.file_name.exact_matches}>
      <Icon name="info circle" />
      <Message.Content>
        <Message.Header>Update Existing Document Instead?</Message.Header>
        {errors.file_name.upload_similarity && <CopiedFileContent />}
        {errors.file_name.existing_similarity && <SimilarTitleContent />}
      </Message.Content>
      {newFile && (
        <Button
          color="blue"
          floated="right"
          onClick={() => setShowDialog(true)}
        >
          Update Existing Document
        </Button>
      )}
    </Message>
  );
};

export default ExistingDocsMessage;
