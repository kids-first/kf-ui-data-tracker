import React from 'react';
import { Button, Header, Modal, Icon, Grid, Segment, Search, Divider } from 'semantic-ui-react';

const UploadMethodsModal = ({ onCloseDialog, history, file }) => {

  return (
    <Modal open={true} onClose={onCloseDialog} closeIcon>
      <Header>Choose An Upload Method
        <Header.Subheader as='small'>{file.name}</Header.Subheader>
      </Header>
      <Modal.Content >
        <Segment placeholder >
          <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Or</Divider>

            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <Header icon> <Icon name='copy' /> Update to Existing Document
                <Header.Subheader as='p'>This is a new version of a previously uploaded document.</Header.Subheader>
                </Header>
                <Button primary>Update Existing Document</Button>

              </Grid.Column>

              <Grid.Column>
                <Header icon> <Icon name='file' /> New Study Document
                <Header.Subheader as='p'>This document has not previously been provided uploaded.</Header.Subheader></Header>
                <Button primary onClick={() => history.push('documents/new-document', { file })}>Create New Document</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};

export default UploadMethodsModal;
