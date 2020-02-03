import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Header, Segment, Icon, Table} from 'semantic-ui-react';
import {STATUS} from '../state/queries';

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

        <Header as="h4">Settings</Header>
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
      </Container>
    </>
  );
};

export default ConfigurationView;
