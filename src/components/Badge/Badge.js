import React from 'react';
import PropTypes from 'prop-types';
import { versionState } from '../../common/fileUtils';
import { Label, Icon } from 'semantic-ui-react';
/**
 * Displays badge describing the file state
 */
const Badge = ({ state, size, filled, icon, className }) => (
  <Label
    basic={!filled}
    size={size}
    color={versionState[state] ? versionState[state].labelColor : 'grey'}
    className={className}
  >
    {icon ? <Icon name={icon} /> : null}
    {state && versionState[state] ? versionState[state].title : null}
  </Label>
);

Badge.propTypes = {
  /** Badge state. */
  state: PropTypes.string,
  /** Badge size. */
  size: PropTypes.oneOf([
    'mini',
    'tiny',
    'small',
    'medium',
    'large',
    'big',
    'huge',
    'massive',
  ]),
  /** If to fill the badge label */
  filled: PropTypes.bool,
  /** Icon name to append to badge */
  icon: PropTypes.string,
  /** additional classes to add to the badge  */
  className: PropTypes.string
};

Badge.defaultProps = {
  state: null,
  size: 'tiny',
  icon: null,
  className: null
};

export default Badge;
