import React from 'react';
import {Link} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Label, Icon, Popup} from 'semantic-ui-react';
import {
  countStudyNotification,
  countProjectNotification,
} from '../../common/notificationUtils';
import CavaticaLogo from '../../assets/CavaticaLogo';

/**
 * A button that displays a popup when hovered and optionally a notification
 * label in the right corner.
 */
const PopupButton = ({header, content, icon, label, ...props}) => (
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
        inverted
        header={header}
        content={content}
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
  const studyInfoNotif = countStudyNotification(study);
  const projectNotif = countProjectNotification(study);

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
          header="Collaborators"
          icon="users"
          as={Link}
          to={`/study/${study.kfId}/collaborators`}
        />
      </Button.Group>
    </Amplitude>
  );
};

export default ActionButtons;
