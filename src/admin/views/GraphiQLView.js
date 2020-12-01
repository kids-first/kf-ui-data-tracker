import React, {Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {Segment} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import {KF_STUDY_API} from '../../common/globals';
import 'graphiql/graphiql.min.css';
const GraphiQL = React.lazy(() => import('graphiql'));

const fetcher = async graphQLParams => {
  const token = localStorage.getItem('accessToken');
  const data = await fetch(KF_STUDY_API + '/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'same-origin',
  });
  return data.json().catch(() => data.text());
};

const GraphiQLView = () => {
  return (
    <Segment basic>
      <Helmet>
        <title>Kids First Data Tracker GraphiQL</title>
      </Helmet>
      <Suspense fallback={<span>Loading GraphiQL...</span>}>
        <GraphiQL fetcher={fetcher} />
      </Suspense>
    </Segment>
  );
};

export default GraphiQLView;
