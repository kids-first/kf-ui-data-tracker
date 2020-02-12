import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {List, Icon, Popup, Label} from 'semantic-ui-react';
import {versionState} from '../../common/enums';
/**
 * Displays file counts with total number and breaking down by each status
 * When no files exist, show buttons guiding user to upload files
 */
const FileCounts = ({files, title, history, hideIcon}) => {
  const states = files.map(
    ({node: {versions}}) => versions.edges[0].node.state,
  );
  const stateCounts = states.reduce((count, state) => {
    count[state] = (count[state] || 0) + 1;
    return count;
  }, {});

  return (
    <List horizontal>
      <List.Item
        as={Link}
        to={`/study/${title}/documents`}
        onClick={e => e.stopPropagation()}
        className={hideIcon && files.length === 0 ? 'text-red' : null}
      >
        {!hideIcon && (
          <Icon
            name="file"
            color={files && files.length > 0 ? 'grey' : 'red'}
          />
        )}
        {files.length > 0 ? files.length : 'No'} documents
      </List.Item>
      {Object.keys(versionState)
        .slice(0, 4)
        .map(
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
  );
};

FileCounts.propTypes = {
  /** Array of file object*/
  files: PropTypes.array.isRequired,
  /** Study id used by forming the redirect url*/
  title: PropTypes.string.isRequired,
  /** Rect-router history object  */
  history: PropTypes.object,
};

FileCounts.defaultProps = {
  files: [],
};

export default FileCounts;
