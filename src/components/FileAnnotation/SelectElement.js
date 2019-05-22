import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Icon} from 'kf-uikit';
import {Radio} from 'semantic-ui-react';

/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({
  className,
  name,
  value,
  title,
  desc,
  group,
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
    <div className={selectElementClass}>
      {/* <input
        className="border m-16"
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={e => select(e)}
      /> */}
      <Radio
        className="border m-16"
        name={group}
        value={value}
        // checked={selected}
        onChange={e => select(e)}
      />
      <div className={selectIconClass}>
        <Icon kind={icon} className={selected ? 'text-white' : 'none'} />
      </div>
      <div>
        <p className="mt-8 font-bold font-sm leading-none">{title}</p>
        <span className="font-normal text-grey text-xs">{desc}</span>
      </div>
    </div>
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
