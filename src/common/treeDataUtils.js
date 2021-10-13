import {fileLatestDate, fileSortedVersions} from '../documents/utilities';

import XLSX from 'xlsx';
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
  var i = 0;
  var parent = searchTree(
    {title: 'root', children: treeData},
    props.nextParentNode.title,
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

export const generateBreadcrumb = (props, treeData, filesFlat) => {
  var parents = [];
  var i = 0;
  var parent = searchTree(
    {title: 'root', children: treeData},
    props.nextParentNode.title,
  );
  if (parent) {
    parents.push(parent);
  }
  for (i = 0; i < filesFlat.length + 1; i += 1) {
    if (parent === null || parent.parentId === '') {
      break;
    } else {
      parent = searchTree({title: 'root', children: treeData}, parent.parentId);
      parents.push(parent);
    }
  }
  return parents.reverse();
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
      searchableTags: node.tags.join('**'),
      templateVersion: node.templateVersion,
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
          searchableTags: '',
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

// Internal function to support customized file folder search
const getReactElementText = parent => {
  if (typeof parent === 'string') {
    return parent;
  }
  if (
    parent === null ||
    typeof parent !== 'object' ||
    !parent.props ||
    !parent.props.children ||
    (typeof parent.props.children !== 'string' &&
      typeof parent.props.children !== 'object')
  ) {
    return '';
  }
  if (typeof parent.props.children === 'string') {
    return parent.props.children;
  }
  return parent.props.children
    .map(child => getReactElementText(child))
    .join('');
};

// Internal function to support customized file folder search
const stringSearch = (key, searchQuery, node, path, treeIndex) => {
  if (typeof node[key] === 'function') {
    return String(node[key]({node, path, treeIndex})).indexOf(searchQuery) > -1;
  }
  if (typeof node[key] === 'object') {
    return getReactElementText(node[key]).indexOf(searchQuery) > -1;
  }
  return node[key] && String(node[key]).indexOf(searchQuery) > -1;
};

// Customized file folder search function
export const searchMethod = ({node, path, treeIndex, searchQuery}) => {
  return (
    stringSearch('title', searchQuery, node, path, treeIndex) ||
    stringSearch('subtitle', searchQuery, node, path, treeIndex) ||
    stringSearch('searchableTags', searchQuery, node, path, treeIndex)
  );
};

// Parse excel file and get the content in csv format
export const processExcel = data => {
  const workbook = XLSX.read(data, {type: 'binary'});
  const firstSheet = workbook.SheetNames[0];
  const excelToCsv = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheet]);
  return excelToCsv;
};

// Form file from data array, support csv, tsv, xlsx, xls format
export const formFile = (fileName, mappedData) => {
  var file = null;
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    let ws = XLSX.utils.json_to_sheet(mappedData);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
    const s2ab = s => {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    };
    const blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    file = new File([blob], fileName, {
      type: blob.type,
    });
  } else {
    file = new File([mappedData], fileName, {
      type: 'text/plain',
    });
  }
  return file;
};
