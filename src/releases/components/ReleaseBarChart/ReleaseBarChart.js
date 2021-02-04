import React, {Suspense} from 'react';
const ResponsiveBar = React.lazy(() => import('./bar'));

const ReleaseBarChart = ({data}) => {
  if (!data) return;

  const releases = data.map(({name, state, createdAt}) => {
    const created = new Date(createdAt);
    return {
      name,
      state,
      month: `${created.getFullYear()}-${created.getMonth() + 1}`,
      createdAt,
      created,
    };
  });

  // Bucket releases into months and count by state
  const monthBuckets = releases.reduce((acc, release) => {
    if (acc && !acc[release.month]) {
      acc[release.month] = {published: 0, staged: 0, failed: 0, cancelled: 0};
    }
    if (release.state in acc[release.month]) {
      acc[release.month][release.state] += 1;
    }
    return acc;
  }, {});

  // Convert object of counts keyed by month to flat array
  const flatBuckets = Object.keys(monthBuckets)
    .map(key => ({
      month: key,
      ...monthBuckets[key],
    }))
    .sort(bucket => new Date(bucket.month));

  return (
    <Suspense fallback={<span>Loading charts...</span>}>
      <ResponsiveBar
        data={flatBuckets}
        keys={['published', 'failed', 'cancelled']}
        indexBy="month"
        isInteractive={false}
        margin={{top: 50, right: 130, bottom: 50, left: 60}}
        padding={0.3}
        valueScale={{type: 'linear'}}
        indexScale={{type: 'band', round: true}}
        colors={{scheme: 'dark2'}}
        colorBy="id"
        defs={[
          {
            id: 'published',
            type: 'patternLines',
            background: '#4dc76a',
            color: '#4dc76a',
            size: 4,
            padding: 1,
            stagger: true,
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
          {
            id: 'failed',
            type: 'patternLines',
            background: 'inherit',
            color: '#e77373',
            opacity: 0.5,
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
          {
            id: 'failed',
            type: 'patternLines',
            background: '#767676',
            color: '#919191',
            opacity: 0.5,
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: 'failed',
            },
            id: 'failed',
          },
          {
            match: {
              id: 'published',
            },
            id: 'published',
          },
          {
            match: {
              id: 'cancelled',
            },
            id: 'cancelled',
          },
        ]}
        borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 32,
          format: value => {
            const d = new Date(value);
            d.setDate(d.getDate() + 1);
            return `${d.toLocaleString('default', {month: 'short'})}`;
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Count',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="white"
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </Suspense>
  );
};

export default ReleaseBarChart;
