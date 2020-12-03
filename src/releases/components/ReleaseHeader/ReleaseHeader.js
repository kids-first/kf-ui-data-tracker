import React from 'react';
import {Grid, Header, Label, Loader} from 'semantic-ui-react';

const ReleaseHeader = ({release, loading}) => {
  const date =
    release &&
    new Date(release.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <>
      {loading ? (
        <Grid.Column width={16}>
          <Loader active />
          Loading latest release
        </Grid.Column>
      ) : (
        <>
          <Grid.Column width={8} verticalAlign="middle">
            <Header size="small">
              <Label color="purple">Latest Publication</Label> {release.name}
            </Header>
          </Grid.Column>
          <Grid.Column width={8} verticalAlign="middle" textAlign="right">
            <Header size="small">
              Version {release.version} Published on {date}
            </Header>
          </Grid.Column>
        </>
      )}
    </>
  );
};

export default ReleaseHeader;
