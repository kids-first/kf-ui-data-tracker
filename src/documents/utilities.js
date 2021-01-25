import {KF_STUDY_API} from '../common/globals';
import * as stringSimilarity from 'string-similarity';

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
    window.open(url, '_blank');
  });
};

// Sort file versions based on the version createdAt date (Latest first)
export const fileSortedVersions = fileNode => {
  if (fileNode && fileNode.versions && fileNode.versions.edges.length > 0) {
    return [...fileNode.versions.edges].sort(dateCompare);
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

// Sort files by created date
export const createDateSort = (a, b) => {
  return Date.parse(fileOldestDate(fileSortedVersions(a.node))) >
    Date.parse(fileOldestDate(fileSortedVersions(b.node)))
    ? 1
    : Date.parse(fileOldestDate(fileSortedVersions(b.node))) >
      Date.parse(fileOldestDate(fileSortedVersions(a.node)))
    ? -1
    : 0;
};

// Sort files by modified date
export const modifiedDateSort = (a, b) => {
  return Date.parse(fileLatestDate(fileSortedVersions(a.node))) >
    Date.parse(fileLatestDate(fileSortedVersions(b.node)))
    ? 1
    : Date.parse(fileLatestDate(fileSortedVersions(b.node))) >
      Date.parse(fileLatestDate(fileSortedVersions(a.node)))
    ? -1
    : 0;
};

// Default sorting by brining "Changes Needed" files to the top
export const defaultSort = (a, b) => {
  return fileLatestStatus(a.node) !== 'CHN' &&
    fileLatestStatus(b.node) === 'CHN'
    ? 1
    : fileLatestStatus(b.node) !== 'CHN' && fileLatestStatus(a.node) === 'CHN'
    ? -1
    : 0;
};

// sort list of file nodes by string similarity to file name
export const sortFilesBySimilarity = (file, fileList, threshold = 0.9) => {
  if (!fileList.length) return false;

  const sortByRating = files =>
    files.sort((a, b) => (a.rating > b.rating ? 1 : -1)).reverse();

  // find bestMatches for filename's similar to the uploaded document
  const fileMatches = stringSimilarity.findBestMatch(
    file.name || '',
    fileList.length ? fileList.map(x => x.node.name) : [],
  );
  // sort bestMatches by rating descending
  const similarDocuments = fileMatches.ratings.filter(
    f => f.rating > threshold,
  );

  const sameDocuments = fileMatches.ratings.filter(f => f.rating === 1);

  const updateDocumentsList = fileList.map(({node}) => ({
    rating: fileMatches.ratings.filter(({target}) => target === node.name)[0]
      .rating,
    ...node,
  }));

  return {
    exact_matches: sameDocuments,
    best_match: fileMatches.bestMatch,
    matches: sortByRating(similarDocuments),
    ranked_files: sortByRating(updateDocumentsList),
  };
};
