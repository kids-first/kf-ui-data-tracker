import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {UPDATE_STUDY} from '../../state/mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {
  Button,
  Form,
  Modal,
  Message,
  Popup,
  Table,
  Icon,
} from 'semantic-ui-react';

const EditModal = ({study, open, setOpen}) => {
  const [name, setName] = useState(study.investigatorName);
  const [error, setError] = useState(false);
  const [
    updateStudy,
    {loading: updateLoading, error: updateError},
  ] = useMutation(UPDATE_STUDY, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + study.kfId).toString('base64'),
        },
      },
    ],
  });

  const save = () => {
    updateStudy({
      variables: {id: study.id, input: {investigatorName: name}},
    })
      .then(() => setOpen(false))
      .catch(err => setError(true));
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        setError(false);
      }}
      size="mini"
      closeIcon
      closeOnDocumentClick
    >
      <Modal.Header>Enter Principal Investigator's Name</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Input
              fluid
              onChange={e => setName(e.target.value)}
              value={name || ''}
              label="Investigator Name"
              type="text"
              placeholder="Bobby Tables"
            />
          </Form>
          {error && updateError && (
            <Message
              className="hard-wrap"
              negative
              content={updateError.message}
            />
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => {
            setOpen(false);
            setError(false);
          }}
        >
          Cancel
        </Button>
        <Button
          content="Save"
          labelPosition="right"
          icon="save"
          onClick={save}
          primary
          disabled={updateLoading || error}
          loading={updateLoading}
        />
      </Modal.Actions>
    </Modal>
  );
};

const InvestigatorName = ({study, investigatorName}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Return an empty cell
  if (!investigatorName)
    return (
      <>
        <Table.Cell singleLine width="1">
          <span
            className="text-blue cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            Add Investigator
            <Icon name="pencil" color="blue" />
          </span>
        </Table.Cell>
        <EditModal study={study} open={modalOpen} setOpen={setModalOpen} />
      </>
    );
  // Return the full investigator's name
  if (investigatorName.length <= 20)
    return (
      <>
        <Table.Cell singleLine width="1">
          {investigatorName + ' '}
          <Icon
            name="pencil"
            color="blue"
            className="cursor-pointer"
            onClick={() => setModalOpen(true)}
          />
        </Table.Cell>
        <EditModal study={study} open={modalOpen} setOpen={setModalOpen} />
      </>
    );

  // The name is too long so truncate and put full content in a popup
  const name = investigatorName.substring(0, 20);
  return (
    <>
      <Popup
        inverted
        hoverable
        position="top center"
        trigger={
          <Table.Cell
            singleLine
            width="1"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {name}...{' '}
            <Icon
              name="pencil"
              color="blue"
              className="cursor-pointer"
              onClick={() => setModalOpen(true)}
            />
          </Table.Cell>
        }
        content={investigatorName}
      />
      <EditModal study={study} open={modalOpen} setOpen={setModalOpen} />
    </>
  );
};

export default InvestigatorName;
