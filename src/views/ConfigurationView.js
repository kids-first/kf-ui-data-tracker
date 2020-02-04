import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Header, Segment, Icon, Table} from 'semantic-ui-react';
import {STATUS} from '../state/queries';

const FeatureTable = ({features}) => (
  <Table
    tableData={features}
    headerRow={['Feature', {content: 'Enabled', textAlign: 'center'}]}
    renderBodyRow={(data, index) => ({
      cells: [
        {content: data.name},
        {
          content: <Icon name={data.enabled ? 'check' : 'delete'} />,
          textAlign: 'center',
        },
      ],
      warning: !data.enabled,
      positive: data.enabled,
    })}
  />
);

const SettingsTable = ({settings}) => (
  <Table
    tableData={settings}
    headerRow={['Setting', {content: 'Value', textAlign: 'left'}]}
    renderBodyRow={(data, index) => ({
      cells: [
        {content: data.name},
        {
          content: data.value,
          textAlign: 'left',
        },
      ],
    })}
  />
);

const Queues = ({queues}) => (
  <Table
    tableData={queues}
    headerRow={[
      'Queue',
      'Jobs',
      'Workers',
      {content: 'Started Jobs', textAlign: 'right'},
      {content: 'Failed Jobs', textAlign: 'right'},
      {content: 'Finished Jobs', textAlign: 'right'},
    ]}
    renderBodyRow={(data, index) => ({
      cells: [
        {content: data.name},
        {content: data.jobs},
        {content: data.workers},
        {content: data.started_jobs, textAlign: 'right'},
        {content: data.failed_jobs, textAlign: 'right'},
        {content: data.finished_jobs, textAlign: 'right'},
      ],
    })}
  />
);

const ConfigurationView = () => {
  const {data} = useQuery(STATUS);

  const features =
    data &&
    data.status.features &&
    Object.keys(data.status.features)
      .filter(key => !key.includes('__'))
      .map(key => ({
        name: key,
        enabled: data.status.features[key],
      }));

  const settings =
    data &&
    data.status.settings &&
    Object.keys(data.status.settings)
      .filter(key => !key.includes('__'))
      .map(key => ({
        name: key,
        value: data.status.settings[key],
      }));

  const queues = data && data.status.queues && JSON.parse(data.status.queues);

  // const queues = [
  //   {
  //     name: 'cavatica',
  //     jobs: 0,
  //     workers: 0,
  //     finished_jobs: 100,
  //   },
  //   {
  //     name: 'default',
  //     jobs: 0,
  //     workers: 0,
  //     finished_jobs: 100,
  //   },
  // ];

  return (
    <>
      <Helmet>
        <title>KF Data Tracker - Configuration</title>
      </Helmet>
      <Container as={Segment} basic>
        <Header as="h3">Data Tracker Configuration</Header>
        <Segment basic>
          These are the features and settings that the Data Tracker is running
          with. They are for debug purposes only and require deployment changes
          to be modified.
        </Segment>

        <Header as="h4">Feature Flags</Header>
        <FeatureTable features={features} />

        <Header as="h4">Settings</Header>
        <SettingsTable settings={settings} />

        <Header as="h4">Queues</Header>
        <Queues queues={queues} />
      </Container>
    </>
  );
};

export default ConfigurationView;
