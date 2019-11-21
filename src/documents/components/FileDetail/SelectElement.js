import React from 'react';
import PropTypes from 'prop-types';
import {fileTypeDetail} from '../../../common/enums';
import {Icon, Segment, Radio} from 'semantic-ui-react';
import {withAnalyticsTracking} from '../../../analyticsTracking';
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
  tracking: {
    logEvent,
    instrument,
    EVENT_CONSTANTS: {INPUT__SELECT},
  },
  ...props
}) => {
  const selected = id === values.file_type;
  return (
    <Segment
      compact
      color={selected ? 'blue' : null}
      className="selectionRadio--card"
      onClick={() => {
        logEvent(INPUT__SELECT.CHANGE, {
          name,
          label,
          radio_text: fileTypeDetail[id].title,
        });
        setFieldValue(name, id);
      }}
    >
      <Radio
        className="selectionRadio"
        name={name}
        id={id}
        value={id}
        checked={selected}
        onChange={instrument(INPUT__SELECT.CHANGE, onChange)}
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
  /** Icon name to append to badge */
  label: PropTypes.string,
  /** additional classes to add to the select element component  */
  className: PropTypes.string,
};

export default withAnalyticsTracking(SelectElement, {logToConsole: true});
