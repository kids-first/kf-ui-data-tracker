import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Divider, Dropdown, Form, Grid, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';
import {ALL_USERS, ALL_STUDIES, ALL_GROUPS} from '../state/queries';
import {InviteCollaboratorForm, LinkStudyForm} from '../forms';
import {StudySelector} from '../components/StudySelector';

/**
 */
const InviteModal = ({
  open,
  addCollaborator,
  inviteCollaborator,
  onCloseDialog,
  users,
}) => {
  const {data: usersData} = useQuery(ALL_USERS);
  const {data: studiesData} = useQuery(ALL_STUDIES);
  const {data: groupsData} = useQuery(ALL_GROUPS);
  const studies = studiesData && studiesData.allStudies.edges;

  const groupOptions =
    groupsData &&
    groupsData.allGroups.edges.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.id,
    }));

  return (
    <Modal open={true} onClose={onCloseDialog} closeIcon size="small">
      <Modal.Header content="Invite Users to the Data Tracker" />
      <Modal.Content>
        <Modal.Description>
          Send users an invitation email with a refferal code that will
          automatically add them to the appropriate studies after they log in
          for the first time.
        </Modal.Description>
        <Divider />

        <Form.Field>
          <label for="groups">
            Permission groups this user will be added to
          </label>
          <Dropdown
            fluid
            multiple
            selection
            clearable
            placeholder="Groups..."
            options={groupOptions}
          />
        </Form.Field>
        <Form.Field>
          <label for="studies">Select studies to invite user to</label>
          <StudySelector
            fluid
            studies={studies}
            id="studies"
            placeholder="Studies..."
          />
        </Form.Field>
        <InviteCollaboratorForm />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCloseDialog}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InviteModal;
