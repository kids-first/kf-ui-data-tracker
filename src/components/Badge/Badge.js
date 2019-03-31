import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
/**
 * Displays badge describing the file state
 */
const badgeState = {
  new: {name: 'New', color: 'bg-teal'},
  pendingApproval: {name: 'Pending Approval', color: 'bg-orange'},
  contentApproved: {name: 'Content Approved', color: 'bg-lightBlue'},
  changesRequired: {name: 'Changes Required', color: 'bg-red'},
};

const Badge = ({className, state, loading}) => {
  const color = state in badgeState ? badgeState[state].color : null;
  const name = state in badgeState ? badgeState[state].name : 'invalid';
  const badgeClass = classes(className, 'Badge', {
    [color]: !loading,
    'Badge--loading': loading,
    'Badge--invalid': !(state in badgeState),
  });
  return (
    <div className={badgeClass}>
      <span className={loading && 'invisible'}>{name}</span>
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
