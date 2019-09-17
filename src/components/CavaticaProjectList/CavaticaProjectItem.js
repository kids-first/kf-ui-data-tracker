import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon, Button, Popup, Divider, Header} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';

const ProjectAttributes = ({projectNode}) => (
  <List bulleted horizontal>
    <List.Item>
      Created
      {projectNode.createdBy ? ' by ' + projectNode.createdBy + ' ' : ' '}
      <TimeAgo live={false} date={projectNode.createdOn} />
    </List.Item>
    {projectNode.workflowType && (
      <List.Item>{projectNode.workflowType}</List.Item>
    )}
    <List.Item>
      <code>{projectNode.projectId}</code>
    </List.Item>
  </List>
);

const ProjectLink = ({projectNode, disableLink}) => (
  <List.Header
    as="a"
    target="_blank"
    href={
      disableLink
        ? null
        : `https://cavatica.sbgenomics.com/u/${projectNode.projectId}`
    }
  >
    {projectNode.name + ' '}
    <Icon link size="small" name="external" />
  </List.Header>
);

const StudyLink = ({study, hideLink}) => {
  if (study) {
    return (
      <Link to={`/study/${study.kfId}/documents`}>
        {hideLink ? '' : study.shortName || study.name || study.kfId}
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
  studyId,
  disableLink,
}) => {
  if (projectNode.deleted) {
    return (
      <List.Item className="disabled">
        <List.Content floated="right" verticalAlign="middle">
          Deleted
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
            projectNode.projectType === 'DEL'
              ? 'paper plane outline'
              : 'sliders horizontal'
          }
        />
        <List.Content>
          <List.Header as={Header} disabled size="tiny">
            {projectNode.name + ' '}
          </List.Header>
          <ProjectAttributes projectNode={projectNode} />
        </List.Content>
      </List.Item>
    );
  } else {
    return (
      <List.Item>
        <List.Content floated="right">
          <StudyLink study={projectNode.study} hideLink={studyId} />
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
            projectNode.projectType === 'DEL'
              ? 'paper plane outline'
              : 'sliders horizontal'
          }
        />
        <List.Content>
          <ProjectLink projectNode={projectNode} disableLink={disableLink} />
          <ProjectAttributes projectNode={projectNode} />
        </List.Content>
      </List.Item>
    );
  }
};

export default CavaticaProjectItem;
