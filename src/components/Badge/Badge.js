import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {versionState} from '../../common/fileUtils';
/**
 * Displays badge describing the file state
 */
const Badge = ({className, state, loading}) => {
  const color = versionState[state]
    ? versionState[state].color
    : 'bg-lightGrey';
  const name =
    state && versionState[state] ? versionState[state].title : 'Invalid';
  const badgeClass = classes(
    'Badge',
    {
      [color]: !loading,
      'Badge--loading': loading,
      'Badge--invalid': !versionState[state] && !loading,
    },
    className,
  );
  return (
    <div className={badgeClass}>
      <span className={loading ? 'invisible' : undefined}>{name}</span>
    </div>
  );
};

Badge.propTypes = {
  /** Any additional classes to be applied to the nav bar button*/
  className: PropTypes.string,
  /** Badge state. */
  state: PropTypes.string,
};

Badge.defaultProps = {
  className: null,
  state: null,
};

export default Badge;
