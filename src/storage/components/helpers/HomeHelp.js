import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import serverStatus from '../../../assets/server_status.svg';

const Help = () => (
  <BaseHelper title="About Storage" color="orange" image={serverStatus}>
    <p>
      The DRC is all about the data, and that data needs to be stored somewhere.
      The DRC keeps its data within AWS S3 buckets which are partitioned by
      study with auxiliary buckets for supporting applications. Here, you can
      review the data footprint of the DRC and dive deeper into how each storage
      bucket is functioning and what they are holding.
    </p>
  </BaseHelper>
);

export default Help;
