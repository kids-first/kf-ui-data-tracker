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
import {FaEquals, FaExchangeAlt, FaGhost, FaQuestion} from 'react-icons/fa';
import React, {useState} from 'react';

import {ALL_FILE_AUDITS} from '../queries';
import {Chart} from 'react-charts';
import FileUploadTable from './FileUploadTable';
import {dateTime} from '../../common/dateUtils';
import {useQuery} from '@apollo/client';

const ComparisonTab = ({match, loading, error, data}) => {
  const [tab, setTab] = useState('matched');
  const [dropdown, setDropdown] = useState('count_by_data_type');
  const [pages, setPages] = useState([{first: 10}]);

  const storageAnalyses =
    data && data.allStorageAnalyses.edges.length > 0
      ? data.allStorageAnalyses.edges[0].node
      : {};

  const {
    loading: fileAuditsLoading,
    error: fileAuditsError,
    data: fileAuditsData,
    refetch: fileAuditsRefetch,
    fetchMore,
  } = useQuery(ALL_FILE_AUDITS, {
    variables: {
      storageAnalysis: storageAnalyses.id,
      result: tab,
      ...pages[0],
    },
  });

  const audit = storageAnalyses.stats
    ? JSON.parse(storageAnalyses.stats).audit
    : {};
  console.log(storageAnalyses.stats && JSON.parse(storageAnalyses.stats));
  const tabContent = {
    differ: {
      title: ' S3 locations that have a different file than expected',
      description:
        'This metric is computed by counting the urls in the upload manifest(s) that match urls in the S3 inventory, but have a different file hash in the upload manfiest(s) vs the S3 inventory. These represent locations in S3 where file content changed or got overwritten.',
      color: '#db2828',
    },
    matched: {
      title: ' files that were expected but not found in S3',
      description:
        'This metric is computed by counting the file hashes in the upload manifest(s) that were not found in the S3 inventory. These represent file blobs that do not exist anywhere in S3 at the time of scan.',
      color: '#21ba45',
    },
    missing: {
      title: ' files in S3 with different content than expected',
      description:
        'This metric is computed by counting the urls in the upload manifest(s) whose hash value is different than the hash value in the S3 inventory. These items could indicate corrupted uploads or S3 objects that have been overwritten with different content since the time of upload.',
      color: '#db2828',
    },
    moved: {
      title:
        ' files that exist in the S3 but at a different location than expected',
      description:
        'This metric is computed by counting the file hashes in the upload manifest(s) whose url is different than the url in the S3 inventory. These represent file blobs that exist in S3 but at different locations than specified by a user in the upload manifest(s).',
      color: '#fbbd08',
    },
    unexpected: {
      title: ' files that were found in S3 but not expected',
      description:
        'This metric is computed by counting the file hashes in the S3 inventory that were not in any of the upload manifests. These could be files that are unaccounted for or were uploaded by someone besides the intended submitter',
      color: '#fbbd08',
    },
  };

  const dropdownText = {
    count_by_bucket: 'Bucket',
    count_by_data_type: 'Data Type',
    count_by_ext: 'Extension',
    count_by_size: 'Size',
  };

  const dropdownOptions = () => {
    var options = {};
    Object.keys(audit).length > 0 &&
      Object.keys(audit).map(t => {
        options[t] = Object.keys(audit[t])
          .filter(k => k.includes('count_by_'))
          .map(v => ({
            key: v,
            text: dropdownText[v],
            value: v,
          }));
        return true;
      });
    return options;
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

  const tooltip = React.useMemo(
    () => ({
      align: 'auto',
      anchor: 'closest',
    }),
    [],
  );

  const dataChart = React.useMemo(() => {
    var rawData = audit && audit[tab] ? audit[tab][dropdown] : {};
    const col = Object.keys(rawData);
    const formatData = col.map(c => ({x: c, y: rawData[c]}));
    return [
      {
        datums: formatData,
      },
    ];
  }, [audit, dropdown, tab]);

  const getSeriesStyle = React.useCallback(
    series => ({
      color: tabContent[tab].color || '#919090',
    }),
    [tab, tabContent],
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
      {Object.keys(audit).length > 0 && (
        <Grid>
          <Grid.Row className="mt-6 pb-0">
            <Grid.Column
              className="noPadding"
              width={2}
              textAlign="center"
              onClick={() => {
                setTab('matched');
                setDropdown('count_by_data_type');
                fileAuditsRefetch({
                  result: tab,
                });
              }}
            >
              <CountStat
                number={audit.matched.total_count}
                icon={<FaEquals />}
                title="files matched"
                color={tab === 'matched' && 'text-green'}
              />
              {tab === 'matched' && (
                <Icon
                  name="caret down"
                  color="green"
                  size="huge"
                  className="mt--10"
                />
              )}
            </Grid.Column>
            <Grid.Column
              className="noPadding"
              width={2}
              textAlign="center"
              onClick={() => {
                setTab('missing');
                setDropdown('count_by_data_type');
                fileAuditsRefetch({
                  result: tab,
                });
              }}
            >
              <CountStat
                number={audit.missing.total_count}
                icon={<FaQuestion />}
                title="files missing"
                color={tab === 'missing' && 'text-red'}
              />
              {tab === 'missing' && (
                <Icon
                  name="caret down"
                  color="red"
                  size="huge"
                  className="mt--10"
                />
              )}
            </Grid.Column>
            <Grid.Column
              className="noPadding"
              width={2}
              textAlign="center"
              onClick={() => {
                setTab('moved');
                setDropdown('count_by_data_type');
                fileAuditsRefetch({
                  result: tab,
                });
              }}
            >
              <CountStat
                number={audit.moved.total_count}
                icon={<FaExchangeAlt />}
                title="files moved"
                color={tab === 'moved' && 'text-yellow'}
              />
              {tab === 'moved' && (
                <Icon
                  name="caret down"
                  color="yellow"
                  size="huge"
                  className="mt--10"
                />
              )}
            </Grid.Column>
            <Grid.Column
              className="noPadding"
              width={2}
              textAlign="center"
              onClick={() => {
                setTab('unexpected');
                setDropdown('count_by_data_type');
                fileAuditsRefetch({
                  result: tab,
                });
              }}
            >
              <CountStat
                number={audit.unexpected.total_count}
                icon={<FaGhost />}
                title="files unexpected"
                color={tab === 'unexpected' && 'text-yellow'}
              />
              {tab === 'unexpected' && (
                <Icon
                  name="caret down"
                  color="yellow"
                  size="huge"
                  className="mt--10"
                />
              )}
            </Grid.Column>
            <Grid.Column textAlign="center" width={4} className="noPadding">
              <DateStat
                date={storageAnalyses.scannedStorageAt}
                title="Last scanned S3 at"
              />
            </Grid.Column>
            <Grid.Column textAlign="center" width={4} className="noPadding">
              <DateStat
                date={storageAnalyses.refreshedAt}
                title="Report updated at"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="16">
              <Header as="h5" className="mb-0">
                Found{' '}
                {audit[tab] && audit[tab].total_count
                  ? audit[tab].total_count
                  : '-'}
                {tabContent[tab].title}
              </Header>
              <p className="text-grey">{tabContent[tab].description}</p>
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
          options={dropdownOptions()[tab]}
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
              tooltip={tooltip}
              getSeriesStyle={getSeriesStyle}
            />
          </Container>
        ) : (
          <Container textAlign="center" className="mt-6">
            <Header disabled as="h5" className="mt-15 mb-15">
              No data avaliable
            </Header>
          </Container>
        )}
      </Segment>
      <FileUploadTable
        title="File Audits"
        loading={fileAuditsLoading}
        error={fileAuditsError}
        data={fileAuditsData && fileAuditsData.allFileAudits}
        fetchMore={fetchMore}
        pages={pages}
        setPages={setPages}
      />
    </Container>
  );
};

export default ComparisonTab;
