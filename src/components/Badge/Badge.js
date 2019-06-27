import React from 'react';
import PropTypes from 'prop-types';
import {versionState} from '../../common/fileUtils';
import {Label} from 'semantic-ui-react';
/**
 * Displays badge describing the file state
 */
const Badge = ({state, size}) => (
  <Label
    basic
    size={size}
    color={versionState[state] ? versionState[state].labelColor : 'grey'}
  >
    {state && versionState[state] ? versionState[state].title : 'Invalid'}
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
};

Badge.defaultProps = {
  state: null,
  size: 'tiny',
};

export default Badge;
