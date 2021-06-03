import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Icon, Label, Button, Popup, Dropdown, Form} from 'semantic-ui-react';

/**
 * Displays study document removable tags with add button
 */
const FileTags = ({
  fileNode,
  updateFile,
  defaultOptions,
  limit,
  reload,
  filters,
  setFilters,
  setSearchString,
}) => {
  const [tagOptions, setTagOptions] = useState(defaultOptions);
  const [tagSelection, setTagSelection] = useState('');
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const pathTag = fileNode.tags.find(t => t.includes('PATH_'));
  const normalTags = fileNode.tags.filter(t => !t.includes('PATH'));

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
    setTagOptions(defaultOptions);
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
    if (reload) {
      window.location.reload();
    }
  };
  const removeTag = tag => {
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        tags: fileNode.tags.filter(t => t !== tag),
      },
    });
    if (reload) {
      window.location.reload();
    }
  };

  return (
    <Label.Group>
      {fileNode.tags.length > 0 ? (
        normalTags.slice(0, limit).map((tag, index) => (
          <Label
            as="a"
            key={index}
            className="my-2"
            title={tag}
            onClick={e => {
              e.stopPropagation();
              if (filters && setFilters) {
                setFilters({...filters, tagFilterStatus: [tag]});
              }
              if (setSearchString) {
                setSearchString(tag);
              }
            }}
          >
            {tag.substring(0, 15)}
            {tag.length > 15 && '...'}
            {updateFile && (
              <Icon
                name="close"
                data-testid="remove-tag"
                onClick={e => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
              />
            )}
          </Label>
        ))
      ) : (
        <span className="text-grey">{updateFile === null && 'No Tags'}</span>
      )}
      {normalTags.length > limit && (
        <Popup
          onClose={() => setMore(false)}
          trigger={
            <small
              className="mr-5"
              onClick={e => {
                e.stopPropagation();
                setMore(!more);
              }}
            >
              {more ? 'show less' : `+ ${normalTags.length - limit} more`}
            </small>
          }
          content={
            <>
              {normalTags
                .slice(limit, fileNode.tags.length + 1)
                .map((tag, index) => (
                  <Label
                    as="a"
                    key={index}
                    className="my-2"
                    title={tag}
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (filters && setFilters) {
                        setFilters({...filters, tagFilterStatus: [tag]});
                      }
                      if (setSearchString) {
                        setSearchString(tag);
                      }
                    }}
                  >
                    {tag.substring(0, 15)}
                    {tag.length > 15 && '...'}
                    {updateFile && (
                      <Icon
                        name="close"
                        data-testid="remove-tag"
                        onClick={e => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                      />
                    )}
                  </Label>
                ))}
            </>
          }
          on="click"
          position="top center"
        />
      )}
      {updateFile && (
        <Popup
          wide
          position="bottom left"
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
                options={tagOptions.filter(
                  v =>
                    !fileNode.tags.includes(v.value) &&
                    !v.value.includes('PATH_'),
                )}
                error={tagSelection.length > 50 || error.length > 0}
              />
              {tagSelection.length > 50 ||
              error.length > 0 ||
              tagSelection === 'untagged' ||
              (pathTag && tagSelection.includes('PATH')) ? (
                <p className="text-red">
                  {tagSelection.length > 50 && 'Tag is too long.'}
                  {error}
                  {tagSelection === 'untagged' && 'Tag "untagged" is reserved'}
                  {pathTag &&
                    tagSelection.includes('PATH_') &&
                    'Path tag already exist'}
                </p>
              ) : (
                <Button
                  type="submit"
                  primary
                  icon="add"
                  attached="right"
                  data-testid="tag-file-add"
                  className="my-2"
                  disabled={
                    tagSelection.length > 50 ||
                    tagSelection.length === 0 ||
                    tagSelection === 'untagged'
                  }
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
      )}
    </Label.Group>
  );
};

FileList.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object,
  /** Function to update file node  */
  updateFile: PropTypes.func.isRequired,
  /** Array of tag options used in current study */
  defaultOptions: PropTypes.array,
  /** How many tags to display at default */
  limit: PropTypes.number,
  /** If force reload the page on updating tags */
  reload: PropTypes.bool,
};

FileList.defaultProps = {
  fileNode: null,
  defaultOptions: [],
  limit: 4,
  reload: false,
};

export default FileTags;
