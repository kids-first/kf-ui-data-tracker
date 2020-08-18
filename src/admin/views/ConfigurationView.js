import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Header,
  Segment,
  Icon,
  Table,
  Dimmer,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {FEATURES, SETTINGS} from '../../state/queries';
import gql from 'graphql-tag';

const FeatureTable = ({features}) => (
  <Table
    tableData={features}
    headerRow={[
      {content: 'Feature', key: 'features0'},
      {content: 'Enabled', textAlign: 'center', key: 'features1'},
    ]}
    renderBodyRow={(data, index) => ({
      key: data.name,
      cells: [
        {content: data.name, key: data.name + '0'},
        {
          key: data.name + '1',
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
    headerRow={[
      {content: 'Setting', key: 'settings0'},
      {content: 'Value', textAlign: 'left', key: 'settings1'},
    ]}
    renderBodyRow={(data, index) => ({
      key: data.name,
      cells: [
        {content: data.name, key: data.name + '0'},
        {
          content: data.value,
          textAlign: 'left',
          key: data.name + '1',
        },
      ],
    })}
  />
);

const Queues = ({queues}) => (
  <Table
    tableData={queues}
    headerRow={[
      {content: 'Queue', key: 'queues0'},
      {content: 'Jobs', key: 'queues1'},
      {content: 'Workers', key: 'queues2'},
      {content: 'Started Jobs', textAlign: 'right', key: 'queues3'},
      {content: 'Failed Jobs', textAlign: 'right', key: 'queues4'},
      {content: 'Finished Jobs', textAlign: 'right', key: 'queues5'},
    ]}
    renderBodyRow={(data, index) => ({
      key: data.name,
      cells: [
        {content: data.name, key: data.name + '0'},
        {content: data.jobs, key: data.name + '1'},
        {content: data.workers, key: data.name + '2'},
        {content: data.started_jobs, textAlign: 'right', key: data.name + '3'},
        {content: data.failed_jobs, textAlign: 'right', key: data.name + '4'},
        {content: data.finished_jobs, textAlign: 'right', key: data.name + '5'},
      ],
    })}
  />
);

const Jobs = ({jobs}) => (
  <Table
    tableData={jobs}
    headerRow={[
      {content: 'Job', key: 'jobs0'},
      {content: 'Status', textAlign: 'center', key: 'jobs1'},
      {content: 'Error Message', key: 'jobs2'},
      {content: 'Last Run', textAlign: 'right', key: 'jobs3'},
      {content: 'Next Run', textAlign: 'right', key: 'jobs4'},
    ]}
    renderBodyRow={(data, index) => ({
      key: data.name,
      cells: [
        {content: data.name, key: data.name + '0'},
        {
          content: data.failing ? (
            <Icon name="delete" />
          ) : data.active ? (
            <Icon name="check" />
          ) : (
            <Icon name="delete" />
          ),
          textAlign: 'center',
          key: data.name + '1',
        },
        {content: data.lastError, key: data.name + '2'},
        {
          content: <TimeAgo date={data.lastRun} live={false} />,
          textAlign: 'right',
          key: data.name + '3',
        },
        {
          content: <TimeAgo date={data.enqueuedAt} live={false} />,
          textAlign: 'right',
          key: data.name + '4',
        },
      ],
      error: data.failing,
    })}
  />
);

/**
 * A place holder skeleton for configuration table
 */
const LoadingTable = () => (
  <Segment basic className="noPadding">
    <Dimmer active inverted />
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[1, 2, 3, 4].map(i => (
          <Table.Row key={i}>
            <Table.Cell />
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Segment>
);

const StatusTables = ({featuresString, settingsString}) => {
  const FEATURES_FIELDS = gql`
    ${featuresString}
  `;
  const SETTINGS_FIELDS = gql`
    ${settingsString}
  `;

  const STATUS = gql`
    query Status {
      status {
        name
        version
        commit
        features {
          ...FeaturesFields
        }
        settings {
          ...SettingsFields
        }
        queues
        jobs {
          edges {
            node {
              id
              name
              active
              failing
              lastRun
              lastError
              createdOn
              enqueuedAt
            }
          }
        }
      }
    }
    ${FEATURES_FIELDS}
    ${SETTINGS_FIELDS}
  `;

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
        value:
          data.status.settings[key] === null
            ? 'No data'
            : data.status.settings[key].toString(),
      }));

  const queues = data && data.status.queues && JSON.parse(data.status.queues);

  const jobs =
    data &&
    data.status.jobs &&
    data.status.jobs.edges.map(({node}) => ({
      name: node.name,
      active: node.active,
      failing: node.failing,
      lastRun: node.lastRun,
      lastError: node.lastError,
      enqueuedAt: node.enqueuedAt,
    }));
  return (
    <>
      <Header as="h4">Feature Flags</Header>
      {features ? <FeatureTable features={features} /> : <LoadingTable />}
      <Header as="h4">Settings</Header>
      {settings ? <SettingsTable settings={settings} /> : <LoadingTable />}
      <Header as="h4">Queues</Header>
      {queues ? <Queues queues={queues} /> : <LoadingTable />}
      <Header as="h4">Jobs</Header>
      {jobs ? <Jobs jobs={jobs} /> : <LoadingTable />}
    </>
  );
};

const ConfigurationView = () => {
  const {data: settingsFields} = useQuery(SETTINGS, {});
  const {data: featuresFields} = useQuery(FEATURES, {});

  const featuresFragments =
    featuresFields && featuresFields.__type.fields.map(i => i.name).join(' ');
  const settingsFragments =
    settingsFields && settingsFields.__type.fields.map(i => i.name).join(' ');

  const featuresString =
    'fragment FeaturesFields on Features {' + featuresFragments + '}';
  const settingsString =
    'fragment SettingsFields on Settings {' + settingsFragments + '}';

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
        {featuresFragments && settingsFragments && (
          <StatusTables
            featuresString={featuresString}
            settingsString={settingsString}
          />
        )}
      </Container>
    </>
  );
};

export default ConfigurationView;
