import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Icon} from 'kf-uikit';

const SelectElement = ({className, name, title, body, icon}) => {
  let selectElementClass = classes('SelectElement', className);
  return (
    <label className={selectElementClass}>
      <input className="border m-2 mt-5" type="checkbox" name={name} />
      <div className="SelectElement--Icon">
        <Icon kind={icon} />
      </div>
      <div>
        <h4 className="m-0">{title}</h4>
        <span className="m-0 font-normal text-grey text-sm">{body}</span>
      </div>
    </label>
  );
};

SelectElement.propTypes = {
  /** The key value signed to the selection */
  name: PropTypes.string.isRequired,
  /** The title displayed on the selection card */
  title: PropTypes.string.isRequired,
  /** The body displayed on the selection card */
  body: PropTypes.string,
  /** The icon for this selection */
  icon: PropTypes.string,
};

SelectElement.defaultProps = {
  name: null,
  title: null,
  body: null,
  icon: null,
};

export default SelectElement;
