import React from 'react';
import PropTypes from 'prop-types';

export const LoadingPlaceholder = ({componentName}) => (
  <div className="text-center animate">
    <h1 className="text-grey pt-32 uppercase">LOADING {componentName} ...</h1>
  </div>
);

LoadingPlaceholder.propTypes = {
  /** Any additional classes to be applied to the nav bar*/
  componentName: PropTypes.string,
};

LoadingPlaceholder.defaultProps = {
  componentName: null,
};
