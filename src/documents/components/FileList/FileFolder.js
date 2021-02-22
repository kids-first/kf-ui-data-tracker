import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  List,
  Modal,
} from 'semantic-ui-react';
import React, {useState} from 'react';
import SortableTree, {insertNode} from 'react-sortable-tree';
import {
  generatePath,
  keyedFiles,
  listToTree,
  treeToList,
} from '../../../common/treeDataUtils';

import FolderItem from './FolderItem';
import {searchTree} from '../../../common/treeDataUtils';
import {v4 as uuidv4} from 'uuid';
import {withRouter} from 'react-router-dom';

/**
 * Displays study files in folder view
 */
const FileFolder = ({
  fileList,
  updateFile,
  deleteFile,
  match,
  history,
  allowUploadFile,
  allowUploadVersion,
  folderMode,
  setFolderMode,
  onUpload,
}) => {
  const filesFlat = keyedFiles(fileList, match);
  const filesTree = listToTree(filesFlat);
  const [searchString, setSearchString] = useState('');
  const [treeData, setTreeData] = useState(filesTree);
  const [inputOpen, setInputOpen] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [renameOpen, setRenameOpen] = useState(null);
  const [renameInput, setRenameInput] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(null);

  const existNames =
    fileList.length > 0 ? fileList.map(({node}) => node.name) : [];
  const existFolders =
    filesFlat.length > 0
      ? filesFlat
          .map(f => (f.isDirectory ? f.title : null))
          .filter(t => t !== null)
      : [];

  const updateTags = (kfId, newPath) => {
    const file = fileList.find(({node}) => node.kfId === kfId);
    if (!file) return;
    const fileNode = file.node;
    const oldPath = fileNode.tags.find(t => t.includes('/')) || null;
    const tags =
      oldPath !== newPath
        ? fileNode.tags.concat(newPath).filter(t => t !== oldPath && t !== '')
        : fileNode.tags;
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        tags: tags,
        name: fileNode.name,
      },
    });
  };

  const updateName = (kfId, newName) => {
    const fileNode = fileList.find(({node}) => node.kfId === kfId).node;
    updateFile({
      variables: {
        kfId: fileNode.kfId,
        fileType: fileNode.fileType,
        tags: fileNode.tags,
        name: newName,
      },
    });
  };

  const handleMoveNode = props => {
    var tree = treeData;
    if (props.node.isDirectory) {
      const allChildren = treeToList(props.node);
      const newFolderPath = props.nextParentNode
        ? generatePath(props, treeData, filesFlat)
        : '';
      allChildren.forEach(f => {
        searchTree({title: 'root', children: tree}, props.node.title).path =
          newFolderPath + props.node.title + '/';
        updateTags(f.kfId, newFolderPath + props.node.title + '/');
      });
    } else {
      if (props.nextParentNode) {
        searchTree(
          {title: 'root', children: treeData},
          props.node.title,
        ).path = generatePath(props, tree, filesFlat);
        updateTags(props.node.kfId, generatePath(props, treeData, filesFlat));
      } else {
        searchTree({title: 'root', children: tree}, props.node.title).path = '';
        updateTags(props.node.kfId, '');
      }
    }
    setTreeData(tree);
  };

  const handleNewFolder = () => {
    if (inputOpen === '_root_') {
      const newRootFolder = insertNode({
        treeData: treeData,
        depth: 0,
        minimumTreeIndex: treeData.length,
        newNode: {
          key: uuidv4(),
          title: nameInput,
          isDirectory: true,
          children: [],
          expanded: false,
          parentId: '',
        },
      });
      setTreeData(newRootFolder.treeData);
    } else {
      var tree = treeData;
      var selectedNode = searchTree({title: 'root', children: tree}, inputOpen);
      selectedNode.children.push({
        key: uuidv4(),
        title: nameInput,
        isDirectory: true,
        children: [],
        expanded: false,
        parentId: selectedNode.title,
      });
      setTreeData(tree);
    }
    setNameInput('');
  };

  const handleUpdateFolder = () => {
    if (renameOpen.isDirectory) {
      if (renameOpen.children.length > 0) {
        const allChildren = treeToList(renameOpen);
        if (allChildren.length > 0) {
          allChildren.forEach(f => {
            updateTags(f.kfId, f.path.replace(renameOpen.title, renameInput));
          });
        }
      }
    } else {
      updateName(renameOpen.kfId, renameInput);
    }
    var tree = treeData;
    var selectedNode = searchTree(
      {title: 'root', children: tree},
      renameOpen.title,
    );
    selectedNode.title = renameInput;
    setTreeData(tree);
    setRenameInput('');
  };

  const handleDeleteNode = () => {
    const parentNode = deleteOpen.parentNode;
    const selectedNode = deleteOpen.node;
    const allChildren = treeToList(selectedNode);
    if (selectedNode.isDirectory) {
      if (selectedNode.children.length > 0 && allChildren.length > 0) {
        allChildren.forEach(f => {
          updateTags(f.kfId, '');
        });
      }
    } else {
      deleteFile({variables: {kfId: selectedNode.kfId}});
    }
    var tree = treeData.concat(allChildren);
    if (parentNode !== null) {
      const nodeIndex = searchTree(
        {title: 'root', children: tree},
        parentNode.title,
      ).children.indexOf(selectedNode);
      searchTree(
        {title: 'root', children: tree},
        parentNode.title,
      ).children.splice(nodeIndex, 1);
      setTreeData(tree);
    } else {
      setTreeData(tree.filter(f => f.title !== selectedNode.title));
    }
  };

  const handleViewToggle = e => {
    e.preventDefault();
    e.stopPropagation();
    setFolderMode(!folderMode);
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <h2>Study Documents</h2>
        </Grid.Column>
        {fileList.length > 0 && (allowUploadFile || allowUploadVersion) && (
          <Grid.Column width={12} textAlign="right">
            <Input
              icon="search"
              placeholder="Search..."
              onChange={(e, {value}) => {
                setSearchString(value);
              }}
            />
            <Button.Group floated="right" className="ml-15">
              <Button
                icon="folder"
                active={folderMode}
                data-testid="file-folder-mode"
                onClick={handleViewToggle}
              />
              <Button
                icon="list"
                active={!folderMode}
                data-testid="file-list-mode"
                onClick={handleViewToggle}
              />
            </Button.Group>
            <Button
              className="ml-15"
              compact
              primary
              floated="right"
              size="large"
              icon="cloud upload"
              labelPosition="left"
              content="Upload Document"
              as="label"
              htmlFor="file"
            />
            <input
              hidden
              multiple
              id="file"
              type="file"
              onChange={e => onUpload(e.target.files[0])}
            />
            <Button
              className="ml-15"
              onClick={() => {
                setInputOpen('_root_');
              }}
            >
              <Icon.Group className="mr-5">
                <Icon name="folder" />
                <Icon corner name="add" />
              </Icon.Group>
              New folder
            </Button>
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16} className="h-500-container">
          <SortableTree
            style={{width: '100%'}}
            rowHeight={60}
            searchQuery={searchString}
            treeData={treeData}
            onChange={treeData => setTreeData(treeData)}
            nodeContentRenderer={props => {
              return (
                <FolderItem
                  nodeProps={props}
                  searchString={searchString}
                  setSearchString={setSearchString}
                  updateFile={updateFile}
                  deleteFile={deleteFile}
                  studyId={match.params.kfId}
                  setInputOpen={setInputOpen}
                  setRenameOpen={setRenameOpen}
                  setDeleteOpen={setDeleteOpen}
                />
              );
            }}
            onMoveNode={handleMoveNode}
            canDrag={({node}) => !node.dragDisabled && updateFile}
            canDrop={({nextParent}) => !nextParent || nextParent.isDirectory}
          />
        </Grid.Column>
      </Grid.Row>
      <Modal open={inputOpen !== null} size="small">
        <Modal.Header>Please name your new folder</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            placeholder="Folder name ..."
            value={nameInput}
            onChange={(e, {value}) => {
              setNameInput(value);
            }}
          />
          {existFolders.includes(nameInput) && (
            <small className="text-red">
              This name is used by another folder.
            </small>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              setNameInput('');
              setInputOpen(null);
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            disabled={
              nameInput.length === 0 || existFolders.includes(nameInput)
            }
            onClick={() => {
              setInputOpen(null);
              handleNewFolder();
            }}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal open={renameOpen !== null} size="small">
        <Modal.Header>
          {renameOpen && renameOpen.isDirectory
            ? 'Please rename your folder'
            : 'Please rename your file'}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            placeholder={renameOpen ? renameOpen.title : 'New Name ...'}
            value={renameInput}
            onChange={(e, {value}) => {
              setRenameInput(value);
            }}
            error={existNames.includes(renameInput)}
          />
          {existNames.includes(renameInput) && (
            <small className="text-red">
              This name is used by another file.
            </small>
          )}
          {existFolders.includes(renameInput) && (
            <small className="text-red">
              This name is used by another folder.
            </small>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              setRenameInput('');
              setRenameOpen(null);
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            disabled={
              renameInput.length === 0 ||
              existNames.includes(renameInput) ||
              existFolders.includes(renameInput)
            }
            onClick={() => {
              setRenameOpen(null);
              handleUpdateFolder();
            }}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal open={deleteOpen !== null} size="small">
        <Modal.Header>
          Please confirm the deletion of file or folder
        </Modal.Header>
        {deleteOpen && (
          <Modal.Content>
            {deleteOpen.node.isDirectory ? (
              <>
                <Header as="h4">Folder Selected:</Header>
                <List className="pl-16" size="large">
                  <List.Item>
                    <List.Icon className="mr-5" name="folder" />
                    {deleteOpen.node.title}
                  </List.Item>
                </List>
                {deleteOpen.node.children.length > 0 &&
                  treeToList(deleteOpen.node).length > 0 && (
                    <>
                      <Header as="h4">
                        Files will be reset back to root directory:
                      </Header>
                      <List className="pl-16" size="large">
                        {treeToList(deleteOpen.node).map(f => (
                          <List.Item key={f.kfId}>
                            <List.Icon className="mr-5" name="file alternate" />
                            {f.title}
                          </List.Item>
                        ))}
                      </List>
                    </>
                  )}
              </>
            ) : (
              <>
                <Header as="h4">File Selected:</Header>
                <List className="pl-16" size="large">
                  <List.Item>
                    <List.Icon className="mr-5" name="file alternate" />
                    {deleteOpen.node.title}
                  </List.Item>
                </List>
              </>
            )}
            <Divider />
            <List bulleted size="small" className="text-grey pl-16">
              <List.Item>
                File and its versions and history will be deleted.
              </List.Item>
              <List.Item>
                Folder will be and deleted with the files in it reset back to
                root direcory.
              </List.Item>
            </List>
          </Modal.Content>
        )}
        <Modal.Actions>
          <Button
            onClick={() => {
              setDeleteOpen(null);
            }}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              setDeleteOpen(null);
              handleDeleteNode();
            }}
          >
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </Grid>
  );
};

export default withRouter(FileFolder);
