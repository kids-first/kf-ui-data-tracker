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
  loading,
}) => {
  const studyHeaderClass = classes('StudyHeader', 'py-8', 'px-12', className);
  const topTextClass = classes(
    loading ? 'StudyHeader--TopText-loading' : 'StudyHeader--TopText',
  );
  const titleTextClass = classes(
    loading ? 'StudyHeader--TitleText-loading' : 'StudyHeader--TitleText',
    'row-3',
    'cell-12',
    'md:row-2',
    'md:cell-10',
  );
  const infoTextClass = classes(
    'hidden',
    'row-2',
    'cell-12',
    'md:cell-2',
    'md:flex-row',
    'md:flex-col',
    loading ? 'StudyHeader--InfoText-loading' : null,
  );
  return (
    <GridContainer className={studyHeaderClass} collapsed="rows">
      <p className={topTextClass}>
        <b>{kfId}</b>
        {kfId && <CopyButton text={kfId} className="pl-4 pr-20" />}
        <small className="font-light">
          last updated: {modifiedAt && <TimeAgo date={modifiedAt} />}
        </small>
      </p>
      <p className={titleTextClass}>{shortName || studyName}</p>
      <div className={infoTextClass}>
        <p className="m-0 text-sm font-bold inline-block pr-8">Contacts:</p>
        <p className="m-0 font-light inline-block">Mary Marazita</p>
      </div>
    </GridContainer>
  );
};

StudyHeader.propTypes = {
  /** the kf_id (SD_XXXXXXX) for the study  */
  kfId: propTypes.string,
  /** datetime of when the study was last updated */
  modifiedAt: propTypes.string,
  /** user friendly name for the study  */
  shortName: propTypes.string,
  /** long programatic name for the study  */
  name: propTypes.string,
  /** Any additional classes to be applied to the button */
  className: propTypes.string,
  /** Loading state of the study header*/
  loading: propTypes.bool,
};

export default StudyHeader;
