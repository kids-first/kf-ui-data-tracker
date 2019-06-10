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
    icon: 'box',
    title: 'Shipping Manifest',
    description: 'File type description gose here...',
  },
  CLN: {
    icon: 'clinical',
    title: 'Clinical/Phenotype Data',
    description: 'File type description gose here...',
  },
  SEQ: {
    icon: 'misc',
    title: 'Sequencing Manifest',
    description: 'File type description gose here...',
  },
  OTH: {
    icon: 'sequencing',
    title: 'Other',
    description: 'File type description gose here...',
  },
};

// Store version state title and color
export const versionState = {
  PEN: {color: 'bg-orange', title: 'Pending Review'},
  APP: {color: 'bg-teal', title: 'Approved'},
  CHN: {color: 'bg-red', title: 'Changes Needed'},
  PRC: {color: 'bg-blue', title: 'Processed'},
};

// Sort file versions based on the version createdAt date (Latest first)
export const fileSortedVersions = fileNode => {
  if (fileNode && fileNode.versions && fileNode.versions.edges.length > 0) {
    return fileNode.versions.edges.sort(dateCompare);
  } else return [];
};

// Get the lastest date from the latest version of the file
export const fileLatestDate = sortedVersions => {
  if (sortedVersions.length > 0) {
    return sortedVersions[0].node.createdAt;
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
