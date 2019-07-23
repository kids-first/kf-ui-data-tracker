import React from 'react';
import propTypes from 'prop-types';
import CopyButton from '../CopyButton/CopyButton';
import {Container, Header, Placeholder} from 'semantic-ui-react';

const StudyHeader = ({
  kfId,
  modifiedAt,
  shortName,
  name: studyName,
  loading,
}) => {
  if (loading) {
    return (
      <Container>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Container>
    );
  }

  return (
    <Container>
      <Header as="h1">{studyName}</Header>
      <Header.Subheader as="h2" className="study--header-sub">
        {shortName}
      </Header.Subheader>
      {kfId && <CopyButton basic text={kfId} size="tiny" />}
    </Container>
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
  /** Loading state of the study header*/
  loading: propTypes.bool,
};

export default StudyHeader;
