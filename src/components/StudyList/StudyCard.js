import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {Card, Icon, Label, Button, Popup} from 'semantic-ui-react';
import FileCounts from '../StudyInfo/FileCounts';
import CavaticaCounts from '../StudyInfo/CavaticaCounts';
import {trackedStudyFields} from '../../common/notificationUtils';
/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */
const StudyCard = ({
  title,
  body,
  files,
  projects,
  history,
  lastUpdate,
  missingValue,
  missingProject,
  requiredFileChanges,
}) => {
  const projectsCounts = projects && projects.length > 0 ? projects.length : 0;
  const needsAttention =
    missingValue > 0 ||
    missingProject > 0 ||
    requiredFileChanges > 0 ||
    projectsCounts < 1;
  const [showDetail, setShowDetail] = useState(false);
  return (
    <Card
      to={`/study/${title}/documents`}
      color={needsAttention ? 'red' : null}
    >
      {needsAttention && (
        <Label corner="right" size="mini">
          <Icon name="exclamation" size="mini" color="red" />
        </Label>
      )}
      <Card.Content as={Link} to={`/study/${title}/basic-info/info`}>
        <Card.Header>{body}</Card.Header>
        <Card.Meta>{title}</Card.Meta>
      </Card.Content>
      {showDetail === false && (
        <Card.Content extra compact="very" size="mini">
          <Popup
            inverted
            position="top center"
            size="small"
            content={
              trackedStudyFields.length -
              missingValue +
              '/' +
              trackedStudyFields.length +
              ' complete'
            }
            trigger={
              <Link to={`/study/${title}/basic-info/info`} className="pr-5">
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
            content={
              files.length === 0
                ? 'No files'
                : '' + requiredFileChanges > 0
                ? requiredFileChanges + ' files need changes'
                : ''
            }
            disabled={files.length > 0 && requiredFileChanges < 1}
            trigger={
              <Link to={`/study/${title}/documents`} className="pr-5">
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
              <Link to={`/study/${title}/cavatica`}>
                <Icon
                  name="code branch"
                  color={
                    projectsCounts > 0 && missingProject < 1 ? 'grey' : 'red'
                  }
                />
                {projectsCounts} projects
              </Link>
            }
          />
          <Button
            as={Label}
            basic
            floated="right"
            size="mini"
            icon={showDetail ? 'chevron up' : 'chevron down'}
            onClick={() => setShowDetail(!showDetail)}
          />
        </Card.Content>
      )}
      {showDetail && (
        <>
          <Card.Content extra compact="very" size="mini">
            <FileCounts title={title} files={files} history={history} />
            <Button
              as={Label}
              basic
              floated="right"
              size="mini"
              icon={showDetail ? 'chevron up' : 'chevron down'}
              onClick={() => setShowDetail(!showDetail)}
            />
          </Card.Content>
          <Card.Content extra compact="very" size="mini">
            <CavaticaCounts title={title} projects={projects} />
          </Card.Content>
        </>
      )}
    </Card>
  );
};

StudyCard.propTypes = {
  /** Name to display as the card header */
  title: PropTypes.string,
  /** Text to display as the card body */
  body: PropTypes.string,
  /** Optional lastUpdate date to display in the card body */
  lastUpdate: PropTypes.instanceOf(Date),
};

StudyCard.defaultProps = {
  title: null,
  body: null,
  lastUpdate: null,
};

export default withRouter(StudyCard);
