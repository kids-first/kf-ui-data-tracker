import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
/**
 * Displays error message
 */
const Error = ({className, errorMessage}) => {
  const errorClass = classes('m-40', 'text-center', className);
  return (
    <div className={errorClass}>
      <h2 className="text-red">Error!</h2>
      <p>{errorMessage}</p>
    </div>
  );
};

Error.propTypes = {
  /** Any additional classes to be applied to the error component*/
  className: PropTypes.string,
  /** Error message */
  errorMessage: PropTypes.string,
};

Error.defaultProps = {
  className: null,
  errorMessage: null,
};

export default Error;
