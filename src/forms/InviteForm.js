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

  const onAddEmail = () => {
    if (emailList.filter(email => email.key === emailInput.toLowerCase()).length > 0) {
      setEmailInput('');
      setEmailError('Address added already');
    } else {
      setEmailList([...emailList, {key: emailInput.toLowerCase(), status: 'Added'}]);
      setEmailInput('');
    }
  };

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
          onBlur={(e, {name, value}) => handleBlur(name)(value)}
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
            onBlur={(e, {name, value}) => handleBlur(name)(value)}
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
          autoComplete="off"
          iconPosition="left"
          data-cy="user email"
          onBlur={handleBlur}
          placeholder={emailError ? emailError : "Collaborator's email"}
          onChange={(e, {value}) => {
            setEmailError('');
            setEmailInput(value);
          }}
          error={emailError !== ''}
          value={emailInput}
          action
        >
          <Icon name="mail" />
          <input
            onKeyDown={e => {
              if (e.keyCode === 13) {
                e.preventDefault();
                onAddEmail();
              }
            }}
          />
          <Button
            disabled={emailInput === ''}
            primary
            content="Add to Invite List"
            onClick={onAddEmail}
          />
        </Form.Input>
      </Form.Field>
    </Form>
  );
};

export default InviteForm;
