import React from 'react';
import {useMutation} from '@apollo/client';
import {Grid, Header, Icon, Placeholder, Label} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import {UPDATE_RELEASE} from '../../mutations';
import ReleaseName from './ReleaseName';

const ReleaseHeader = ({allowEdit, release, loading}) => {
  const [updateRelease] = useMutation(UPDATE_RELEASE);

  if (loading || !release) {
    return (
      <Placeholder>
        <Placeholder.Header>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    );
  }

  return (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column width={16}>
          <Header as="h2" className="pt-10">
            <ReleaseName
              release={release}
              updateRelease={allowEdit && updateRelease}
            />
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={10}>
          <Header color="grey">Basic info</Header>
          {release.creator ? (
            <AvatarTimeAgo
              size="tiny"
              showUsername
              creator={release.creator}
              createdAt={release.createdAt}
            />
          ) : (
            <>
              Created <TimeAgo date={release.createdAt} />
            </>
          )}
          <Label size="small" basic>
            <Icon name="tag" />
            {release.version}
          </Label>
          <Label basic size="small">
            <Icon name="tag" />
            {release.kfId}
          </Label>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ReleaseHeader;
