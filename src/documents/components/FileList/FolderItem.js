import {Button, Icon, List} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import React, {useState} from 'react';

import TimeAgo from 'react-timeago';
import {longDate} from '../../../common/dateUtils';

/**
 * Displays study files in folder view
 */

const FolderItem = ({
  nodeProps,
  searchString,
  setSearchString,
  updateFile,
  deleteFile,
  studyId,
  setInputOpen,
  setRenameOpen,
  setDeleteOpen,
}) => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    className,
    style,
    didDrop,
  } = nodeProps;

  const [hover, setHover] = useState(false);

  let handle;
  if (canDrag) {
    if (typeof node.children === 'function' && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      handle = (
        <div className="rst__loadingHandle">
          <div className="rst__loadingCircle">
            {[...new Array(12)].map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="rst__loadingCirclePoint"
              />
            ))}
          </div>
        </div>
      );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(
        <div className="rst__moveHandle">
          {node.isDirectory ? (
            <Icon
              className="px-10 py-9"
              size="large"
              name={node.expanded ? 'folder open' : 'folder'}
              color={isSearchMatch ? 'blue' : 'black'}
            />
          ) : (
            <Icon
              className="px-10 pt-5"
              size="large"
              name="file alternate"
              color={isSearchMatch ? 'blue' : 'black'}
            />
          )}
        </div>,
        {
          dropEffect: 'copy',
        },
      );
    }
  }
  const isDescendant = (older, younger) => {
    return (
      !!older.children &&
      typeof older.children !== 'function' &&
      older.children.some(
        child => child === younger || isDescendant(child, younger),
      )
    );
  };
  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  let buttonStyle = {left: -0.5 * scaffoldBlockPxWidth};
  return (
    <div style={{height: '100%'}}>
      {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={
                node.expanded ? 'rst__collapseButton' : 'rst__expandButton'
              }
              style={buttonStyle}
              onClick={() => {
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                });
                setSearchString('');
              }}
            />
            {node.expanded && !isDragging && (
              <div
                style={{width: scaffoldBlockPxWidth}}
                className={'rst__lineChildren'}
              />
            )}
          </div>
        )}

      <div className={'rst__rowWrapper'}>
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={[
              'rst__row',
              isLandingPadActive && 'rst__rowLandingPad',
              isLandingPadActive && !canDrop && 'rst__rowCancelPad',
              isSearchMatch && 'rst__rowSearchMatch',
              isSearchFocus && 'rst__rowSearchFocus',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style,
            }}
          >
            {handle}
            <div
              className={[
                'rst__rowContents',
                !canDrag && 'rst__rowContentsDragDisabled',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <List>
                <List.Item className="py-9">
                  {hover && (
                    <List.Content className="ml-30 pt-5" floated="right">
                      <Button.Group size="tiny">
                        {updateFile && node.isDirectory && (
                          <Button
                            onClick={() => setInputOpen(node.title)}
                            className="px-9"
                          >
                            <Icon.Group>
                              <Icon name="folder" />
                              <Icon corner name="add" />
                            </Icon.Group>
                          </Button>
                        )}
                        {updateFile && (
                          <Button
                            icon="pencil"
                            onClick={() => setRenameOpen(node)}
                          />
                        )}
                        {deleteFile && (
                          <Button
                            icon="trash alternate"
                            onClick={() => {
                              setDeleteOpen(nodeProps);
                            }}
                          />
                        )}
                      </Button.Group>
                    </List.Content>
                  )}
                  <List.Content verticalAlign="middle" className="mr-120">
                    <List.Header
                      className={isSearchMatch ? 'text-primary pt-3' : 'pt-3'}
                    >
                      {node.isDirectory ? (
                        node.title
                      ) : (
                        <Link to={`/study/${studyId}/documents/${node.kfId}`}>
                          {node.title}
                        </Link>
                      )}
                    </List.Header>
                    {node.isDirectory ? (
                      <List.Description
                        className={isSearchMatch ? 'text-primary' : 'text-grey'}
                      >
                        {node.children ? node.children.length : 'No'} items
                        included
                      </List.Description>
                    ) : (
                      <List.Description
                        className={isSearchMatch ? 'text-primary' : 'text-grey'}
                      >
                        <List horizontal className="noPadding" size="tiny">
                          {node.kfId && <List.Item>{node.kfId}</List.Item>}
                          <List.Item>{node.fileType}</List.Item>
                          <List.Item>
                            <TimeAgo
                              date={node.modified}
                              live={false}
                              title={longDate(node.modified)}
                            />
                          </List.Item>
                        </List>
                      </List.Description>
                    )}
                  </List.Content>
                </List.Item>
              </List>
            </div>
          </div>,
        )}
      </div>
    </div>
  );
};

export default withRouter(FolderItem);
