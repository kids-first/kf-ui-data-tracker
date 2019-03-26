import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {Card} from 'kf-uikit';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */

const StudyCard = ({className, title, body, lastUpdate}) => {
  let studyCardClass = classes('StudyCard', 'w-full', className);

  return (
    <Card {...{title}} className={studyCardClass}>
      <div className="overflow-scroll h-full">
        <p className="pl-1 text-darkGrey font-title">{body}</p>
        <p className="text-grey float-right font-title">
          <small>
            Last Updated: <TimeAgo date={lastUpdate} />
          </small>
        </p>
      </div>
    </Card>
  );
};

StudyCard.propTypes = {
  /** Any additional classes to be applied to the study card */
  className: PropTypes.string,
  /** Name to display as the card header */
  title: PropTypes.string,
  /** Text to display as the card body */
  body: PropTypes.string,
  /** Optional lastUpdate date to display in the card body */
  lastUpdate: PropTypes.instanceOf(Date),
};

StudyCard.defaultProps = {
  className: null,
  title: null,
  body: null,
  lastUpdate: null,
};

export default StudyCard;
