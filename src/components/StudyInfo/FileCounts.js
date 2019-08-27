import React from 'react';
import {List, Icon, Popup, Label} from 'semantic-ui-react';
import {versionState} from '../../common/fileUtils';

const FileCounts = ({files}) => {
  const states = files.map(
    ({node: {versions}}) => versions.edges[0].node.state,
  );
  const stateCounts = states.reduce((count, state) => {
    count[state] = (count[state] || 0) + 1;
    return count;
  }, {});

  return (
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
  );
};

export default FileCounts;
