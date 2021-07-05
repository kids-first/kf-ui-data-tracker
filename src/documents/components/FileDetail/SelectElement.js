import React from 'react';
import PropTypes from 'prop-types';
import {fileTypeDetail} from '../../../common/enums';
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
  const fileType = fileTypeDetail[id] ? fileTypeDetail[id] : fileTypeDetail.OTH;

  return (
    <Segment
      compact
      color={selected ? 'blue' : null}
      className="selectionRadio--card"
      onClick={() => {
        setFieldValue(name, id);
      }}
    >
      <div>
        <Radio
          name={name}
          id={id}
          value={id}
          checked={selected}
          onChange={onChange}
          label={() => (
            <Icon
              name={fileType.icon}
              size="large"
              bordered
              circular
              inverted
              color={selected ? 'blue' : 'black'}
            />
          )}
        />
      </div>
      <div>
        <p className="mb-5">
          <b>{fileType.title}</b>
        </p>
        <p className="text-wrap-75 text-grey">{fileType.description}</p>
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
  /** Icon name to append to badge */
  label: PropTypes.string,
  /** additional classes to add to the select element component  */
  className: PropTypes.string,
};

export default SelectElement;
