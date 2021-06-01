import {Checkbox, Icon, Popup, Table} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {fileLatestDate, fileSortedVersions} from '../../utilities';

import FileActionButtons from '../FileActionButtons/FileActionButtons';
import FileTags from '../FileDetail/FileTags';
import FolderActionButtons from './FolderActionButtons';
import KfId from '../../../components/StudyList/KfId';
import Markdown from 'react-markdown';
import TimeAgo from 'react-timeago';
import {fileTypeDetail} from '../../../common/enums';
import {longDate} from '../../../common/dateUtils';

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
 * Displays single file or folder element
 */
const FileSimpleElement = ({
  fileNode,
  loading,
  history,
  match,
  fileListId,
  updateFile,
  deleteFile,
  downloadFileMutation,
  selected,
  onSelectOne,
  tagOptions,
  setOpenedNode,
  setInputOpen,
  setRenameOpen,
  setDeleteOpen,
  updateHash,
}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.title || 'unknown file name';
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType]
      : {title: 'unknown', icon: 'question'};
  const justUpdated = useRecentlyUpdated(latestDate, fileKfID);

  if (fileNode.isDirectory) {
    return (
      <Table.Row
        style={{backgroundColor: justUpdated ? '#f8ffff' : 'inherit'}}
        data-testid="file-item"
        className="cursor-pointer"
        onClick={() => {
          updateHash(fileNode);
          setOpenedNode(fileNode);
        }}
      >
        <Table.Cell textAlign="center">-</Table.Cell>
        <Popup
          header="Folder"
          content={fileNode.children.length + ' element(s) included'}
          trigger={
            <Table.Cell textAlign="center">
              <Icon name="folder" />
            </Table.Cell>
          }
        />
        <Table.Cell>{fileName}</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">-</Table.Cell>
        <Table.Cell textAlign="center">
          {updateFile ? (
            <FolderActionButtons
              fileNode={fileNode}
              setInputOpen={setInputOpen}
              setRenameOpen={setRenameOpen}
              setDeleteOpen={setDeleteOpen}
            />
          ) : (
            '-'
          )}
        </Table.Cell>
      </Table.Row>
    );
  } else {
    // Show at most 5 lines of the description
    const fileDescription =
      fileNode.description
        .split('\n')
        .splice(0, 5)
        .join('\n') || '';
    return (
      <Table.Row
        style={{backgroundColor: justUpdated ? '#f8ffff' : 'inherit'}}
        data-testid="file-item"
        className="cursor-pointer"
        onClick={() =>
          history.push(`/study/${match.params.kfId}/documents/${fileKfID}`)
        }
      >
        <Table.Cell
          textAlign="center"
          onClick={e => {
            e.stopPropagation();
            onSelectOne(fileKfID);
          }}
        >
          <Checkbox data-testid="file-select" checked={selected} />
        </Table.Cell>
        <Popup
          wide="very"
          header={fileType.title || 'Unknown Type'}
          content={fileType.description || 'Unknown Type'}
          trigger={
            <Table.Cell textAlign="center">
              <Icon name={fileType.icon || 'question'} />
            </Table.Cell>
          }
        />
        <Popup
          wide="very"
          position="top left"
          trigger={
            <Table.Cell>
              <Link to={`/study/${match.params.kfId}/documents/${fileKfID}`}>
                {fileName}
              </Link>
            </Table.Cell>
          }
          mouseLeaveDelay={500}
          content={
            <Markdown
              source={fileDescription}
              renderers={{
                image: Image,
                table: props => <Table>{props.children}</Table>,
              }}
              linkTarget="_blank"
            />
          }
        />
        <KfId kfId={fileNode.kfId} />
        <Table.Cell textAlign="center" width="4">
          <FileTags
            fileNode={fileNode}
            updateFile={updateFile}
            defaultOptions={tagOptions}
            limit={1}
            reload={true}
          />
        </Table.Cell>
        <Table.Cell textAlign="center" width="1">
          <TimeAgo
            date={latestDate}
            live={false}
            title={longDate(latestDate)}
          />
        </Table.Cell>
        <Table.Cell textAlign="center">
          <FileActionButtons
            fluid
            node={fileNode}
            studyId={fileListId}
            deleteFile={deleteFile}
            downloadFileMutation={downloadFileMutation}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
};

export default withRouter(FileSimpleElement);
