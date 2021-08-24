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
}) => (
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
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="2">Name</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Kids First ID</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      {reviewNode && reviewNode.versions.edges.length > 0 ? (
        <Table.Body>
          {reviewNode.versions.edges.map(({node}) => (
            <Table.Row key={node.id}>
              <Table.Cell>
                <Link to={`/study/${studyId}/documents/${node.rootFile.kfId}`}>
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
              {node.rootFile.templateVersion ? (
                <Popup
                  content={
                    node.rootFile.templateVersion.dataTemplate.description ||
                    '--'
                  }
                  trigger={
                    <Table.Cell>
                      <Icon
                        name={
                          node.rootFile.templateVersion.dataTemplate.icon ||
                          'file outlie'
                        }
                      />
                      {node.rootFile.templateVersion.dataTemplate.name ||
                        'Unknown Data Template'}
                    </Table.Cell>
                  }
                />
              ) : (
                <Popup
                  content={
                    fileTypeDetail[node.rootFile.fileType]
                      ? fileTypeDetail[node.rootFile.fileType].description
                      : '--'
                  }
                  trigger={
                    <Table.Cell>
                      <Icon
                        name={
                          fileTypeDetail[node.rootFile.fileType]
                            ? fileTypeDetail[node.rootFile.fileType].icon
                            : 'question'
                        }
                      />
                      {fileTypeDetail[node.rootFile.fileType]
                        ? fileTypeDetail[node.rootFile.fileType].title
                        : 'Other'}
                    </Table.Cell>
                  }
                />
              )}
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
              No documents are added
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      )}
    </Table>
  </Segment>
);

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
