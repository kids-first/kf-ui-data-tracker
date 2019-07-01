import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Card, Icon, Label, List, Popup} from 'semantic-ui-react';
import {versionState} from '../../common/fileUtils';

/**
 * Displays each study with its kfId, name(shortName), and modifiedAt
 */

const StudyCard = ({title, body, files, lastUpdate}) => {
  const states = files.map(
    ({node: {versions}}) => versions.edges[0].node.state,
  );

  const stateCounts = states.reduce((count, state) => {
    count[state] = (count[state] || 0) + 1;
    return count;
  }, {});

  return (
    <Card as={Link} to={`/study/${title}/documents`}>
      <Card.Content>
        <Card.Header>{title}</Card.Header>

        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <List horizontal>
          <List.Item>
            <Icon name="file" />
            {files.length} files
          </List.Item>
          {['PEN', 'CHN', 'APP', 'PRC'].map(
            state =>
              state in stateCounts && (
                <Popup
                  inverted
                  position="top center"
                  size="small"
                  content={versionState[state].title}
                  key={state}
                  trigger={
                    <List.Item>
                      <Label
                        circular
                        empty
                        size="mini"
                        color={versionState[state].labelColor}
                      />{' '}
                      {stateCounts[state]}
                    </List.Item>
                  }
                />
              ),
          )}
        </List>
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
