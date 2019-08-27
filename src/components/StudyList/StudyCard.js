import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Card} from 'semantic-ui-react';
import FileCounts from '../StudyInfo/FileCounts';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */

const StudyCard = ({title, body, files, lastUpdate}) => {
  return (
    <Card as={Link} to={`/study/${title}/documents`}>
      <Card.Content>
        <Card.Header>{title}</Card.Header>

        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <FileCounts files={files} />
      </Card.Content>
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

export default StudyCard;
