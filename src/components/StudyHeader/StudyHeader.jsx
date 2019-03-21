import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import { GridContainer } from '../../components/Grid';
import {Icon} from 'kf-uikit';

const StudyHeader = ({ kfId, modifiedAt, shortName, name: studyName, className }) => {
  const studyHeaderClasses = classes('StudyHeader', 'py-4', 'bg-lightGrey', className);
  return (
    <header className={studyHeaderClasses}>
      <GridContainer>
        <div className="row-1 col-10">
          <h3 className="study-id-tag w-full mt-1 text-base">
            {kfId}
            <Icon className="pt-3 ml-4" kind="copy" />
            <span className="study-modified-date w-full pl-4 font-light">
              <small>
                last updated: <TimeAgo date={modifiedAt} />
              </small>
            </span>
          </h3>
          <h1 className="mt-4 col-12 font-light text-blue text-4xl">
            {shortName || studyName}
            <Icon className="pb-1 ml-6" kind="edit" />
          </h1>
        </div>
        <div className="study-contacts row-1 col-2 self-start">
          <h4 className="mt-5 font-bold">Contacts:</h4>
          <p className="mt-1 font-title font-light">
            Mary Marazita
            <Icon className="pt-2 ml-4" kind="email" />
          </p>
          <button className="mt-0 font-title font-thin text-sm underline">
            ADD CONTACT
          </button>
        </div>
      </GridContainer>
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
