// TODO: add doc blocks
import {KF_STUDY_API} from './globals';

export const dateCompare = (version1, version2) => {
  return new Date(version2.node.createdAt) - new Date(version1.node.createdAt);
};

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

export const fileTypeDetail = {
  SHM: {icon: 'release', title: 'Shipping Manifest'},
  CLN: {icon: 'biospecimen', title: 'Clinical/Phenotype Data'},
  SEQ: {icon: 'customize', title: 'Sequencing Manifest'},
  OTH: {icon: 'settings', title: 'Other'},
};
