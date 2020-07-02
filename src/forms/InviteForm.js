import React, {useState} from 'react';
import {Dropdown, Form, Button, Icon} from 'semantic-ui-react';
import {StudySelector} from '../components/StudySelector';

/**
 * Displays a form to invite a user to the Data Tracker by email to one or more
 * studies.
 */
const InviteForm = ({
  formikProps,
  studies,
  groups,
  showGroupDetail,
  emailList,
  setEmailList,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const {errors, touched, handleBlur, setFieldValue} = formikProps;

  const groupOptions =
    groups &&
    groups.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.id,
    }));

  return (
    <Form>
      <Form.Field>
        <Button
          floated="right"
          size="mini"
          labelPosition="left"
          className="text-primary"
          onClick={() => showGroupDetail(true)}
        >
          <Icon name="eye" />
          See Permission Groups Detail
        </Button>
        <label htmlFor="groups">
          Permission groups this user will be added to
        </label>
        <Dropdown
          fluid
          multiple
          selection
          clearable
          id="groups"
          name="groups"
          data-cy="group selector"
          placeholder="Groups..."
          options={groupOptions}
          onBlur={handleBlur}
          onChange={(e, {name, value}) => {
            setFieldValue('groups', value);
          }}
          error={
            touched.groups !== undefined &&
            errors.groups !== undefined &&
            errors.groups.length > 0
          }
        />
      </Form.Field>
      {studies && (
        <Form.Field>
          <label htmlFor="studies">Studies the user will be a member of</label>
          <StudySelector
            fluid
            studies={studies}
            id="studies"
            name="studies"
            placeholder="Studies..."
            data-cy="study selector"
            onBlur={handleBlur}
            onChange={(e, {name, value}) => {
              setFieldValue('studies', value);
            }}
            error={
              touched.studies !== undefined &&
              errors.studies !== undefined &&
              errors.studies.length > 0
            }
          />
        </Form.Field>
      )}
      <Form.Field>
        <label htmlFor="email">User's email address</label>
        <Form.Input
          id="email"
          name="email"
          className="expand"
          icon="mail"
          autoComplete="off"
          iconPosition="left"
          data-cy="user email"
          onBlur={handleBlur}
          placeholder={emailError ? emailError : "Collaborator's email"}
          onChange={(e, {value}) => {
            setEmailError('');
            setEmailInput(value);
          }}
          value={emailInput}
          action={{
            disabled: emailInput === '',
            color: 'blue',
            content: 'Add to Invite List',
            onClick: e => {
              if (emailList.filter(e => e.key === emailInput).length > 0) {
                setEmailInput('');
                setEmailError('Address added already');
              } else {
                setEmailList([
                  ...emailList,
                  {key: emailInput, status: 'Added'},
                ]);
                setEmailInput('');
              }
            },
          }}
          error={emailError !== ''}
        />
      </Form.Field>
    </Form>
  );
};

export default InviteForm;
