import React from 'react';
import {UPDATE_PROJECT} from '../state/mutations';
import {graphql} from 'react-apollo';
import {Button, Modal} from 'semantic-ui-react';

/**
 * A modal that allows a user to update an existing project
 */
const EditProjectModal = ({projectNode, updateProject, onCloseDialog}) => {
  const onSubmit = e => {
    e.preventDefault();
    updateProject({variables: {projectType: ''}})
      .then(() => onCloseDialog())
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Modal open={true} onClose={onCloseDialog} size="small" closeIcon>
      <Modal.Header content="Edit Document Metadata" />
      <Modal.Content scrolling>Edit here</Modal.Content>
      <Modal.Actions>
        <Button primary size="mini" onClick={e => onSubmit(e)}>
          SAVE
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default graphql(UPDATE_PROJECT, {name: 'updateProject'})(
  EditProjectModal,
);
