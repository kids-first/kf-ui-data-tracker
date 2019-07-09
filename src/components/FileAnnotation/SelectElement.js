import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {fileTypeDetail} from '../../common/fileUtils';
import {Icon} from 'semantic-ui-react';
/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({className, value, select, selected}) => {
  let selectElementClass = classes(
    'SelectElement',
    selected && 'SelectElement-fill',
    className,
  );
  return (
    <label className={selectElementClass}>
      <input
        className="border m-16"
        type="radio"
        name={value}
        value={value}
        checked={selected}
        onChange={e => select(e)}
      />
      <Icon
        name={`${fileTypeDetail[value].icon || 'question'}`}
        size="large"
        bordered
        circular
        inverted
        color={selected ? 'blue' : null}
      />
      <div>
        <p className="m-0 font-bold font-sm">{fileTypeDetail[value].title}</p>
        <span className="font-normal text-grey text-xs">
          {fileTypeDetail[value].description}
        </span>
      </div>
    </label>
  );
};

SelectElement.propTypes = {
  /** The value of the fileType enum */
  value: PropTypes.string.isRequired,
  /** onChange event for the radio button */
  select: PropTypes.func.isRequired,
  /** whether the radio button is selected or not */
  selected: PropTypes.bool.isRequired,
};

export default SelectElement;
