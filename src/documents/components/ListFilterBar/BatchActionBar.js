import React from 'react';
import {Icon, Button, Segment, Divider, Popup} from 'semantic-ui-react';
import {downloadFile} from '../../utilities';
/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const BatchActionBar = ({
  fileList,
  studyId,
  selection,
  setSelection,
  downloadFileMutation,
  deleteFile,
}) => (
  <Segment className="noHorizontalPadding mt-0" clearing basic textAlign="left">
    <div className="small-inline">
      {selection.length + '/' + fileList.length + ' selected '}
    </div>
    <Button
      floated="right"
      className="h-38"
      compact
      basic
      primary
      size="large"
      icon="download"
      labelPosition="left"
      content="Download Selected Documents"
      onClick={e => {
        e.stopPropagation();
        selection.map(fileId =>
          downloadFile(studyId, fileId, null, downloadFileMutation),
        );
      }}
    />
    {deleteFile && (
      <Popup
        trigger={
          <Button
            floated="right"
            className="h-38"
            compact
            basic
            negative
            size="large"
            icon="trash alternate"
            labelPosition="left"
            content="Delete Selected Documents"
            onClick={e => {
              e.stopPropagation();
            }}
          />
        }
        header="Are you sure?"
        content={
          <>
            These files and all of their versions and history will be deleted
            <Divider />
            <Button
              data-testid="delete-confirm"
              negative
              fluid
              icon={<Icon name="trash alternate" />}
              content="Delete"
              onClick={e => {
                e.stopPropagation();
                selection.map(fileId =>
                  deleteFile({variables: {kfId: fileId}}),
                );
                setSelection([]);
              }}
            />
          </>
        }
        on="click"
        position="top right"
      />
    )}
  </Segment>
);

export default BatchActionBar;
