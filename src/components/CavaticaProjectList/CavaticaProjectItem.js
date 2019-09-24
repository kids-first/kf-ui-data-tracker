import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {List, Icon, Button, Popup, Divider, Header} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import {EditProjectModal} from '../../modals';

const ProjectAttributes = ({projectNode, disabled}) => (
  <List bulleted horizontal>
    <List.Item disabled={disabled}>
      Created
      {projectNode.createdBy ? ' by ' + projectNode.createdBy + ' ' : ' '}
      <TimeAgo
        live={false}
        date={projectNode.createdOn}
        title={longDate(projectNode.createdOn)}
      />
    </List.Item>
    {projectNode.workflowType && (
      <List.Item disabled={disabled}>{projectNode.workflowType}</List.Item>
    )}
    <List.Item disabled={disabled}>
      <code>{projectNode.projectId}</code>
    </List.Item>
  </List>
);

const ProjectLink = ({projectNode, disableLink}) => {
  if (disableLink) {
    return <List.Header>{projectNode.name}</List.Header>;
  } else {
    return (
      <List.Header
        as="a"
        target="_blank"
        href={`https://cavatica.sbgenomics.com/u/${projectNode.projectId}`}
      >
        {projectNode.name + ' '}
        <Icon link size="small" name="external" />
      </List.Header>
    );
  }
};

const StudyLink = ({study}) => {
  if (study) {
    return (
      <Link to={`/study/${study.kfId}/documents`}>
        {study.shortName || study.name || study.kfId}
      </Link>
    );
  } else {
    return 'Not linked';
  }
};

const UnlinkButton = ({unlinkProject, study, projectId}) => (
  <Popup
    trigger={
      <Button
        basic
        negative
        floated="right"
        size="mini"
        icon="unlink"
        content="UNLINK"
        className="ml-10"
        onClick={e => e.stopPropagation()}
      />
    }
    header="Are you sure?"
    content={
      <>
        This will unlink the project from its study. It may always be linked
        back later.
        <Divider />
        <Button
          data-testid="delete-confirm"
          negative
          fluid
          icon={<Icon name="unlink" />}
          content="Unlink"
          onClick={e => {
            e.stopPropagation();
            unlinkProject({
              variables: {
                project: projectId,
                study: study.id,
              },
            });
          }}
        />
      </>
    }
    on="click"
    position="top right"
  />
);

const CavaticaProjectItem = ({
  projectNode,
  unlinkProject,
  disableLink,
  hideStudy,
  editable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  if (projectNode.deleted) {
    return (
      <List.Item>
        <List.Content floated="right" verticalAlign="middle">
          {unlinkProject && projectNode.study && (
            <UnlinkButton
              unlinkProject={unlinkProject}
              projectId={projectNode.id}
              study={projectNode.study}
            />
          )}
        </List.Content>
        <Icon
          color="grey"
          name={
            projectNode.projectType === 'DEL'
              ? 'paper plane outline'
              : 'sliders horizontal'
          }
        />
        <List.Content>
          <Header floated="right" disabled size="tiny">
            Deleted
          </Header>
          <List.Header as={Header} color="grey" size="tiny">
            {projectNode.name + ' '}
          </List.Header>
          <ProjectAttributes projectNode={projectNode} disabled />
        </List.Content>
      </List.Item>
    );
  } else {
    return (
      <>
        <List.Item>
          <List.Content floated="right">
            {!hideStudy && <StudyLink study={projectNode.study} />}
            {editable && (
              <Popup
                trigger={
                  <Button
                    primary
                    basic
                    size="mini"
                    floated="right"
                    icon="pencil"
                    content="EDIT"
                    onClick={() => setIsEditing(true)}
                  />
                }
                inverted
                content="Edit this project"
                on="hover"
                position="top right"
              />
            )}
            {unlinkProject && projectNode.study && (
              <UnlinkButton
                unlinkProject={unlinkProject}
                projectId={projectNode.id}
                study={projectNode.study}
              />
            )}
          </List.Content>
          <Icon
            name={
              {
                DEL: 'paper plane outline',
                HAR: 'sliders horizontal',
                RES: 'flask',
              }[projectNode.projectType]
            }
          />
          <List.Content>
            <ProjectLink projectNode={projectNode} disableLink={disableLink} />
            <ProjectAttributes projectNode={projectNode} />
          </List.Content>
        </List.Item>
        {editable && isEditing && (
          <EditProjectModal
            projectNode={projectNode}
            onCloseDialog={() => setIsEditing(false)}
          />
        )}
      </>
    );
  }
};

CavaticaProjectItem.propTypes = {
  /** Project object with study object nested if linked */
  projectNode: PropTypes.object.isRequired,
  /** Action to unlink a project taking project id and study id */
  unlinkProject: PropTypes.func,
  /** If disable the external link to Cavatica on project name */
  disableLink: PropTypes.bool,
  /** For linked project if to hide the study link */
  hideStudy: PropTypes.bool,
  /** Whether or not to allow the edit modal to be spawned */
  editable: PropTypes.bool,
};

export default CavaticaProjectItem;
