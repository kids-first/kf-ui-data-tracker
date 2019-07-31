import {KF_STUDY_API} from './globals';

// Compare date of file versions based on their createdAt time. (Latest first)
export const dateCompare = (version1, version2) => {
  return new Date(version2.node.createdAt) - new Date(version1.node.createdAt);
};

// Reformat file size data by adding units to it and accurate to 0.1
export const formatFileSize = (bytes, si) => {
  var thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};

// Download single file by taking studyId, fileId, and versionId as optional
export const downloadFile = (
  studyId,
  fileId,
  versionId,
  downloadFileCallback,
) => {
  downloadFileCallback({
    variables: {
      studyId,
      fileId,
      versionId,
    },
  }).then(resp => {
    const url = `${KF_STUDY_API}${resp.data.signedUrl.url}`;
    window.location.href = url;
  });
};

// Store file type title, description and icon
export const fileTypeDetail = {
  SHM: {
    icon: 'shipping',
    title: 'Shipping Manifest',
    description: 'File type description goes here...',
  },
  CLN: {
    icon: 'hospital',
    title: 'Clinical/Phenotype Data',
    description: 'File type description goes here...',
  },
  SEQ: {
    icon: 'dna',
    title: 'Sequencing Manifest',
    description: 'File type description goes here...',
  },
  OTH: {
    icon: 'question',
    title: 'Other',
    description: 'File type description goes here...',
  },
};

// Store version state title and color
export const versionState = {
  PEN: {title: 'Pending review', labelColor: 'orange'},
  APP: {title: 'Approved', labelColor: 'teal'},
  CHN: {title: 'Changes needed', labelColor: 'red'},
  PRC: {title: 'Processed', labelColor: 'blue'},
};

// Sort file versions based on the version createdAt date (Latest first)
export const fileSortedVersions = fileNode => {
  if (fileNode && fileNode.versions && fileNode.versions.edges.length > 0) {
    return fileNode.versions.edges.sort(dateCompare);
  } else return [];
};

// Get the file modified date from the latest version of the file
export const fileLatestDate = sortedVersions => {
  if (sortedVersions.length > 0) {
    return sortedVersions[0].node.createdAt;
  } else {
    return null;
  }
};

// Get the file created date from the oldest version of the file
export const fileOldestDate = sortedVersions => {
  if (sortedVersions.length > 0) {
    return sortedVersions.reverse()[0].node.createdAt;
  } else {
    return null;
  }
};

// Get the file size from the latest version of the file
export const fileLatestSize = sortedVersions => {
  if (sortedVersions.length > 0) {
    return formatFileSize(sortedVersions[0].node.size, true);
  } else {
    return 'unknown';
  }
};

// Get the file status from the latest version of the file
export const fileLatestStatus = fileNode => {
  const sortedVersions = fileSortedVersions(fileNode);
  const versionStatus =
    sortedVersions.length > 0 ? sortedVersions[0].node.state : null;
  return versionStatus;
};

// Limit the length of text and add '...' at the end
export const lengthLimit = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
};
