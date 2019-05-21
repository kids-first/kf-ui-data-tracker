import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Icon} from 'kf-uikit';

/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({title, body, icon}) => {
  let selectElementClass = classes('SelectElement', 'none');
  let selectIconClass = classes('SelectElement--Icon', 'bg-lightGrey');
  return (
    <div className={selectElementClass}>
      <div className={selectIconClass}>
        <Icon kind={icon} className={'none'} />
      </div>
      <div>
        <p className="mt-8 font-bold font-sm leading-none">{title}</p>
        <span className="font-normal text-grey text-xs">{body}</span>
      </div>
    </div>
  );
};

SelectElement.propTypes = {
  /** The title displayed on the selection card */
  title: PropTypes.string.isRequired,
  /** The body displayed on the selection card */
  body: PropTypes.string,
  /** The icon for this selection */
  icon: PropTypes.string,
};

SelectElement.defaultProps = {
  title: null,
  body: null,
  icon: null,
};

export default SelectElement;
