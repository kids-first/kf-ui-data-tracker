import React, {useState, useEffect} from 'react';
import {ApolloConsumer} from '@apollo/client';
import {Helmet} from 'react-helmet';
import jwtDecode from 'jwt-decode';
import queryString from 'query-string';
import {useMutation} from '@apollo/client';
import {Redirect} from 'react-router-dom';
import {
  Container,
  Dimmer,
  Header,
  Image,
  Loader,
  Segment,
  Button,
  Icon,
} from 'semantic-ui-react';
import {NotFoundView} from '../views';
import {EXCHANGE_REFERRAL_TOKEN} from '../state/mutations';
import {auth} from '../state/auth';
import StudyTable from '../components/StudyList/StudyTable';
import {ImageMessage} from '../components/ImageMessage';
import welcome from '../assets/welcome.svg';
import added from '../assets/added.svg';

export const InviteView = ({history}) => {
  const [
    exchangeToken,
    {
      loading: exchangeTokenLoading,
      error: exchangeTokenError,
      data: exchangeTokenData,
    },
  ] = useMutation(EXCHANGE_REFERRAL_TOKEN);

  const [columns, setColumns] = useState({
    columns: [],
    sorting: {
      column: 'name',
      direction: 'descending',
    },
  });

  // Check access token
  const accessToken = localStorage.getItem('accessToken');
  const accessTokenValid =
    accessToken && new Date().getTime() < jwtDecode(accessToken).exp * 1000;

  // Try to claim the referral token
  const qs = queryString.parse(history.location.search);
  const tokenRelayId =
    qs.token && Buffer.from('ReferralTokenNode:' + qs.token).toString('base64');

  useEffect(() => {
    exchangeToken({variables: {token: tokenRelayId}}).catch(err => {
      console.log('Exchange token error');
      console.log(err);
    });
  }, [exchangeToken, tokenRelayId]);

  // Check if current logged in user is the intended recipient of the referral
  // token
  const tokenErrorMessage = exchangeTokenError
    ? [...exchangeTokenError.graphQLErrors].map(err => err.message).join(' ')
    : '';
  const wrongUserError = tokenErrorMessage.includes('cannot use this referral');

  // If there's no token, return to the home screen
  if (!qs.token) {
    return <Redirect to="/" />;
  }

  // User is not logged in or doesn't exist
  if (!accessTokenValid) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {from: window.location.pathname + window.location.search},
        }}
      />
    );
  }
  if (!exchangeTokenError && (exchangeTokenLoading || !exchangeTokenData)) {
    return (
      <Dimmer active>
        <Loader active inverted>
          Verifying referral link...
        </Loader>
      </Dimmer>
    );
  }
  if (accessTokenValid && exchangeTokenError && wrongUserError) {
    return (
      <>
        <Container
          as={Segment}
          basic
          vertical
          padded="very"
          textAlign="center"
          text
        >
          <Helmet>
            <title>KF Data Tracker - User Invitation </title>
          </Helmet>
          <ImageMessage
            image={welcome}
            title="User Invitation Error"
            message={
              <>
                {tokenErrorMessage}. Please logout and signup or login with the
                correct email. If you have any issues, please get in touch at{' '}
                <a href="mailto:support@kidsfirstdrc.org">
                  support@kidsfirstdrc.org
                </a>
              </>
            }
          />
          <ApolloConsumer>
            {client => (
              <Button
                className="mb-15"
                size="big"
                onClick={() => auth.logout(window.location.href)}
                positive
                icon
                labelPosition="right"
              >
                Click here to logout
                <Icon name="chevron right" />
              </Button>
            )}
          </ApolloConsumer>
        </Container>
      </>
    );
  }

  if (exchangeTokenError && !wrongUserError) {
    return (
      <NotFoundView
        title="Exchange Token Error"
        message={[
          ...exchangeTokenError.graphQLErrors,
          {
            message: 'You may have already used the referral link',
          },
        ]
          .map(err => err.message)
          .join(' ')}
      />
    );
  }
  // Set to null so that the header will be forced to refetch the user's profile
  localStorage.setItem('currentOrganization', 'null');

  const studies =
    exchangeTokenData.exchangeReferralToken.referralToken.studies.edges;
  const org =
    exchangeTokenData.exchangeReferralToken.referralToken.organization;

  const handleSort = column => () => {
    const direction =
      columns.sorting.column !== column
        ? 'ascending'
        : columns.sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setColumns({
      ...columns,
      sorting: {column, direction},
    });
  };

  return (
    <>
      <Container as={Segment} basic vertical padded="very" text>
        <Header textAlign="center" as="h1">
          You're In!
        </Header>
        <Image centered src={added} size="large" />
        <Header textAlign="center">
          We added you to your new organization {org.name}
          <br />
          and {studies && studies.length} studies in the Data Tracker. Nice!
          <Header.Subheader>
            Your new studies are listed below. Click a study to view its details
            in Data Tracker!
          </Header.Subheader>
        </Header>
        <Header as="h1">Your new studies</Header>
        <StudyTable
          studyList={studies}
          handleSort={handleSort}
          columns={columns}
        />
      </Container>
    </>
  );
};

export default InviteView;
