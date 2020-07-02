import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {
  Button,
  Divider,
  Icon,
  Message,
  Modal,
  Label,
  Popup,
} from 'semantic-ui-react';
import {Formik} from 'formik';
import {ALL_STUDIES, ALL_GROUPS} from '../state/queries';
import {CREATE_REFERRAL_TOKEN} from '../state/mutations';
import {InviteForm} from '../forms';
import {PermissionGroup} from '../admin/components/UserList';

/**
 * Modal to invite a user to the Data Tracker by email.
 * This is the controller that handles the form submission and state.
 */
const InviteModal = ({open, onCloseDialog}) => {
  const [emailList, setEmailList] = useState([]);

  const {data: studiesData} = useQuery(ALL_STUDIES);
  const {data: groupsData} = useQuery(ALL_GROUPS);
  const studies = studiesData && studiesData.allStudies.edges;
  const groups =
    groupsData && groupsData.allGroups && groupsData.allGroups.edges;

  const [createToken] = useMutation(CREATE_REFERRAL_TOKEN);

  const onSubmit = (values, {setErrors, setStatus, setSubmitting}) => {
    setSubmitting(true);
    setEmailList(emailList.map(e => ({key: e.key, status: 'Sending'})));
    emailList.map((email, index) =>
      createToken({
        variables: {
          input: {
            email: email.key,
            studies: values.studies,
            groups: values.groups,
          },
        },
      })
        .then(res => {
          var updated = [...emailList];
          updated[index].status = 'Sent';
          setEmailList(updated);
        })
        .catch(err => {
          var updated = [...emailList];
          updated[index].status = `ERROR: ${err.message}`;
          setEmailList(updated);
        }),
    );
    if (emailList.filter(e => e.status === 'Sending').length === 0) {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onCloseDialog();
        setEmailList([]);
      }}
      closeIcon
      size="large"
    >
      <Formik
        initialValues={{
          studies: [],
          groups: [],
        }}
        validate={values => {
          let errors = {};
          if (values.groups.length <= 0) {
            errors.groups = 'Required';
          }
          if (values.studies.length <= 0) {
            errors.studies = 'Required';
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {formikProps => (
          <InviteModalContent
            onCloseDialog={onCloseDialog}
            studies={studies || []}
            groups={groups || []}
            formikProps={formikProps}
            emailList={emailList}
            setEmailList={setEmailList}
          />
        )}
      </Formik>
    </Modal>
  );
};

/**
 * Modal content which renders the actual modal and form
 */
const InviteModalContent = ({
  onCloseDialog,
  studies,
  groups,
  formikProps,
  emailList,
  setEmailList,
}) => {
  const {isSubmitting, isValid, handleSubmit} = formikProps;
  const [groupDetail, showGroupDetail] = useState(false);
  // Group permissions are sorted by the object
  // Permission codename in action_object format, e.g. "view_event", "add_file"
  const groupOptions =
    groups &&
    groups.map(({node}) => ({
      key: node.name,
      permissions: node.permissions.edges
        .map(({node}) => ({
          key: node.codename,
          value: node.name,
        }))
        .sort((a, b) =>
          a.key.split('_').slice(-1)[0] > b.key.split('_').slice(-1)[0]
            ? 1
            : -1,
        ),
    }));

  return (
    <>
      <Modal.Header content="Invite Users to the Data Tracker" />
      {groupDetail ? (
        <Modal.Content>
          {groupOptions && <PermissionGroup groupOptions={groupOptions} />}
        </Modal.Content>
      ) : (
        <Modal.Content>
          <Modal.Description>
            <Message icon info>
              <Icon name="mail" />
              <Message.Content>
                <Message.Header>Invite a user by email</Message.Header>
                Send users an invitation email with a refferal code that will
                automatically add them to the appropriate studies after they log
                in for the first time.
              </Message.Content>
            </Message>
          </Modal.Description>
          <Divider />

          <InviteForm
            formikProps={formikProps}
            studies={studies}
            groups={groups}
            showGroupDetail={showGroupDetail}
          />
          {status && <Message {...status} />}
          <Label.Group className="mt-6 ml-5">
            {emailList.length > 0 ? (
              emailList.map(email => (
                <Popup
                  inverted
                  key={email.key}
                  content={email.status}
                  trigger={
                    <Label
                      as="a"
                      className="my-2"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {email.status === 'Sending' && (
                        <Icon
                          data-testid="email-sending"
                          name="arrow circle right"
                          color="blue"
                        />
                      )}
                      {email.status === 'Sent' && (
                        <Icon
                          data-testid="email-sent"
                          name="check"
                          color="green"
                        />
                      )}
                      {email.status.startsWith('ERROR') && (
                        <Icon
                          data-testid="email-error"
                          name="warning circle"
                          color="red"
                        />
                      )}
                      {email.key}
                      {email.status === 'Added' && (
                        <Icon
                          name="close"
                          data-testid="remove-one-email"
                          onClick={e => {
                            e.stopPropagation();
                            setEmailList(
                              emailList.filter(e => e.key !== email.key),
                            );
                          }}
                        />
                      )}
                    </Label>
                  }
                />
              ))
            ) : (
              <div className="text-grey pt-10">No Emails Added ...</div>
            )}
          </Label.Group>
        </Modal.Content>
      )}
      <Modal.Actions>
        {groupDetail && (
          <Button
            primary
            floated="left"
            content="Back"
            onClick={() => showGroupDetail(false)}
          />
        )}
        <Button
          onClick={() => {
            onCloseDialog();
            setEmailList([]);
          }}
        >
          Cancel
        </Button>
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'invite button']
              : ['invite button'],
          })}
        >
          {({logEvent}) => (
            <Button
              icon
              primary
              type="submit"
              labelPosition="right"
              data-testid="invite-button"
              onClick={() => {
                logEvent('click');
                handleSubmit();
              }}
              disabled={!isValid || isSubmitting || emailList.length === 0}
              loading={isSubmitting}
            >
              Send Email Invite
              <Icon name="send" />
            </Button>
          )}
        </Amplitude>
      </Modal.Actions>
    </>
  );
};

const AnalyticsModal = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'invite modal']
        : ['invite modal'],
    })}
  >
    {props.open && <LogOnMount eventType="modal opened" />}
    <InviteModal {...props} />
  </Amplitude>
);

export default AnalyticsModal;
