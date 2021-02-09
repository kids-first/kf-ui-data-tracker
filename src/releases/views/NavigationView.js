import React from 'react';
import {useQuery} from '@apollo/client';
import {Route, Switch} from 'react-router-dom';
import {Container, Grid, Menu, Segment} from 'semantic-ui-react';
import {NavLink, useLocation} from 'react-router-dom';
import {LATEST_RELEASE} from '../queries';
import {ReleaseHeader} from '../components/ReleaseHeader';
import {
  ReleasesHelp,
  ServicesHelp,
  NewServiceHelp,
} from '../components/helpers';

const Layout = () => {
  const location = useLocation();

  const {data: latestReleaseData, loading: latestReleaseLoading} = useQuery(
    LATEST_RELEASE,
  );

  const baseHref = '/releases';
  const navList = [
    {
      tab: 'Latest Releases',
      endString: '/history',
    },
    {
      tab: 'Services',
      endString: '/services',
    },
    {
      tab: 'Statistics',
      endString: '/stats',
    },
  ];

  return (
    <>
      {latestReleaseData && latestReleaseData.allReleases.edges.length > 0 && (
        <Segment basic className="science-bg">
          <Grid container className="study-header-background">
            <ReleaseHeader
              loading={latestReleaseLoading}
              release={
                latestReleaseData &&
                latestReleaseData.allReleases.edges.length &&
                latestReleaseData.allReleases.edges[0].node
              }
            />
          </Grid>
        </Segment>
      )}

      <Container>
        <Menu color="purple" compact secondary pointing>
          {navList.map((item, i) => (
            <Menu.Item
              key={i}
              name={item.tab}
              active={location.pathname.endsWith(item.endString)}
              to={baseHref + item.endString}
              as={NavLink}
            >
              {item.tab}
            </Menu.Item>
          ))}
        </Menu>
        <Switch>
          <Route exact path="/releases/history" component={ReleasesHelp} />
          <Route exact path="/releases/services" component={ServicesHelp} />
          <Route
            exact
            path="/releases/services/new-service"
            component={NewServiceHelp}
          />
        </Switch>
      </Container>
    </>
  );
};
export default Layout;
