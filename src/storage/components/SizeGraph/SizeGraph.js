import React from 'react';
import {formatFileSize} from '../../../documents/utilities';
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
  VictoryLabel,
} from 'victory';

const SizeGraph = ({data, color = 'rgb(59, 171, 255)'}) => {
  const showDepAxis = true;
  return (
    <VictoryChart
      height={100}
      scale="time"
      domainPadding={{x: 5, y: 0}}
      padding={{top: 10, bottom: 20, left: 0, right: 0}}
      minDomain={{y: 0}}
    >
      <svg>
        <defs>
          <linearGradient
            spreadMethod="pad"
            id="mygradient"
            x1="99%"
            y1="0%"
            x2="0%"
            y2="8%"
          >
            <stop offset="70%" stopColor={color} stopOpacity={1.0} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
      </svg>
      <VictoryArea
        data={data}
        x={d => new Date(d.date)}
        y={d => d.size / 1e6}
        size={1}
        style={{
          data: {
            fill: 'url(#mygradient)',
            stroke: 'transparent',
          },
        }}
      />
      <VictoryScatter
        data={[
          {
            x: new Date(data[data.length - 1].date),
            y: data[data.length - 1].size / 1e6,
            label: formatFileSize(data[data.length - 1].size, true),
          },
        ]}
        style={{data: {fill: color, stroke: 'black', strokeWidth: 0.5}}}
        size={2}
        labelComponent={
          <VictoryLabel
            textAnchor="end"
            verticalAnchor="start"
            dx={-6}
            dy={-2}
            backgroundStyle={{
              stroke: 'white',
              strokeWidth: 3,
              fill: 'white',
              opacity: 0.5,
            }}
            backgroundPadding={[{left: 12, top: 2, right: -4}]}
            style={{fontSize: 8}}
          />
        }
      />
      {showDepAxis && (
        <VictoryAxis
          dependentAxis
          tickFormat={d => formatFileSize(d * 1e6, true)}
          orientation="left"
          style={{
            axisLabel: {fontSize: 6, padding: 23},
            grid: {stroke: 'black', strokeDasharray: '5,2', opacity: 0.25},
            ticks: {stroke: 'grey', size: 5},
            tickLabels: {fontSize: 6, padding: -35},
          }}
        />
      )}
      <VictoryAxis
        scale="time"
        style={{
          ticks: {stroke: 'grey', size: 5},
          axis: {stroke: 'transparent'},
          tickLabels: {fontSize: 6, padding: 3},
        }}
      />
    </VictoryChart>
  );
};

export default SizeGraph;
