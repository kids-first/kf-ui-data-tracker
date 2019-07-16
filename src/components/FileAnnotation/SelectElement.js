import React from 'react';
import PropTypes from 'prop-types';
import {fileTypeDetail} from '../../common/fileUtils';
import {Icon, Segment, Radio} from 'semantic-ui-react';
/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({value, selected, select}) => {
  return (
    <Segment
      compact
      color={selected ? 'blue' : null}
      className="selectionRadio--card"
      onClick={() => select(value)}
    >
      <Radio
        className="selectionRadio"
        name="fileTypeGroup"
        value={value}
        onChange={select}
        label={() => (
          <Icon
            name={fileTypeDetail[value].icon}
            size="large"
            bordered
            circular
            inverted
            color={selected ? 'blue' : 'black'}
          />
        )}
      />
      <div>
        <p>
          <b>{fileTypeDetail[value].title}</b>
        </p>
        <p>
          <small>{fileTypeDetail[value].description}</small>
        </p>
      </div>
    </Segment>
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
