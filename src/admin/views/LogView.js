import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Header,
  Icon,
  List,
  Segment,
  Button,
} from 'semantic-ui-react';
import Ansi from 'ansi-to-react';
import {GET_LOG} from '../queries';

const LogView = ({match}) => {
  const [loading, setLoading] = useState(false);
  const [logContents, setLogContents] = useState();

  const {data: logData, error: logError} = useQuery(GET_LOG, {
    variables: {
      id: match.params.logId,
    },
  });

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      if (logError || !logData) {
        console.log('error loading log');
        setLoading(false);
      }
      fetch(logData.jobLog.downloadUrl, {
        headers: new Headers({
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        }),
      }).then(res => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        reader.read().then(result => {
          const contents = decoder.decode(result.value);
          setLogContents(contents);
          setLoading(false);
        });
      });
    };

    if (logData && logData.jobLog.downloadUrl) {
      getData();
    }
  }, [logData, logError]);

  const jobId =
    logData &&
    Buffer.from(logData.jobLog.id, 'base64')
      .toString('ascii')
      .split(':')[1];

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Log Output</title>
      </Helmet>
      <Link to={`/logs`}>
        <Button basic labelPosition="left" floated="left">
          <Icon name="arrow left" />
          All Logs
        </Button>
      </Link>
      <Header>Log Output</Header>
      {logData && (
        <List>
          <List.Item>
            Job: <code>{logData.jobLog.job.name}</code>
          </List.Item>
          <List.Item>
            Log ID: <code>{jobId}</code>
          </List.Item>
          <List.Item>
            Run on {new Date(logData.jobLog.createdAt).toLocaleString()}
          </List.Item>
        </List>
      )}
      {loading && <pre className="ansi terminal">Loading log...</pre>}
      {logContents && (
        <pre className="ansi terminal">
          <Ansi useClasses>{logContents}</Ansi>
        </pre>
      )}
    </Container>
  );
};

export default LogView;
