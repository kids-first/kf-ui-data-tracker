import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Icon,
  Button,
  Confirm,
  Message,
  Modal,
  Popup,
  Divider,
  Header,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import {projectOptions} from '../../common/enums';
import {EditProjectModal} from '../../modals';
import {LinkStudyPopup} from './LinkStudyPopup';

const ProjectAttributes = ({projectNode, disabled}) => (
  <List bulleted horizontal>
    <List.Item
      as={Header}
      sub
      disabled={disabled}
      color={
        projectOptions.find(i => i.key === projectNode.projectType).color ||
        'grey'
      }
    >
      {projectOptions.find(i => i.key === projectNode.projectType).text ||
        'Unknown'}
    </List.Item>
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

export const ImportVolumeButton = ({importVolumeFiles, projectNode}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  // Starts from 'confirm' then progresses to 'success'
  const [state, setState] = useState('confirm');

  const handleSubmit = e => {
    if (state === 'success') {
      setIsOpen(false);
      setState('confirm');
      setError('');
      setLoading(false);
      return;
    }
    setLoading(true);

    e.stopPropagation();
    importVolumeFiles({
      variables: {
        project: projectNode.id,
      },
    })
      .then(resp => {
        if (resp.errors) {
          setError(JSON.stringify(resp.errors));
        }
        setLoading(false);
        setState('success');
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  const directory = new Date().toISOString().slice(0, 10) + '-kf-data-delivery';

  return (
    <>
      <Button
        primary
        className="ml-10"
        icon={<Icon name="cloud download" />}
        content="Import Volume"
        labelPosition="left"
        size="mini"
        onClick={() => setIsOpen(true)}
      />

      <Confirm
        open={isOpen}
        header="Import volume files to Cavatica project"
        onCancel={() => {
          setState('confirm');
          setError('');
          setIsOpen(false);
        }}
        onConfirm={handleSubmit}
        confirmButton={
          loading ? (
            <Button loading disabled content="submitting" />
          ) : state === 'confirm' ? (
            'Proceed with Import'
          ) : (
            'OK'
          )
        }
        cancelButton={state === 'confirm' ? 'Cancel' : null}
        content={
          state === 'confirm' ? (
            <Modal.Content>
              <p>
                You are about to import all files from the connected study
                volume's <b>source/</b> prefix into this delivery project. Any
                users that have access to this project will be able to view
                these files.
              </p>
              <p>Here's what's about to happen:</p>
              <List bulleted>
                <List.Item>
                  A new folder named <b>{directory}</b> will be created in the
                  project
                </List.Item>
                <List.Item>
                  All files inside the <b>source/</b> prefix of the study volume
                  will be imported to this folder.
                </List.Item>
                <List.Item>
                  All files uploaded through the Data Tracker under{' '}
                  <b>source/uploads/</b> will <b>not</b> be imported
                </List.Item>
                <List.Item>
                  If the volume has already been imported to this project today,
                  the previous import will be <b>overwritten</b>
                </List.Item>
              </List>
              {error && <Message error header="Error" content={error} />}
            </Modal.Content>
          ) : (
            <Modal.Content>
              <Message
                success
                icon={<Icon size="mini" name="warning" />}
                header="Import Started"
                content={
                  <>
                    <p>Files may take a couple minutes to copy completely.</p>
                    <p>
                      Please view the{' '}
                      <a
                        as="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://cavatica.sbgenomics.com/u/${
                          projectNode.projectId
                        }/files/#q?path=${directory}`}
                      >
                        project's file directory{' '}
                        <Icon link size="small" name="external" />
                      </a>{' '}
                      and review it for any files that may not belong.
                    </p>
                  </>
                }
              />
            </Modal.Content>
          )
        }
      />
    </>
  );
};

const CavaticaProjectItem = ({
  projectNode,
  unlinkProject,
  importVolumeFiles,
  disableLink,
  editable = true,
  showLinkButton,
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
          {projectNode.projectType === 'DEL' && importVolumeFiles && (
            <ImportVolumeButton
              importVolumeFiles={importVolumeFiles}
              projectNode={projectNode}
            />
          )}
        </List.Content>
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
            {projectNode.projectType === 'DEL' && importVolumeFiles && (
              <ImportVolumeButton
                importVolumeFiles={importVolumeFiles}
                projectNode={projectNode}
              />
            )}
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
            {!projectNode.study && showLinkButton && (
              <LinkStudyPopup project={projectNode} />
            )}
            {unlinkProject && projectNode.study && (
              <UnlinkButton
                unlinkProject={unlinkProject}
                projectId={projectNode.id}
                study={projectNode.study}
              />
            )}
          </List.Content>
          <List.Content>
            <ProjectLink projectNode={projectNode} disableLink={disableLink} />
            <ProjectAttributes projectNode={projectNode} />
          </List.Content>
        </List.Item>
        <EditProjectModal
          open={editable && isEditing}
          projectNode={projectNode}
          onCloseDialog={() => setIsEditing(false)}
        />
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
  /** Whether or not to allow the edit modal to be spawned */
  editable: PropTypes.bool,
};

export default CavaticaProjectItem;
