import React, {Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {Segment} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import {KF_STUDY_API} from '../../common/globals';
const Voyager = React.lazy(() => import('../components/Voyager'));

const introspectionProvider = query => {
  const token = localStorage.getItem('accessToken');
  return fetch(KF_STUDY_API + '/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({query: query}),
  }).then(response => response.json());
};

const ModelExplorerView = () => {
  return (
    <Segment basic>
      <Helmet>
        <title>Kids First Data Tracker Schema</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.css"
        />
      </Helmet>
      <Suspense fallback={<span>Loading Voyager library...</span>}>
        <Voyager
          introspection={introspectionProvider}
          workerURI={process.env.PUBLIC_URL + '/voyager.worker.js'}
        />
      </Suspense>
    </Segment>
  );
};

export default ModelExplorerView;
