import React, {Suspense} from 'react';
const ResponsiveCalendar = React.lazy(() => import('./calendar'));

const ReleaseActivity = ({data}) => {
  if (!data) return;

  const releases = data
    .filter(release => release.state === 'published')
    .map(({name, state, createdAt}) => {
      const created = new Date(createdAt);
      return {
        name,
        state,
        day: `${created.getFullYear()}-${('0' + (created.getMonth() + 1)).slice(
          -2,
        )}-${('0' + created.getDate()).slice(-2)}`,
        createdAt,
        created,
      };
    });

  // Bucket releases into days and count number of published releases
  const dayBuckets = releases.reduce((acc, release) => {
    if (acc && !acc[release.day]) {
      acc[release.day] = 0;
    }
    acc[release.day] += 1;
    return acc;
  }, {});

  // Convert object of counts keyed by day to flat array
  const flatBuckets = Object.keys(dayBuckets)
    .map(key => ({
      day: key,
      value: dayBuckets[key],
    }))
    .sort(bucket => new Date(bucket.day));

  // return <pre>{JSON.stringify(flatBuckets, null, 2)}</pre>;

  return (
    <Suspense fallback={<span>Loading charts...</span>}>
      <ResponsiveCalendar
        height={200}
        data={flatBuckets}
        from={'' + (new Date().getFullYear() + 1)}
        to={'' + (new Date().getFullYear() + 1)}
        emptyColor="#eeeeee"
        colors={['#c37adb', '#b55bd3', '#a333c8']}
        margin={{top: 40, right: 40, bottom: 40, left: 40}}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left',
          },
        ]}
      />
    </Suspense>
  );
};

export default ReleaseActivity;
