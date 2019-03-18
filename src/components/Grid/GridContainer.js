import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';

/**
 * Container for a 12 column css grid
 */
const GridContainer = ({ className, children, collapsed }) => {
  const GridContainerClass = classes(className, { 'grid-container--collapsed': collapsed });

  return <section className={GridContainerClass}>{children}</section>;
};

GridContainer.propTypes = {
  /** Any additional classes to be applied to the button */
  className: PropTypes.string,
  /** Children elements. */
  children: PropTypes.string,
  /** Collapse margins and gutters. */
  collapsed: PropTypes.bool,
};

GridContainer.defaultProps = {
  className: 'grid-container',
  children: null,
  collapsed: false,
};

/**
 * @component
 */
export default GridContainer;
