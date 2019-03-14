import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import { GridContainer } from '../../components/Grid';

const StudyHeader = ({ kfId, modifiedAt, shortName, name: studyName, className }) => {
  const studyHeaderClasses = classes('StudyHeader', 'py-4', 'bg-lightGrey', className);
  return (
    <header className={studyHeaderClasses}>
      <GridContainer>
        <div className="row-1 col-3">
          <div className="study-id-tag w-full">{kfId}</div>
          <span className="study-modified-date w-full mt-0">
            <small>
              last updated: <TimeAgo date={modifiedAt} />
            </small>
          </span>
        </div>
        <h2 className="mt-1 row-2 col-12">{shortName || studyName}</h2>
        {/*<div className="study-contacts row-1 self-start">
          <h4 className="mt-0 font-bold">Contacts:</h4>
        </div>*/}
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
