import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import {ADD_COLLABORATOR} from '../../state/mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Label, Icon, Popup} from 'semantic-ui-react';
import {
  countStudyNotification,
  countProjectNotification,
} from '../../common/notificationUtils';
import CavaticaLogo from '../../assets/CavaticaLogo';
import AddCollaboratorModal from '../../modals/AddCollaboratorModal';

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
  const studyInfoNotif = countStudyNotification(study);
  const projectNotif = countProjectNotification(study);

  const [addCollaborator] = useMutation(ADD_COLLABORATOR, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          kfId: study.kfId,
        },
      },
    ],
  });

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study actions']
          : ['study actions'],
      })}
    >
      <Button.Group icon basic>
        <PopupButton
          header="Study Information"
          icon="info"
          as={Link}
          to={`/study/${study.kfId}/basic-info/info`}
          content={
            studyInfoNotif > 0 && (
              <p>
                <Icon name="warning sign" /> Missing {studyInfoNotif} fields
              </p>
            )
          }
          label={
            studyInfoNotif > 0 && <Label empty corner circular color="orange" />
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
            projectNotif > 0 && (
              <p>
                <Icon name="warning sign" /> Missing {projectNotif} required
                projects
              </p>
            )
          }
          label={
            projectNotif > 0 && <Label empty corner circular color="orange" />
          }
        />
        <PopupButton
          hoverable
          header="Collaborators"
          icon="users"
          content={
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
          }
          as={Link}
          to={`/study/${study.kfId}/collaborators`}
        />
      </Button.Group>
      <AddCollaboratorModal
        study={study}
        open={showCollaborators}
        onCloseDialog={() => setShowCollaborators(false)}
        addCollaborator={addCollaborator}
      />
    </Amplitude>
  );
};

export default ActionButtons;
