import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Header, Label, Table, Icon, Popup} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {
  countStudyNotification,
  countProjectNotification,
} from '../../common/notificationUtils';
import CavaticaLogo from '../../assets/CavaticaLogo';
import {KF_COORD_UI} from '../../common/globals';

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
 * Formats a link to a release
 */
const Release = ({release}) => {
  if (!release) return '-';

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'release version']
          : ['release version'],
      })}
    >
      {({logEvent}) => (
        <Popup
          header={release.name}
          position="top center"
          trigger={
            <a
              href={`${KF_COORD_UI}/releases/${release.kfId}`}
              onClick={() => logEvent('click')}
            >
              {release.version + ' '}
              <Icon.Group>
                <Icon name="tag" />
                <Icon corner="top right" name="external" />
              </Icon.Group>
            </a>
          }
          content={
            <>
              {release.version} <Icon name="tag" /> -{' '}
              <code>{release.kfId}</code>
              <p>
                Published <TimeAgo date={release.createdAt} />
              </p>
              <em>View in the Release Coordinator</em>
            </>
          }
        />
      )}
    </Amplitude>
  );
};

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

const renderRow = node => ({
  key: node.kfId,
  cells: [
    {
      key: 'name',
      selectable: true,
      content: (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'study name']
              : ['study name'],
          })}
        >
          {({logEvent}) => (
            <Link
              to={'/study/' + node.kfId + '/basic-info/info'}
              onClick={() => logEvent('click')}
            >
              <Header size="medium">
                {node.name}
                <Header.Subheader>
                  {(node.collaborators.edges.length &&
                    node.collaborators.edges[0].node.username) ||
                    node.shortName}
                </Header.Subheader>
              </Header>
            </Link>
          )}
        </Amplitude>
      ),
    },
    {
      key: 'kfId',
      width: 1,
      textAlign: 'center',
      selectable: true,
      content: (
        <Link to={'/study/' + node.kfId + '/basic-info/info'}>
          <code>{node.kfId}</code>
        </Link>
      ),
    },
    {
      key: 'version',
      textAlign: 'center',
      width: 1,
      selectable: true,
      content: (
        <Release
          release={node.release && node.release.node && node.release.node}
        />
      ),
    },
    {
      key: 'actions',
      textAlign: 'right',
      content: <ActionButtons study={node} />,
      width: 1,
    },
  ],
});

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
}) => {
  if (loading) {
    return <h2>loading studies</h2>;
  }

  const studies = studyList.map(({node}) => node);

  const header = [
    {key: 'name', content: 'Name'},
    {key: 'kfId', content: 'Kids First ID', textAlign: 'center'},
    {key: 'version', content: 'Version', textAlign: 'center'},
    {key: 'actions', content: 'Actions', textAlign: 'center'},
  ];

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study table']
          : ['study table'],
      })}
    >
      <Table
        singleLine
        striped
        selectable
        sortable
        celled
        headerRow={header}
        tableData={studies}
        renderBodyRow={renderRow}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
