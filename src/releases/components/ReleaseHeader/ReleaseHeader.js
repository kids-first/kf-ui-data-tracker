import React from 'react';
import {
  Grid,
  Header,
  Label,
  Loader,
  Segment,
  Statistic,
} from 'semantic-ui-react';

const ReleaseHeader = ({release, loading}) => {
  const date =
    release &&
    new Date(release.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Grid as={Segment} secondary divided color="green">
      <Label attached="top left" color="green">
        Latest Publication
      </Label>
      {loading ? (
        <Grid.Column width={16}>
          <Loader active />
          Loading latest release
        </Grid.Column>
      ) : (
        <>
          <Grid.Column width={8} verticalAlign="middle">
            <Header>{release.name}</Header>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle" textAlign="center">
            <Statistic size="small" label="version" value={release.version} />
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle" textAlign="center">
            <Statistic size="small" label="published on" value={date} />
          </Grid.Column>
        </>
      )}
    </Grid>
  );
};

export default ReleaseHeader;
