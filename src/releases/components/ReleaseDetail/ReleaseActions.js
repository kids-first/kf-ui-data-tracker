import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  Button,
  Confirm,
  Icon,
  Label,
  Menu,
  Message,
  Modal,
} from 'semantic-ui-react';

import {START_RELEASE, PUBLISH_RELEASE, CANCEL_RELEASE} from '../../mutations';

const ReleaseActions = ({release, user, history, match}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const [
    startRelease,
    {loading: startReleaseLoading, error: startReleaseError},
  ] = useMutation(START_RELEASE);

  const [
    publishRelease,
    {loading: publishReleaseLoading, error: publishReleaseError},
  ] = useMutation(PUBLISH_RELEASE);

  const [
    cancelRelease,
    {loading: cancelReleaseLoading, error: cancelReleaseError},
  ] = useMutation(CANCEL_RELEASE);

  const handleConfirm = () => {
    const curRelease = release;
    const services = release.tasks.edges.map(
      ({node}) => node.releaseService.id,
    );
    const newRelease = {
      name: curRelease.name,
      description: curRelease.description,
      studies: curRelease.studies.edges.map(({node}) => node.id),
      tags: curRelease.tags,
      isMajor: curRelease.isMajor,
      services,
    };

    startRelease({variables: {input: newRelease}})
      .then(resp => {
        history.push(
          `/releases/history/${resp.data.startRelease.release.kfId}`,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const publish = () => {
    publishRelease({variables: {release: release.id}});
  };

  const cancel = () => {
    cancelRelease({variables: {release: release.id}});
  };

  return (
    <Menu secondary vertical fluid>
      <Menu.Item header as="h4" className="text-grey noMargin">
        Actions
      </Menu.Item>
      {(startReleaseError || publishReleaseError || cancelReleaseError) && (
        <Message
          negative
          header="Error"
          content={startReleaseError + publishReleaseError + cancelReleaseError}
        />
      )}
      {!(
        release.state === 'published' ||
        release.state === 'publishing' ||
        release.state === 'canceling' ||
        release.state === 'canceled' ||
        release.state === 'failed'
      ) && (
        <Menu.Item
          onClick={cancel}
          disabled={release.state === 'canceling' || cancelReleaseLoading}
        >
          <Icon name="cancel" />
          Cancel
        </Menu.Item>
      )}
      {release.state === 'staged' && (
        <Menu.Item onClick={publish} disabled={publishReleaseLoading}>
          Publish
          <Icon name="bookmark" />
        </Menu.Item>
      )}
      <Menu.Item onClick={() => setShowConfirm(!showConfirm)}>
        Run Again
        <Icon name="repeat" />
      </Menu.Item>
      <Confirm
        open={showConfirm}
        cancelButton="Cancel"
        confirmButton={
          <Button loading={startReleaseLoading}>Start New Release</Button>
        }
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        header={`Restart release: '${release.name}'`}
        content={
          <Modal.Content>
            <p>
              You are about to start a new release identical to this release. It
              will be assigned a new release id an version number but will be
              identical otherwise.
            </p>
            {release.studies && (
              <Label.Group>
                {release.studies.edges.map(({node}) => (
                  <Label basic key={node.kfId}>
                    <Icon name="database" />
                    {node.kfId}
                  </Label>
                ))}
              </Label.Group>
            )}
          </Modal.Content>
        }
      />
    </Menu>
  );
};

export default ReleaseActions;
