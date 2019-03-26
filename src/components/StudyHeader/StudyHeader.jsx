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
  const studyHeaderClasses = classes('StudyHeader', className);
  return (
    <header className={studyHeaderClasses}>
      <div className="flex-initial p-4 sm:ml-12">
        <h3 className="study-id-tag mt-1 text-base">
          {kfId}
          <Icon className="pt-3 ml-4 text-white" kind="copy" />
          <span className="study-modified-date pl-4 font-light">
            <small>
              last updated: <TimeAgo date={modifiedAt} />
            </small>
          </span>
        </h3>
        <h1 className="mt-4 font-light text-4xl">
          {shortName || studyName}
          <Icon className="pb-1 ml-6 text-white" kind="edit" />
        </h1>
      </div>
      <div className="flex-initial p-4 sm:mr-12">
        <h4 className="mt-5 font-bold">Contacts:</h4>
        <p className="mt-1 font-title font-light">
          Mary Marazita
          <Icon className="pt-2 ml-4 text-white" kind="email" />
        </p>
        <button className="mt-0 font-title text-white font-thin text-sm underline">
          ADD CONTACT
        </button>
      </div>
    </header>
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
