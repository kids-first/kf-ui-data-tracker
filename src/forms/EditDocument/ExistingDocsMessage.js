import React, {useState} from 'react';
import {sortFilesBySimilarity} from '../../common/fileUtils';
import {Message, List, Icon, Button} from 'semantic-ui-react';

const ExistingDocsMessage = ({
  existingDocs,
  fileNameInput,
  errors,
  setShowDialog,
}) => {
  const [showSimilar, setShowSimilar] = useState(false);
  const similarStudyDocs = sortFilesBySimilarity(
    {name: fileNameInput},
    existingDocs,
    0.33,
  );
  const SimilarTitleContent = () => (
    <>
      We found
      <strong>
        {similarStudyDocs.matches.length ? similarStudyDocs.matches.length : ''}{' '}
        similar document titles
      </strong>{' '}
      in this study.
      <a
        href=" "
        onClick={e => {
          e.preventDefault();
          setShowSimilar(!showSimilar);
        }}
      >
        {' '}
        {!showSimilar ? 'Show' : 'Hide'} Similar
      </a>
      {showSimilar && (
        <List>
          {similarStudyDocs.matches.map(doc => (
            <List.Item>
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
      )}
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
