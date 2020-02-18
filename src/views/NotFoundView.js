import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Container, Segment, Header, Icon} from 'semantic-ui-react';
/**
 * Error view handling invalid study or document id
 */
const NotFoundView = ({title, message, location}) => {
  const noErrorPath = ['/login', '/logout', '/callback'];
  if (location && noErrorPath.includes(location.pathname)) {
    return <></>;
  }
  return (
    <Container as={Segment} basic placeholder>
      <Helmet>
        <title>{`KF Data Tracker - ${title || '404 Page not found'}`}</title>
      </Helmet>
      <Header as="h2" icon>
        <Icon name="frown outline" />
        {title || '404 Page not found'}
        <Header.Subheader>
          {message ? (
            <p>{message}</p>
          ) : (
            <p>
              No match found for <code>{location.pathname}</code>
            </p>
          )}
          <Link to={`/`}>Click here to go back to your studies</Link>
        </Header.Subheader>
      </Header>
    </Container>
  );
};

export default NotFoundView;
