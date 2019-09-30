import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon, Popup, Label, Button} from 'semantic-ui-react';
import {versionState} from '../../common/fileUtils';

const FileCounts = ({files, title}) => {
  if (files && files.length > 0) {
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
        >
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
  } else {
    return (
      <List horizontal>
        <List.Item
          as={Link}
          to={`/study/${title}/documents#upload-document`}
          onClick={e => e.stopPropagation()}
        >
          <Icon color="red" name="file" />
          <Button
            basic
            primary
            compact
            size="mini"
            icon="upload cloud"
            content="Upload"
          />
        </List.Item>
      </List>
    );
  }
};

export default FileCounts;
