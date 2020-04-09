import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Icon, Label, Button, Popup, Dropdown, Form} from 'semantic-ui-react';
import {defaultTagOptions} from '../../../common/enums';

/**
 * Displays study document removable tags with add button
 */
const FileTags = ({fileNode, updateFile}) => {
  var defaultTags = {};
  defaultTagOptions.map(tagObj => (defaultTags[tagObj.key] = tagObj.text));
  const [tagOptions, setTagOptions] = useState(defaultTagOptions);
  const [tagSelection, setTagSelection] = useState('');
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const handleAddition = (e, {value}) => {
    if (fileNode.tags.includes(value)) {
      setError('Tag already exist');
    } else {
      setError('');
      setTagOptions([{key: value, text: value, value}, ...tagOptions]);
    }
  };
  const handleChange = (e, {value}) => setTagSelection(value);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const addTag = () => {
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        tags: [tagSelection, ...fileNode.tags],
      },
    });
    setTagSelection('');
    setOpen(false);
  };
  const removeTag = tag => {
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        tags: fileNode.tags.filter(t => t !== tag),
      },
    });
  };

  return (
    <Label.Group>
      {fileNode.tags.length > 0 &&
        fileNode.tags
          .slice(0, more ? fileNode.tags.length : 5)
          .map((tag, index) => (
            <Label
              key={index}
              className="my-2"
              title={tag}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {defaultTags[tag] ? defaultTags[tag] : tag.substring(0, 10)}
              {tag.length > 10 && '...'}
              <Icon
                name="close"
                data-testid="remove-tag"
                onClick={e => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              />
            </Label>
          ))}
      {fileNode.tags.length > 5 && (
        <small
          className="mr-5"
          onClick={e => {
            e.stopPropagation();
            setMore(!more);
          }}
        >
          {more ? 'show less' : `+ ${fileNode.tags.length - 5} more`}
        </small>
      )}
      <Popup
        wide
        position="top right"
        on="click"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        content={
          <Form onSubmit={addTag}>
            <Dropdown
              defaultOpen
              searchInput={{autoFocus: true}}
              data-testid="tag-dropdown"
              placeholder="Tags"
              search
              selection
              allowAdditions
              onAddItem={handleAddition}
              onChange={handleChange}
              options={tagOptions.filter(v => !fileNode.tags.includes(v.value))}
              error={tagSelection.length > 50 || error.length > 0}
            />
            {tagSelection.length > 50 || error.length > 0 ? (
              <p className="text-red">
                {tagSelection.length > 50 && 'Tag is too long.'}
                {error}
              </p>
            ) : (
              <Button
                type="submit"
                primary
                icon="add"
                attached="right"
                data-testid="tag-file-add"
                className="my-2"
                disabled={tagSelection.length > 50 || tagSelection.length === 0}
                onClick={e => {
                  e.stopPropagation();
                  addTag();
                }}
              />
            )}
          </Form>
        }
        trigger={
          <Button
            className="square-26"
            size="mini"
            basic
            compact
            icon="add"
            data-testid="tag-file"
            onClick={e => {
              e.stopPropagation();
            }}
          />
        }
      />
    </Label.Group>
  );
};

FileList.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object,
  /** Function to update file node  */
  updateFile: PropTypes.func.isRequired,
};

FileList.defaultProps = {
  fileNode: null,
};

export default FileTags;
