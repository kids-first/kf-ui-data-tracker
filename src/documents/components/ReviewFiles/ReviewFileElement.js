import {Checkbox, Icon, Popup, Table} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {fileLatestDate, fileSortedVersions} from '../../utilities';

import FileTags from '../FileDetail/FileTags';
import KfId from '../../../components/StudyList/KfId';
import TimeAgo from 'react-timeago';
import {fileTypeDetail} from '../../../common/enums';
import {longDate} from '../../../common/dateUtils';
import {withRouter} from 'react-router-dom';

const useRecentlyUpdated = (latestDate, fileId) => {
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    let FIVE_MIN = 300000;
    let docs = sessionStorage.getItem('kf_updated_docs');
    // make sure we only select one row
    if (fileId === docs) {
      // make sure that row was updated less than 5 minutes ago
      if (new Date().getTime() - Date.parse(latestDate) < FIVE_MIN) {
        setJustUpdated(true);
        setTimeout(() => {
          // reset after 7seconds
          setJustUpdated(false);
          sessionStorage.removeItem('kf_updated_docs');
        }, 7000);
      }
    }
    return () => {
      setJustUpdated(false);
    };
  }, [latestDate, fileId]);

  return justUpdated;
};

/**
 * Displays unordered study files in list view for data reciew
 */
const ReviewFileElement = ({
  fileNode,
  loading,
  history,
  match,
  fileListId,
  downloadFileMutation,
  selected,
  onSelectOne,
  tagOptions,
}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.name || 'unknown file name';

  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType]
      : {title: 'unknown', icon: 'question'};
  const justUpdated = useRecentlyUpdated(latestDate, fileKfID);
  return (
    <Table.Row
      style={{backgroundColor: justUpdated ? '#f8ffff' : 'inherit'}}
      data-testid="file-item"
      className="cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        onSelectOne(sortedVersions[0].node.id);
      }}
    >
      <Table.Cell
        textAlign="center"
        onClick={e => {
          e.stopPropagation();
          onSelectOne(sortedVersions[0].node.id);
        }}
      >
        <Checkbox data-testid="file-select" checked={selected} />
      </Table.Cell>
      <Popup
        wide="very"
        mouseEnterDelay={500}
        header={fileType.title || 'Unknown Type'}
        content={fileType.description || 'Unknown Type'}
        trigger={
          <Table.Cell textAlign="center">
            <Icon name={fileType.icon || 'question'} />
          </Table.Cell>
        }
      />
      <Popup
        disabled={fileName.length <= 35}
        wide="very"
        position="top left"
        trigger={
          <Table.Cell>
            <span
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                window.open(
                  `/study/${match.params.kfId}/documents/${fileKfID}`,
                );
              }}
            >
              {fileName.substring(0, 35)}
              {fileName.length > 35 && '...'}
            </span>
          </Table.Cell>
        }
        content={fileName}
      />
      <KfId kfId={fileNode.kfId} />
      <Table.Cell textAlign="center" width="1">
        <TimeAgo date={latestDate} live={false} title={longDate(latestDate)} />
      </Table.Cell>
      <Table.Cell textAlign="center" width="4">
        <FileTags fileNode={fileNode} defaultOptions={tagOptions} limit={2} />
      </Table.Cell>
    </Table.Row>
  );
};

export default withRouter(ReviewFileElement);
