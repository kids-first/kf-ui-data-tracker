import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {Button, Dropdown, Modal} from 'semantic-ui-react';
import React, {useState} from 'react';

/**
 * Renders forms to transfer study to another organization
 */
const TransferStudyModal = ({
  open,
  study,
  transferStudy,
  organizations,
  onCloseDialog,
}) => {
  const [org, setOrg] = useState('');
  const [errors, setErrors] = useState('');

  const defaultLogo =
    'https://raw.githubusercontent.com/kids-first/kf-ui-data-tracker/master/src/assets/logo.svg';

  const currentOrg = study && study.organization.id;
  const options =
    organizations && organizations.edges.length > 0
      ? organizations.edges
          .filter(({node}) => node.id !== currentOrg)
          .map(({node}) => ({
            key: node.id,
            text: node.name,
            value: node.id,
            image: {
              avatar: true,
              circular: true,
              src: node.image || defaultLogo,
              alt: node.name,
            },
          }))
      : [];

  return (
    <Modal
      open={open}
      onClose={() => {
        setOrg('');
        setErrors('');
        onCloseDialog();
      }}
      closeIcon
      size="tiny"
    >
      <Modal.Header content="Transfer Study To Another Organization" />
      <Modal.Content>
        <Modal.Description className="mb-15">
          You are transfering the <b>{study && study.name}</b> study from{' '}
          <b>{study && study.organization.name}</b> organization to the
          organization selected below.
        </Modal.Description>
        {transferStudy && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'transfer study button']
                : ['transfer study button'],
            })}
          >
            {({logEvent}) => (
              <Dropdown
                selection
                search
                fluid
                autoComplete="off"
                disabled={options.length === 0}
                options={options}
                placeholder={
                  options.length === 0
                    ? 'There are no organization to select'
                    : 'Choose an organization'
                }
                onChange={(e, {text, value}) => {
                  setOrg(value);
                  setErrors('');
                }}
                error={errors.length > 0}
              />
            )}
          </Amplitude>
        )}
        {errors ? (
          <small className="text-red">{errors}</small>
        ) : (
          <small className="text-grey">
            You need to be a member of the destination organization to transfer
            the study.
          </small>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          disabled={org.length === 0 || errors.length > 0}
          onClick={() => {
            transferStudy({
              variables: {
                organization: org,
                study: study.id,
              },
            })
              .then(resp => {
                setErrors('');
              })
              .catch(err => {
                console.log(err);
                setErrors(err.message);
              });
          }}
        >
          Transfer
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
const AnalyticsModal = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'transfer study modal']
        : ['transfer study modal'],
    })}
  >
    {props.open && <LogOnMount eventType="modal opened" />}
    <TransferStudyModal {...props} />
  </Amplitude>
);

export default AnalyticsModal;
