import React from 'react';
import {Dropdown} from 'semantic-ui-react';

/**
 * A dropdown to change the status of an enumerable field
 */
const StatusSelector = ({
  value,
  options,
  loading,
  onChange,
  header = 'Change status',
}) => {
  return (
    <Dropdown
      loading={loading}
      disabled={loading}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};

export default StatusSelector;
