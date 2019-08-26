import React, {useState} from 'react';
import {Icon, Label, List, Popup, Button} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {
  fileTypeDetail,
  fileSortedVersions,
  fileLatestStatus,
  fileLatestDate,
  versionState,
} from '../../common/fileUtils';

const FileSimpleList = ({files}) => {
  const [showDetail, setShowDetail] = useState(false);
  const states = files.map(
    ({node: {versions}}) => versions.edges[0].node.state,
  );
  const stateCounts = states.reduce((count, state) => {
    count[state] = (count[state] || 0) + 1;
    return count;
  }, {});

  return (
    <>
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
      <Button
        as={Label}
        basic
        floated="right"
        size="mini"
        icon={showDetail ? 'chevron up' : 'chevron down'}
        onClick={() => setShowDetail(!showDetail)}
      />
      {showDetail && (
        <List relaxed="very">
          {files.map(({node}) => (
            <List.Item key={node.id}>
              <Icon
                name={fileTypeDetail[node.fileType].icon}
                color={versionState[fileLatestStatus(node)].labelColor}
              />
              <List.Content>
                <List.Content floated="right">
                  <TimeAgo
                    live={false}
                    date={fileLatestDate(fileSortedVersions(node))}
                  />
                </List.Content>
                {node.name}
              </List.Content>
            </List.Item>
          ))}
        </List>
      )}
    </>
  );
};

export default FileSimpleList;
