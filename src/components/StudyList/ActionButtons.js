import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/client';
import {
  ADD_COLLABORATOR,
  CREATE_REFERRAL_TOKEN,
  TRANSFER_STUDY,
} from '../../state/mutations';
import {GET_STUDY_BY_ID, MY_PROFILE, ALL_STUDIES} from '../../state/queries';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Label, Icon, Popup, Table} from 'semantic-ui-react';
import {
  countStudyNotification,
  countProjectNotification,
} from '../../common/notificationUtils';
import {hasPermission} from '../../common/permissions';
import CavaticaLogo from '../../assets/CavaticaLogo';
import AddCollaboratorModal from '../../modals/AddCollaboratorModal';
import TransferStudyModal from '../../modals/TransferStudyModal';

/**
 * A button that displays a popup when hovered and optionally a notification
 * label in the right corner.
 */
const PopupButton = ({
  header,
  content,
  icon,
  label = null,
  hoverable = false,
  disabled = false,
  ...props
}) => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'button', header.toLowerCase()]
        : ['button', header.toLowerCase()],
    })}
  >
    {({logEvent}) => (
      <Popup
        disabled={disabled}
        header={header}
        content={content}
        hoverable={hoverable}
        position="top right"
        trigger={
          <Button
            icon={icon}
            style={{position: 'relative'}}
            content={label}
            onClick={() => logEvent('click')}
            {...props}
          />
        }
      />
    )}
  </Amplitude>
);
/**
 * Contains a button group for study actions
 */
const ActionButtons = ({study}) => {
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  // Get current user's profile to determine permission level
  const {data: profileData, loading} = useQuery(MY_PROFILE);
  const user = profileData && profileData.myProfile;
  const organizations = user && user.organizations;

  const studyInfoNotif = countStudyNotification(study);
  const projectNotif = countProjectNotification(study);

  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }

  const [addCollaborator] = useMutation(ADD_COLLABORATOR, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + study.kfId).toString('base64'),
        },
      },
    ],
  });
  const [createToken] = useMutation(CREATE_REFERRAL_TOKEN);
  const [transferStudy] = useMutation(TRANSFER_STUDY, {
    refetchQueries: [
      {
        query: ALL_STUDIES,
        variables: {
          organization: currentOrg && currentOrg.id,
        },
      },
    ],
  });

  if (!user || loading)
    return (
      <Table.Cell singleLine width="1">
        <Button basic loading disabled content="Loading" />
      </Table.Cell>
    );

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study actions']
          : ['study actions'],
      })}
    >
      <Table.Cell singleLine width="1">
        <Button.Group icon basic>
          <PopupButton
            header="Study Information"
            icon="info"
            as={Link}
            to={`/study/${study.kfId}/basic-info/info`}
            content={
              hasPermission(user, 'change_study') &&
              studyInfoNotif > 0 && (
                <p>
                  <Icon name="warning sign" /> Missing {studyInfoNotif} fields
                </p>
              )
            }
            label={
              hasPermission(user, 'change_study') &&
              studyInfoNotif > 0 && (
                <Label empty corner circular color="orange" />
              )
            }
          />
          <PopupButton
            header="Documents"
            icon="file"
            as={Link}
            to={`/study/${study.kfId}/documents`}
          />
          <PopupButton
            header="Cavatica Projects"
            icon={<CavaticaLogo className="mr-5 vertical-middle" />}
            as={Link}
            to={`/study/${study.kfId}/cavatica`}
            content={
              hasPermission(user, 'link_project') &&
              projectNotif > 0 && (
                <p>
                  <Icon name="warning sign" /> Missing {projectNotif} required
                  projects
                </p>
              )
            }
            label={
              hasPermission(user, 'link_project') &&
              projectNotif > 0 && <Label empty corner circular color="orange" />
            }
          />
          <PopupButton
            hoverable
            header="Collaborators"
            icon="users"
            content={
              hasPermission(user, 'add_collaborator') && (
                <>
                  <p>Manage collaborators in this study</p>
                  <Button
                    primary
                    fluid
                    content="Add Collaborator"
                    icon="add"
                    labelPosition="left"
                    onClick={() => setShowCollaborators(true)}
                  />
                </>
              )
            }
            as={Link}
            to={`/study/${study.kfId}/collaborators`}
          />
          {hasPermission(user, 'change_organization') && (
            <PopupButton
              hoverable
              header="Transfer"
              icon="exchange"
              content={
                <>
                  <p>Transfer study to an organization</p>
                  <Button
                    primary
                    content="Transfer Organization"
                    icon="exchange"
                    labelPosition="left"
                    onClick={() => setShowTransfer(true)}
                  />
                </>
              }
            />
          )}
        </Button.Group>
      </Table.Cell>
      <AddCollaboratorModal
        study={study}
        open={showCollaborators}
        onCloseDialog={() => setShowCollaborators(false)}
        addCollaborator={addCollaborator}
        inviteCollaborator={createToken}
      />
      <TransferStudyModal
        study={study}
        open={showTransfer}
        onCloseDialog={() => setShowTransfer(false)}
        transferStudy={transferStudy}
        organizations={organizations}
      />
    </Amplitude>
  );
};

export default ActionButtons;
