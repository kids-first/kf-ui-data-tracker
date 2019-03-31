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

const Badge = ({className, state}) => {
  if (badgeState[state]) {
    const color = badgeState[state].color;
    const name = badgeState[state].name;
    const validBadgeClass = classes('Badge', 'sm:min-w-full', className, color);
    return <div className={validBadgeClass}>{name}</div>;
  } else if (state === 'empty') {
    return (
      <div className="Badge sm:min-w-full bg-lightGrey text-lightGrey">
        empty
      </div>
    );
  } else {
    return <div className="Badge sm:min-w-full bg-darkGrey">Invalid State</div>;
  }
};

Badge.propTypes = {
  /** Any additional classes to be applied to the nav bar button*/
  className: PropTypes.string,
  /** Badge state. */
  state: PropTypes.string.isRequired,
};

Badge.defaultProps = {
  className: null,
  state: null,
};

export default Badge;
