import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {Card, Icon, Label, Button, Popup} from 'semantic-ui-react';
import FileCounts from '../StudyInfo/FileCounts';
import CavaticaLogo from '../../assets/CavaticaLogo';

import CavaticaCounts from '../StudyInfo/CavaticaCounts';
import {trackedStudyFields} from '../../common/notificationUtils';
import {withAnalyticsTracking} from '../../analyticsTracking';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */
const StudyCard = ({
  studyId,
  studyName,
  files,
  projects,
  history,
  lastUpdate,
  missingValue,
  missingProject,
  requiredFileChanges,
  tracking: {
    logEvent,
    buttonTracking,
    EVENT_CONSTANTS: {STUDY_CARD_},
    popupTracking,
  },
}) => {
  const projectsCounts = projects && projects.length > 0 ? projects.length : 0;
  const needsAttention =
    missingValue > 0 ||
    missingProject > 0 ||
    requiredFileChanges > 0 ||
    projectsCounts < 1;
  const [showDetail, setShowDetail] = useState(false);
  const toolTips = {
    info:
      trackedStudyFields.length -
      missingValue +
      '/' +
      trackedStudyFields.length +
      ' complete',
    files:
      files.length === 0
        ? 'No files'
        : '' + requiredFileChanges > 0
        ? requiredFileChanges + ' files need changes'
        : '',
  };

  const logStudyCardEvent = (action, payload) =>
    logEvent(STUDY_CARD_[action], payload);

  const ToggleDetailButton = ({testId}) => (
    <Button
      as={Label}
      basic
      floated="right"
      size="mini"
      data-testid={testId}
      icon={showDetail ? 'chevron up' : 'chevron down'}
      onClick={e => {
        setShowDetail(!showDetail);
        logStudyCardEvent('TOGGLE_DETAIL', {
          button_text: testId,
          button_type: 'icon',
          show_detail: !showDetail,
        });
      }}
    />
  );

  return (
    <Card color={needsAttention ? 'red' : null}>
      {needsAttention && (
        <Label corner="right" size="mini">
          <Icon name="exclamation" size="mini" color="red" />
        </Label>
      )}
      <Card.Content
        as={Link}
        to={`/study/${studyId}/basic-info/info`}
        onClick={() => {
          logStudyCardEvent('CLICK');
        }}
      >
        <Card.Header>{studyName}</Card.Header>
        <Card.Meta>{studyId}</Card.Meta>
      </Card.Content>
      {showDetail === false && (
        <Card.Content extra compact="very" size="mini">
          <Popup
            inverted
            position="top center"
            size="small"
            content={toolTips.info}
            trigger={
              <Link
                onClick={
                  popupTracking({
                    name: 'Info',
                    content: toolTips.info,
                    link: `/study/${studyId}/basic-info/info`,
                  }).onClick
                }
                to={`/study/${studyId}/basic-info/info`}
                className="pr-5"
              >
                <Icon
                  name={missingValue > 0 ? 'clipboard list' : 'clipboard check'}
                  color={missingValue > 0 ? 'red' : 'grey'}
                />
                Info
              </Link>
            }
          />
          <Popup
            inverted
            position="top center"
            size="small"
            content={toolTips.files}
            disabled={files.length > 0 && requiredFileChanges < 1}
            trigger={
              <Link
                onClick={
                  popupTracking({
                    name: 'Files',
                    content: toolTips.files,
                    link: `/study/${studyId}/documents`,
                  }).onClick
                }
                to={`/study/${studyId}/documents`}
                className="pr-5"
              >
                <Icon
                  name="file"
                  color={
                    files.length > 0 && requiredFileChanges < 1 ? 'grey' : 'red'
                  }
                />
                {files.length} Files
              </Link>
            }
          />
          <Popup
            inverted
            position="top center"
            size="small"
            content="Missing projects"
            disabled={projectsCounts > 0 && missingProject < 1}
            trigger={
              <Link
                to={`/study/${studyId}/cavatica`}
                onClick={
                  popupTracking({
                    name: 'Projects',
                    content: 'Missing projects',
                    link: `/study/${studyId}/cavatica`,
                  }).onClick
                }
              >
                <CavaticaLogo
                  className="mr-5 vertical-middle"
                  fill={
                    projectsCounts > 0 && missingProject < 1
                      ? 'rgba(0,0,0,.6)'
                      : '#db2828'
                  }
                />
                {projectsCounts} projects
              </Link>
            }
          />
          <ToggleDetailButton testId="show-detail" />
        </Card.Content>
      )}
      {showDetail && (
        <>
          <Card.Content extra compact="very" size="mini">
            <FileCounts
              title={studyId}
              files={files}
              history={history}
              eventProperties={{
                scope: 'StudyCard',
              }}
            />
            <ToggleDetailButton testId="show-detail" />
          </Card.Content>
          <Card.Content extra compact="very" size="mini">
            <CavaticaCounts title={studyId} projects={projects} />
          </Card.Content>
        </>
      )}
    </Card>
  );
};

StudyCard.propTypes = {
  /** Name to display as the card header */
  studyId: PropTypes.string,
  /** Text to display as the card body */
  studyName: PropTypes.string,
  /** Optional lastUpdate date to display in the card body */
  lastUpdate: PropTypes.instanceOf(Date),
};

StudyCard.defaultProps = {
  studyId: null,
  studyName: null,
  lastUpdate: null,
};

export default withRouter(withAnalyticsTracking(StudyCard));
