import React from 'react';
import PropTypes from 'prop-types';
import {fileTypeDetail} from '../../common/fileUtils';
import {Icon, Segment, Radio} from 'semantic-ui-react';
/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({
  field: {name, value, onChange},
  form: {values, setFieldValue},
  id,
  label,
  className,
  ...props
}) => {
  const selected = id === values.file_type;
  return (
    <Segment
      compact
      color={selected ? 'blue' : null}
      className="selectionRadio--card"
      onClick={() => {
        setFieldValue(name, id);
      }}
    >
      <Radio
        className="selectionRadio"
        name={name}
        id={id}
        value={id}
        checked={selected}
        onChange={onChange}
        label={() => (
          <Icon
            name={fileTypeDetail[id].icon}
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
          <b>{fileTypeDetail[id].title}</b>
        </p>
        <p>
          <small>{fileTypeDetail[id].description}</small>
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
