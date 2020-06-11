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
  disabled,
}) => (
  <Segment
    className="noPadding mt-0 mr-0"
    clearing
    basic
    textAlign="right"
    floated="right"
  >
    <div
      className={disabled ? 'small-inline pr-5 text-gray' : 'small-inline pr-5'}
    >
      {selection.length + '/' + fileList.length + ' selected '}
    </div>
    <Button
      className="h-38"
      compact
      basic
      primary
      size="large"
      icon="download"
      disabled={disabled}
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
            className="h-38"
            compact
            basic
            negative
            size="large"
            icon="trash alternate"
            disabled={disabled}
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
