import {
  Container,
  Dropdown,
  Grid,
  Header,
  Icon,
  Message,
  Placeholder,
  Segment,
} from 'semantic-ui-react';
import {FaFile, FaFill, FaPhotoVideo} from 'react-icons/fa';
import React, {useState} from 'react';

import {ALL_CLOUD_INVENTORY_FILES} from '../queries';
import {Chart} from 'react-charts';
import FileUploadTable from './FileUploadTable';
import {dateTime} from '../../common/dateUtils';
import {useQuery} from '@apollo/client';

const S3InventoryTab = ({match, loading, error, data}) => {
  const [dropdown, setDropdown] = useState('count_by_data_type');

  const storageAnalyses =
    data && data.allStorageAnalyses.edges.length > 0
      ? data.allStorageAnalyses.edges[0].node
      : {};

  const {
    loading: cloudInventoryLoading,
    error: cloudInventoryError,
    data: cloudInventoryData,
  } = useQuery(ALL_CLOUD_INVENTORY_FILES, {
    variables: {
      storageAnalysis: storageAnalyses.id,
    },
  });

  const inventory = storageAnalyses.stats
    ? JSON.parse(storageAnalyses.stats).inventory
    : {};

  const dropdownText = {
    count_by_bucket: 'Bucket',
    count_by_data_type: 'Data Type',
    count_by_ext: 'Extension',
    count_by_size: 'Size',
  };

  const CountStat = ({number, title, icon, color}) => (
    <div>
      <Header as="h3" className={'noMargin h-24 ' + color}>
        {number} <span className="text-14">{icon}</span>
      </Header>
      <span className={color ? 'text-10 ' + color : 'text-10 text-grey'}>
        {title}
      </span>
    </div>
  );
  const DateStat = ({date, title}) => (
    <>
      <Header as="h6" className="text-12 text-dark-grey noMargin h-24">
        <Icon name="calendar" />
        {title}
      </Header>
      <span className="text-10 text-grey">{dateTime(date)}</span>
    </>
  );

  const series = React.useMemo(
    () => ({
      type: 'bar',
    }),
    [],
  );
  const axes = React.useMemo(
    () => [
      {primary: true, type: 'ordinal', position: 'left'},
      {position: 'bottom', type: 'linear', stacked: true},
    ],
    [],
  );

  const dataChart = React.useMemo(() => {
    const rawData = inventory ? inventory[dropdown] : {};
    const col = Object.keys(rawData);
    const formatData = col.map(c => ({x: c, y: rawData[c]}));
    return [
      {
        datums: formatData,
      },
    ];
  }, [dropdown, inventory]);

  const getSeriesStyle = React.useCallback(
    series => ({
      color: '#4183c4',
    }),
    [],
  );

  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );

  if (error)
    return (
      <Container as={Segment} basic vertical>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  return (
    <Container as={Segment} basic vertical>
      {inventory && (
        <Grid columns={6}>
          <Grid.Row className="mt-6 pb-0">
            <Grid.Column textAlign="center">
              <CountStat
                number={inventory.total_buckets}
                icon={<FaFill />}
                title="bucket found"
                color="text-blue"
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <CountStat
                number={inventory.total_count}
                icon={<FaFile />}
                title="files found"
                color="text-blue"
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <CountStat
                number={Object.keys(inventory.count_by_ext).length}
                icon={<FaPhotoVideo />}
                title="file extensions detected"
                color="text-blue"
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <DateStat
                date={storageAnalyses.scannedStorageAt}
                title="Last scanned S3 at"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      <Segment raised textAlign="right" className="mt-30">
        <Header as="h4" floated="left" className="mt-6 mb-0">
          Files by {dropdownText[dropdown]}
        </Header>
        <Dropdown
          className="text-12"
          selection
          options={Object.keys(inventory)
            .filter(k => k.includes('count_by_'))
            .map(v => ({
              key: v,
              text: dropdownText[v],
              value: v,
            }))}
          value={dropdown}
          onChange={(ev, data) => {
            setDropdown(data.value);
          }}
        />
        {dataChart[0].datums.length > 0 ? (
          <Container className="h-220 mt-6">
            <Chart
              data={dataChart}
              series={series}
              axes={axes}
              getSeriesStyle={getSeriesStyle}
            />
          </Container>
        ) : (
          <Container Container textAlign="center" className="mt-6">
            <Header disabled as="h5" className="mt-15 mb-15">
              No data avaliable
            </Header>
          </Container>
        )}
      </Segment>
      <FileUploadTable
        title="Files on S3"
        loading={cloudInventoryLoading}
        error={cloudInventoryError}
        data={cloudInventoryData && cloudInventoryData.allCloudInventoryFiles}
      />
    </Container>
  );
};

export default S3InventoryTab;
