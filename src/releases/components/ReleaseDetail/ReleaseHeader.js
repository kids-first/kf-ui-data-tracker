import React from 'react';
import {
  Grid,
  Header,
  Icon,
  Placeholder,
  Segment,
  Label,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';

const ReleaseHeader = ({release, loading}) => {
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
    <Segment basic secondary>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column floated="left">
            <Header as="h1">
              <Header.Content>{release.name}</Header.Content>
              <Header.Subheader>
                {release.creator ? (
                  <>
                    Created by{' '}
                    <AvatarTimeAgo
                      size="tiny"
                      showUsername
                      creator={release.creator}
                      createdAt={release.createdAt}
                    />
                  </>
                ) : (
                  <>
                    Created <TimeAgo date={release.createdAt} />
                  </>
                )}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column floated="right">
            <Header as="h2" textAlign="right">
              <Header.Content>Tags</Header.Content>
              <Header.Subheader>
                <Label basic>
                  <Icon name="tag" />
                  {release.version}
                </Label>
                <Label basic>
                  <Icon name="tag" />
                  {release.kfId}
                </Label>
              </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default ReleaseHeader;
