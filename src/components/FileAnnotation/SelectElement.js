import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {fileTypeDetail} from '../../common/fileUtils';
import Box from '../../assets/icons/box';
import Clinical from '../../assets/icons/clinical';
import Misc from '../../assets/icons/misc';
import Sequencing from '../../assets/icons/sequencing';
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
  let selectIconClass = classes(
    'SelectElement--Icon',
    selected && 'SelectElement--Icon-fill',
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
      <div className={selectIconClass}>
        {value === 'SHM' && <Box />}
        {value === 'CLN' && <Clinical />}
        {value === 'SEQ' && <Sequencing />}
        {value === 'OTH' && <Misc />}
      </div>
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
