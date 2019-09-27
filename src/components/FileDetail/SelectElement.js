import React from 'react';
import PropTypes from 'prop-types';
import {fileTypeDetail} from '../../common/fileUtils';
import {Icon, Segment, Radio} from 'semantic-ui-react';
/**
 * A radio button that displays information about a file type with a title,
 * description, and icon.
 */
const SelectElement = ({
  field: {name, onChange},
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
  /** Formik field object  */
  field: PropTypes.object.isRequired,
  /** Formik form prop object */
  form: PropTypes.object.isRequired,
  /** the html name attribute to pass as the value for the Radio element */
  id: PropTypes.string.isRequired,
};

export default SelectElement;
