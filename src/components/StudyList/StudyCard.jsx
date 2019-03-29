import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {Card} from 'kf-uikit';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */

const StudyCard = ({className, title, body, lastUpdate}) => {
  let studyCardClass = classes(
    'StudyCard',
    'w-full',
    'hover:shadow-lg',
    className,
  );

  return (
    <Card {...{title}} className={studyCardClass}>
      <div className="flex flex-col justify-between h-48">
        <div className="pl-1 overflow-hidden">
          <p className="m-0 font-title text-darkGrey">{body}</p>
        </div>
        <small className="self-end w-full text-grey font-title mb-3 h-8">
          Last Updated: <TimeAgo date={lastUpdate} />
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
