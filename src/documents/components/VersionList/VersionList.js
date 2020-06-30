import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {dateCompare} from '../../utilities';
import VersionItem from './VersionItem';
import {Button, Table} from 'semantic-ui-react';
/**
 * Displays ordered versions of one file. (Latest first)
 */
const VersionList = ({
  studyId,
  fileNode,
  onUploadClick,
  onNameClick,
  allowUpload,
}) => {
  return (
    <Table compact="very" selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            singleLine
            colSpan="3"
            textAlign="center"
            verticalAlign="bottom"
          >
            Document Versions ({fileNode.versions.edges.length})
            {allowUpload && (
              <Amplitude
                eventProperties={inheritedProps => ({
                  ...inheritedProps,
                  scope: inheritedProps.scope
                    ? [...inheritedProps.scope, 'button', 'upload button']
                    : ['button', 'upload button'],
                })}
              >
                {({logEvent}) => (
                  <Button
                    compact
                    primary
                    floated="right"
                    onClick={e => {
                      logEvent('click');
                      onUploadClick(e);
                    }}
                    labelPosition="left"
                    size="mini"
                    icon="cloud upload"
                    content="UPLOAD VERSION"
                  />
                )}
              </Amplitude>
            )}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
          <Table.Row>
            <Table.Cell colSpan="3" textAlign="center">
              You don't have any versions of this file yet.
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
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

const TrackedVersionList = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'version list']
        : ['version list'],
    })}
  >
    <VersionList {...props} />
  </Amplitude>
);

export default TrackedVersionList;
