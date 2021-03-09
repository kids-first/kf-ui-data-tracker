import {
  Button,
  Header,
  Icon,
  Label,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';

import FileActionButtons from '../FileActionButtons/FileActionButtons';
import KfId from '../../../components/StudyList/KfId';
import PropTypes from 'prop-types';
import React from 'react';
import {fileSortedVersions} from '../../utilities';
import {fileTypeDetail} from '../../../common/enums';

/**
 * Displays data review attached document version list with action buttons
 */
const ReviewVersions = ({
  studyId,
  reviewNode,
  updateReview,
  updateError,
  setAddFileOpen,
  downloadFileMutation,
  canAddFile,
}) => {
  const groupType = ['PDA', 'GWO', 'SEQ', 'S3S'];
  const groupVersions = () => {
    const versions = reviewNode ? reviewNode.versions.edges : [];
    var versionGroups = {
      PDA: [],
      GWO: [],
      SEQ: [],
      S3S: [],
      OTHER: [],
    };
    if (versions.length > 0) {
      versions.forEach(({node}) => {
        if (groupType.includes(node.rootFile.fileType)) {
          versionGroups[node.rootFile.fileType].push(node);
        } else {
          versionGroups.OTHER.push(node);
        }
      });
    }
    return versionGroups;
  };
  const groupedVersions = groupVersions();

  return (
    <Segment basic className="noMargin">
      <Header as="h4" color="grey">
        Documents in Review{' '}
        {updateReview && canAddFile && (
          <Popup
            content="Add documents to current data review"
            position="right center"
            inverted
            trigger={
              <Button
                size="mini"
                labelPosition="left"
                className="ml-15 text-primary"
                onClick={() => {
                  setAddFileOpen(true);
                }}
              >
                <Icon name="add" />
                Add Documents to Review
              </Button>
            }
          />
        )}
      </Header>
      {groupType.map(type => (
        <Table key={type}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                <Icon name={fileTypeDetail[type].icon} />
                {fileTypeDetail[type].title}
                <Popup
                  content={fileTypeDetail[type].description}
                  position="right center"
                  inverted
                  trigger={
                    <Button
                      size="mini"
                      labelPosition="left"
                      className="ml-15 text-primary"
                    >
                      <Icon name="info circle" />
                      More Info
                    </Button>
                  }
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {groupedVersions[type].length > 0 ? (
            <Table.Body>
              {groupedVersions[type].map(node => (
                <Table.Row key={node.id}>
                  <Table.Cell>
                    <Link
                      to={`/study/${studyId}/documents/${node.rootFile.kfId}`}
                    >
                      {node.rootFile.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {fileSortedVersions(node.rootFile)[0].node.kfId ===
                    node.kfId ? (
                      <Label basic size="mini">
                        LATEST VERSION
                      </Label>
                    ) : (
                      <small className="text-red">NOT latest version</small>
                    )}
                  </Table.Cell>
                  <KfId kfId={node.kfId} />
                  <Table.Cell textAlign="right" width="2">
                    <FileActionButtons
                      node={node.rootFile}
                      studyId={studyId}
                      downloadFileMutation={downloadFileMutation}
                      version={node}
                      updateReview={updateReview}
                      reviewNode={reviewNode}
                      updateError={updateError}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell colSpan="4" disabled>
                  No documents of this type are added
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table>
      ))}
      {groupedVersions.OTHER.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="4">
                <Icon name="question" />
                Other
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groupedVersions.OTHER.map(node => (
              <Table.Row key={node.id}>
                <Table.Cell>
                  <Link
                    to={`/study/${studyId}/documents/${node.rootFile.kfId}`}
                  >
                    {node.rootFile.name}
                  </Link>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {fileSortedVersions(node.rootFile)[0].node.kfId ===
                  node.kfId ? (
                    <Label basic size="mini">
                      LATEST VERSION
                    </Label>
                  ) : (
                    <small className="text-red">NOT latest version</small>
                  )}
                </Table.Cell>
                <KfId kfId={node.kfId} />
                <Table.Cell textAlign="right" width="2">
                  <FileActionButtons
                    node={node.rootFile}
                    studyId={studyId}
                    downloadFileMutation={downloadFileMutation}
                    version={node}
                    updateReview={updateReview}
                    reviewNode={reviewNode}
                    updateError={updateError}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Segment>
  );
};

ReviewVersions.propTypes = {
  /** Array of study object*/
  reviewNode: PropTypes.object,
  /** Function to update file node  */
  updateReview: PropTypes.func,
};

ReviewVersions.defaultProps = {
  reviewNode: null,
};

export default withRouter(ReviewVersions);
