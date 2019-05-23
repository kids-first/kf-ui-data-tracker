import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import Notification from '../../assets/icons/notification';
/**
 * Displays notification bar with one main button (current)
 */
const NotificationBar = ({className, mainButton, icon, message, note}) => {
  let notificationBarClass = classes('NotificationBar', className);
  return (
    <div className={notificationBarClass}>
      <div className="flex">
        {icon && <Notification className="mr-4" />}
        <p className="m-0 text-sm self-stretch">
          <span className="font-bold text-base pr-4">{message}</span>
          {note}
        </p>
      </div>
      {mainButton && mainButton()}
    </div>
  );
};

NotificationBar.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Acticon when press on main button */
  mainButton: PropTypes.func,
  /** File kfId*/
  icon: PropTypes.string,
  /** File type*/
  message: PropTypes.string,
  /** File name*/
  note: PropTypes.string,
};

NotificationBar.defaultProps = {
  className: null,
  icon: null,
  message: null,
  note: null,
};

export default NotificationBar;
