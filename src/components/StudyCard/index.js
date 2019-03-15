import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { Card } from 'kf-uikit';

/**
 * Displays all studies for each Investigator
 */

const StudyCard = ({ children, className, title }) => {
  let studyCardClass = classes('study-card', className);

  return (
    <Card {...{ title }} className={studyCardClass}>
      {children}
    </Card>
  );
};

StudyCard.propTypes = {
  /** Any additional classes to be applied to the button */
  className: PropTypes.string,
  /** Children elements. */
  children: PropTypes.string,
  /** NAme to display as the card header */
  title: PropTypes.string,
};

StudyCard.defaultProps = {
  className: null,
  children: null,
  title: null,
};

export default StudyCard;
