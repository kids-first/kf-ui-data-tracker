import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Icon} from 'kf-uikit';

/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({
  className,
  name,
  value,
  title,
  body,
  select,
  selected,
  icon,
}) => {
  let selectElementClass = classes(
    'SelectElement',
    selected ? 'border border-lightBlue' : 'none',
    className,
  );
  let selectIconClass = classes(
    'SelectElement--Icon',
    selected ? 'bg-lightBlue' : 'bg-lightGrey',
  );
  return (
    <label className={selectElementClass}>
      <input
        className="border m-2 mt-4"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={e => select(e)}
      />
      <div className={selectIconClass}>
        <Icon kind={icon} className={selected ? 'text-white' : 'none'} />
      </div>
      <div>
        <p className="m-0 pt-1 font-bold font-sm leading-none">{title}</p>
        <span className="m-0 font-normal text-grey text-xs">{body}</span>
      </div>
    </label>
  );
};

SelectElement.propTypes = {
  /** The key value signed to the selection */
  name: PropTypes.string.isRequired,
  /** The value of the fileType enum */
  value: PropTypes.string.isRequired,
  /** The title displayed on the selection card */
  title: PropTypes.string.isRequired,
  /** The body displayed on the selection card */
  body: PropTypes.string,
  /** The icon for this selection */
  icon: PropTypes.string,
  /** onChange event for the radio button */
  select: PropTypes.func.isRequired,
  /** whether the radio button is selected or not */
  selected: PropTypes.bool.isRequired,
};

SelectElement.defaultProps = {
  name: null,
  title: null,
  body: null,
  icon: null,
};

export default SelectElement;
