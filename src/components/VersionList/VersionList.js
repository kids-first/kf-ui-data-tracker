import React from 'react';
import PropTypes from 'prop-types';
import {dateCompare} from '../../common/fileUtils';
import VersionItem from './VersionItem';
import {Button, List, Header} from 'semantic-ui-react';
/**
 * Displays ordered versions of one file. (Latest first)
 */
const VersionList = ({studyId, fileNode, onUploadClick, onNameClick}) => {
  return (
    <List divided selection>
      <List.Item>
        <Button
          primary
          floated="right"
          onClick={onUploadClick}
          labelPosition="left"
          size="mini"
          icon="cloud upload"
          content="UPLOAD VERSION"
        />
        <Header as="h4">
          Document Versions ({fileNode.versions.edges.length})
        </Header>
      </List.Item>
      {fileNode.versions.edges.length ? (
        fileNode.versions.edges
          .sort(dateCompare)
          .map(({node}, index) => (
            <VersionItem
              key={index}
              studyId={studyId}
              fileId={fileNode.kfId}
              fileType={fileNode.fileType}
              versionNode={node}
              index={index}
              onNameClick={onNameClick}
            />
          ))
      ) : (
        <List.Item>
          <h3>You don't have any versions of this file yet.</h3>
        </List.Item>
      )}
    </List>
  );
};

VersionList.propTypes = {
  /** Study kfId*/
  studyId: PropTypes.string,
  /** File object*/
  fileNode: PropTypes.object.isRequired,
  /** Action when click on the upload button*/
  onUploadClick: PropTypes.func,
};

VersionList.defaultProps = {
  studyId: null,
  fileNode: {},
};

export default VersionList;
