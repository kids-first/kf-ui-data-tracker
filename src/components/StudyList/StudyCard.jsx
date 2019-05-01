import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {Card} from 'kf-uikit';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */

const StudyCard = ({className, title, body, lastUpdate}) => {
  let studyCardClass = classes('StudyCard', 'hover:shadow-lg', className);

  return (
    <Card {...{title}} className={studyCardClass}>
      <div className="flex flex-col justify-between">
        <div className="overflow-hidden h-32">
          <p className="m-0 font-title text-darkGrey">{body}</p>
        </div>
        <small className="w-full text-grey font-title text-right whitespace-no-wrap">
          Updated: <TimeAgo className="whitespace-no-wrap" date={lastUpdate} />
        </small>
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
