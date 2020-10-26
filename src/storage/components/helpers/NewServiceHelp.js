import React from 'react';
import BaseHelper from '../../../components/BaseHelper';
import releases from '../../../assets/releases.svg';

const Help = () => (
  <BaseHelper
    title="Register A New Task Service"
    color="purple"
    image={releases}
  >
    <p>
      Register a new task service by providing the task's endpoint. Any new task
      registered will immediatley be included in a new release. Ensure that the
      task service is up and accepting work correctly to ensure that releases do
      not fail.
    </p>
  </BaseHelper>
);

export default Help;
