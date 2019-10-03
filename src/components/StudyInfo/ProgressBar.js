import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from 'semantic-ui-react';
import {steppingFields} from '../../common/notificationUtils';
/**
 * Displays progress bar component indication the completion of each info step
 * - Show as red when none of the fields in current step have values
 * - Show as yellow when one or more fields have values but not completed yet
 * - Show as green when all the field are given values.
 * - Show error stage when no step data found or total fields are 0
 */
const ProgressBar = ({values, step}) => {
  var filled = 0;
  var total = 0;
  if (steppingFields[step] && steppingFields[step].length > 0) {
    steppingFields[step].forEach(function(field) {
      if (values[field] && (values[field] > 0 || values[field].length > 0)) {
        filled += 1;
      }
    });
    total = steppingFields[step].length;
  }
  return (
    <Progress
      className="progress-bar--custom"
      value={filled}
      total={total}
      size="tiny"
      label={
        total > 0
          ? filled + '/' + total + ' fields complete'
          : 'Invalid  progress'
      }
      error={filled === 0 || total === 0}
      warning={filled > 0 && filled < total}
      success={filled === total}
    />
  );
};

ProgressBar.propTypes = {
  /** The value object from Formik */
  values: PropTypes.object,
  /** The step name, each step has its own array of fields to track */
  step: PropTypes.number,
};

export default ProgressBar;
