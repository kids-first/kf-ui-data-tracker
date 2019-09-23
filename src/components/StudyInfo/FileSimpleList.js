import React, {useState} from 'react';
import {Icon, Label, List, Button} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import FileCounts from './FileCounts';
import {
  fileTypeDetail,
  fileSortedVersions,
  fileLatestStatus,
  fileLatestDate,
  versionState,
} from '../../common/fileUtils';
import {longDate} from '../../common/dateUtils';

const FileSimpleList = ({files}) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <FileCounts files={files} />
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
                    title={longDate(fileLatestDate(fileSortedVersions(node)))}
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
