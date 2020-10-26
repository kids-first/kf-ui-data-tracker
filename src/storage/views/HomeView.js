import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Header, Segment} from 'semantic-ui-react';
import {GET_BUCKETS} from '../queries';
import {VictoryChart, VictoryArea, VictoryAxis} from 'victory';

const HomeView = ({match}) => {
  const {data: bucketsData} = useQuery(GET_BUCKETS, {});

  const getData = () => {
    const num = 100;
    const points = Array.from(Array(num)).map(
      (x, i) => Math.random() * Math.exp(0.01 * i),
    );
    const cum = points.map((sum => value => (sum += value))(0));
    return cum.map((point, index) => {
      return {x: new Date(1000 * 3600 * 24 * 7 * index), y: 3 + point * 0.05};
    });
  };

  const data = getData();

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>{`KF Data Tracker - Storage`}</title>
      </Helmet>
      <Header as="h1" className="noMargin">
        Storage Overview
      </Header>
      <VictoryChart
        height={120}
        domainPadding={{x: 0, y: 0}}
        padding={{top: 10, bottom: 40, left: 40, right: 20}}
        minDomain={{y: 0, x: 0}}
      >
        <VictoryArea
          data={data}
          size={1}
          style={{data: {fill: '#2185d0', opacity: 0.8}}}
        />
        <VictoryAxis
          scale={{x: 'time'}}
          dependentAxis
          label="Disk Size (PB)"
          style={{
            axisLabel: {fontSize: 8, padding: 23},
            grid: {stroke: 'black', strokeDasharray: '5,2', opacity: 0.25},
            ticks: {stroke: 'grey', size: 5},
            tickLabels: {fontSize: 8, padding: 3},
          }}
        />
        <VictoryAxis
          scale="time"
          style={{
            ticks: {stroke: 'grey', size: 5},
            tickLabels: {fontSize: 8, padding: 3},
          }}
        />
      </VictoryChart>
      {JSON.stringify(bucketsData)}
    </Container>
  );
};

export default HomeView;
