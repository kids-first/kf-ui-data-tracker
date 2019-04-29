import React from 'react';
import propTypes from 'prop-types';
import classes from 'classnames';
import TimeAgo from 'react-timeago';
import CopyButton from '../CopyButton/CopyButton';
import {GridContainer} from 'kf-uikit';

const StudyHeader = ({
  kfId,
  modifiedAt,
  shortName,
  name: studyName,
  className,
}) => {
  const studyHeaderClass = classes('StudyHeader', className);
  const topTextClass = classes('StudyHeader--TopText');
  return (
    <GridContainer
      className={studyHeaderClass}
      collapsed="rows"
      className="py-8 px-12"
    >
      <p className={topTextClass}>
        <b>{kfId}</b>
        {kfId && <CopyButton text={kfId} className="pl-4 pr-20" />}
        <small className="font-light">
          last updated: {modifiedAt && <TimeAgo date={modifiedAt} />}
        </small>
      </p>
      <p className="StudyHeader--TitleText sm:row-2 sm:cell-10">
        {shortName || studyName}
      </p>
      <div className="row-2 cell-12 sm:flex-row sm:flex-col sm:cell-2">
        <p className="m-0 text-sm font-bold inline-block pr-8">Contacts:</p>
        <p className="m-0 font-light inline-block">Mary Marazita</p>
      </div>
    </GridContainer>
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
