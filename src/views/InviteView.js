import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import {Redirect} from 'react-router-dom';
import {
  Container,
  Dimmer,
  Header,
  Image,
  Loader,
  Segment,
} from 'semantic-ui-react';
import {NotFoundView} from '../views';
import {EXCHANGE_REFERRAL_TOKEN} from '../state/mutations';
import added from '../assets/added.svg';
import StudyTable from '../components/StudyList/StudyTable';

export const InviteView = ({history}) => {
  const [
    exchangeToken,
    {
      loading: exchangeTokenLoading,
      error: exchangeTokenError,
      data: exchangeTokenData,
    },
  ] = useMutation(EXCHANGE_REFERRAL_TOKEN);
  const qs = queryString.parse(history.location.search);

  const [columns, setColumns] = useState({
    columns: [],
    sorting: {
      column: 'name',
      direction: 'descending',
    },
  });

  useEffect(() => {
    const relayId =
      qs.token &&
      Buffer.from('ReferralTokenNode:' + qs.token).toString('base64');
    exchangeToken({variables: {token: relayId}});
  }, [exchangeToken, qs.token]);

  // If there's no token, return to the home screen
  if (!qs.token) {
    return <Redirect to="/" />;
  }

  // If the user is not logged in or does not have an account yet, we need them
  // to log in first before we can exchange an invite token for them.
  if (localStorage.getItem('accessToken') === null) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {from: window.location.pathname + window.location.search},
        }}
      />
    );
  }

  if (exchangeTokenError) {
    return (
      <NotFoundView
        title="Error"
        message={[...exchangeTokenError.graphQLErrors]
          .map(err => err.message)
          .join(' ')}
      />
    );
  }

  if (exchangeTokenLoading || !exchangeTokenData) {
    return (
      <Dimmer active>
        <Loader active inverted>
          Adding you to studies...
        </Loader>
      </Dimmer>
    );
  }

  const studies =
    exchangeTokenData.exchangeReferralToken.referralToken.studies.edges;

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
          We added you to {studies && studies.length} studies in the Data
          Tracker. Nice!
          <Header.Subheader>
            Your new studies are listed below. See all your studies and details
            on <Link to="/">your studies</Link> page.
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
