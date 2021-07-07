import React, {useState} from 'react';
import {Button, Image, List, Message, Modal} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {useMutation} from '@apollo/client';
import {Formik} from 'formik';
import {longDate} from '../../../common/dateUtils';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {UPDATE_ORGANIZATION} from '../../mutations';
import EditOrganizationForm from '../../forms/EditOrganizationForm';

const EditModal = ({open, onClose, organization}) => {
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  return (
    <Modal closeIcon open={open} onClose={onClose}>
      <Formik
        initialValues={{
          name: organization.name || '',
          image: organization.image || '',
          description: organization.description || '',
          website: organization.website || '',
          email: organization.email || '',
        }}
        validate={values => {}}
        onSubmit={(values, formikProps) => {
          updateOrganization({
            variables: {id: organization.id, input: values},
          })
            .then(data => {
              formikProps.setSubmitting(false);
              formikProps.resetForm();
            })
            .catch(err => formikProps.setErrors({form: err}));
        }}
      >
        {formikProps => (
          <>
            <Modal.Header>Update Organization</Modal.Header>
            <Modal.Content>
              <p>Modify details about this organization</p>

              <EditOrganizationForm formikProps={formikProps} />
              {formikProps.errors.form && (
                <Message inline error>
                  {JSON.stringify(formikProps.errors.form)}
                </Message>
              )}
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                disabled={
                  Object.values(formikProps.errors).length > 0 ||
                  formikProps.isSubmitting ||
                  !formikProps.dirty
                }
                loading={formikProps.isSubmitting}
                type="submit"
                onClick={formikProps.handleSubmit}
              >
                Save
              </Button>
            </Modal.Actions>
          </>
        )}
      </Formik>
    </Modal>
  );
};

const OrganizationItem = ({organization, updateOrganization}) => {
  const [editModal, setEditModal] = useState(false);
  return (
    <List.Item key={organization.id} data-testid="organization-item">
      <Image
        avatar
        src={organization.image || defaultAvatar}
        alt={organization.name}
      />
      <List.Content>
        <List.Header>
          {organization.name}
          {organization.email && <small> - {organization.email}</small>}
        </List.Header>
        <List.Description>
          Created{' '}
          <TimeAgo
            live={false}
            date={organization.createdOn}
            title={longDate(organization.createdOn)}
          />
        </List.Description>
      </List.Content>
      {updateOrganization && (
        <List.Content floated="right">
          <Button primary onClick={() => setEditModal(!editModal)}>
            Edit
          </Button>
        </List.Content>
      )}
      {organization.createdOn && <List.Content floated="right" />}
      <EditModal
        open={editModal}
        onClose={() => setEditModal(false)}
        organization={organization}
      />
    </List.Item>
  );
};

export default OrganizationItem;
