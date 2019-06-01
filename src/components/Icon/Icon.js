import React from 'react';
import PropTypes from 'prop-types';
import IconPaths from '../../../node_modules/kf-uikit/src/components/Icon/Icons';
import * as Icons from '../../assets/icons';
import {Icon} from 'kf-uikit';

const SvgIcon = ({kind, width, height, fill, className}) => {
  if (IconPaths[kind.toLowerCase()]) {
    // ui-kit icon kinds are all lowercse
    return (
      <Icon
        kind={kind.toLowerCase()}
        height={height}
        width={width}
        fill={fill}
        className={className}
      />
    );
  }
  // local icon kinds are all uppercase first because they have to be ReactComponents
  const IconLocal = Icons[kind.charAt(0).toUpperCase() + kind.slice(1)];

  if (typeof IconLocal != 'object') {
    console.error(kind + ' may have some issue renderd as a svg icon');
    return null;
  }
  return IconLocal.render({width, height, className});
};

SvgIcon.propTypes = {
  /** Any additional classes to be applied to the nav bar button*/
  className: PropTypes.string,
  /** Icon kind */
  kind: PropTypes.string,
  /** Icon width */
  width: PropTypes.string,
  /** Icon height */
  height: PropTypes.string,
  /** Icon fill color */
  fill: PropTypes.string,
};

SvgIcon.defaultProps = {
  className: null,
  kind: '',
};

export default SvgIcon;
