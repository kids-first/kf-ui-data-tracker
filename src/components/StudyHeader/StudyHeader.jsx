import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import {Icon} from 'kf-uikit';

const StudyHeader = ({
  kfId,
  modifiedAt,
  shortName,
  name: studyName,
  className,
}) => {
  const studyHeaderClasses = classes('StudyHeader', 'BodyContent', className);
  return (
    <div className="bg-lightGrey">
      <header className={studyHeaderClasses}>
        <div className="flex-initial py-3 ml-2 sm:ml-12">
          <h3 className="mt-1 text-base">
            <span className="font-body font-bold" id="kfId">
              {kfId}
            </span>
            <Icon className="pt-3 ml-4" kind="copy" />
            <span className="study-modified-date pl-4 font-light">
              <small>
                last updated: <TimeAgo date={modifiedAt} />
              </small>
            </span>
          </h3>
          <h2 className="mt-4 font-light text-blue text-4xl">
            {shortName || studyName}
          </h2>
        </div>
        <div className="flex-initial py-3 ml-2 sm:mr-12">
          <h4 className="mt-2 text-sm font-bold">Contacts:</h4>
          <p className="mt-1 font-light">Mary Marazita</p>
        </div>
      </header>
    </div>
  );
};

StudyHeader.propTypes = {
  /** the kf_id (SD_XXXXXXX) for the study  */
  kfId: propTypes.string.isRequired,
  /** datetime of when the study was last updated */
  modifiedAt: propTypes.string.isRequired,
  /** user friendly name for the study  */
  shortName: propTypes.string,
  /** long programatic name for the study  */
  name: propTypes.string,
  /** Any additional classes to be applied to the button */
  className: propTypes.string,
};

export default StudyHeader;
