import {fileLatestDate, fileSortedVersions} from '../documents/utilities';

import {v4 as uuidv4} from 'uuid';

export const listToTree = list => {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].title] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== '') {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentId]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const searchTree = (element, matchingTitle) => {
  if (element.title === matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle);
    }
    return result;
  }
};

export const generatePath = (props, treeData, filesFlat) => {
  var parents = [];
  parents.push(props.nextParentNode.title);
  var i = 0;
  var parent = searchTree(
    {title: 'root', children: treeData},
    props.nextParentNode.parentId,
  );
  if (parent) {
    parents.push(parent.title);
  }
  for (i = 0; i < filesFlat.length + 1; i += 1) {
    if (parent === null || parent.parentId === '') {
      break;
    } else {
      parent = searchTree({title: 'root', children: treeData}, parent.parentId);
      parents.push(parent.title);
    }
  }
  const path =
    parents.filter(p => p !== '').length > 0
      ? parents.reverse().join('/') + '/'
      : '';
  return path;
};

export const treeToList = (node, result = []) => {
  if (!node.children.length) result.push(node);
  for (const child of node.children) treeToList(child, result);
  return result;
};

export const keyedFiles = fileList => {
  var filesFlat = [];
  fileList.forEach(({node}) => {
    const pathTag = node.tags.find(t => t.includes('PATH'));
    const path = pathTag ? pathTag.slice(5) : '';
    const sortedVersions = fileSortedVersions(node);
    const latestSize = sortedVersions[0].node.size;
    const latestDate = fileLatestDate(sortedVersions);
    const folders = path.split('/').filter(f => f !== '');
    filesFlat.push({
      key: node.kfId,
      title: node.name,
      modified: Date.parse(latestDate),
      size: latestSize,
      kfId: node.kfId,
      isDirectory: false,
      fileType: node.fileType,
      parentId: folders.length > 0 ? folders[folders.length - 1] : '',
      path: path,
      description: node.description,
      tags: node.tags,
      versions: node.versions,
      downloadUrl: node.downloadUrl,
    });
    if (folders.length > 0) {
      folders.forEach((folder, index) => {
        filesFlat.push({
          key: uuidv4(),
          title: folder,
          isDirectory: true,
          parentId: index === 0 ? '' : folders[index - 1],
          expanded: false,
          kfId: '',
          tags: [],
          fileType: '',
        });
      });
    }
  });
  return filesFlat
    .filter(
      (obj, index, self) =>
        index ===
        self.findIndex(
          t => t.parentId === obj.parentId && t.title === obj.title,
        ),
    )
    .sort((a, b) => a.modified - b.modified);
};
