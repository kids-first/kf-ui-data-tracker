import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon, Button, Popup, Divider} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';

const CavaticaProjectItem = ({
  projectNode,
  unlinkProject,
  studyId,
  disableLink,
}) => {
  return (
    <List.Item>
      <Icon
        name={
          projectNode.projectType === 'DEL'
            ? 'paper plane outline'
            : 'sliders horizontal'
        }
      />
      <List.Content>
        {unlinkProject && studyId ? (
          <List.Content floated="right">
            <Popup
              trigger={
                <Button
                  size="mini"
                  basic
                  negative
                  onClick={e => e.stopPropagation()}
                >
                  UNLINK PROJECT
                </Button>
              }
              header="Are you sure?"
              content={
                <>
                  This will unlink the project from its study. It may always be
                  linked back later.
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
                          project: projectNode.id,
                          study: studyId ? studyId : projectNode.study.id,
                        },
                      });
                    }}
                  />
                </>
              }
              on="click"
              position="top right"
            />
          </List.Content>
        ) : (
          <List.Content floated="right">
            {projectNode.study ? (
              <>
                <Link
                  to={`/study/${projectNode.study.kfId}/documents`}
                  className={unlinkProject ? 'pr-5' : null}
                >
                  {projectNode.study.shortName ||
                    projectNode.study.name ||
                    projectNode.study.kfId}
                </Link>
                {unlinkProject && (
                  <Popup
                    trigger={
                      <Button
                        basic
                        className="micro-button"
                        color="red"
                        icon="unlink"
                        onClick={e => e.stopPropagation()}
                      />
                    }
                    header="Are you sure?"
                    content={
                      <>
                        This will unlink the project from its study. It may
                        always be linked back later.
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
                                project: projectNode.id,
                                study: studyId ? studyId : projectNode.study.id,
                              },
                            });
                          }}
                        />
                      </>
                    }
                    on="click"
                    position="top right"
                  />
                )}
              </>
            ) : projectNode.deleted ? (
              <>
                Deleted <Icon name="warning" inverted bordered color="red" />
              </>
            ) : (
              'Not linked'
            )}
          </List.Content>
        )}
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

        {projectNode.creator && <>Created by {projectNode.creator.username} </>}
        <List bulleted horizontal>
          <List.Item>
            Created <TimeAgo live={false} date={projectNode.createdOn} />
          </List.Item>
          {projectNode.workflowType && (
            <List.Item>{projectNode.workflowType}</List.Item>
          )}
          <List.Item>
            <code>{projectNode.projectId}</code>
          </List.Item>
        </List>
      </List.Content>
    </List.Item>
  );
};

export default CavaticaProjectItem;
