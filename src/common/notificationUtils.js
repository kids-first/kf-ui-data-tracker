import {fileLatestStatus} from './fileUtils';

// A list of study field that are tracked for completemess for ADMIN
export const trackedStudyFields = [
  'name',
  'shortName',
  'bucket',
  'externalId',
  'releaseDate',
  'anticipatedSamples',
  'awardeeOrganization',
  'description',
];

// A list of study fields for each step to display as study basic info
export const steppingFields = [
  ['name', 'shortName', 'bucket'],
  ['externalId', 'version', 'attribution'],
  ['releaseDate', 'anticipatedSamples', 'awardeeOrganization', 'description'],
];

// Count the missing fields for a given study and return the notification number
export const countStudyNotification = study => {
  var counts = 0;
  trackedStudyFields.map(field => {
    if (!study[field] || study[field].length === 0 || study[field] === 0) {
      counts += 1;
    }
    return counts;
  });
  return counts;
};

// Count the missing projects for a given study and return the notification number
export const countProjectNotification = study => {
  var counts = 0;
  if (
    study.projects.edges.filter(obj => obj.node.projectType === 'HAR')
      .length === 0
  ) {
    counts += 1;
  }
  if (
    study.projects.edges.filter(obj => obj.node.projectType === 'DEL')
      .length === 0
  ) {
    counts += 1;
  }
  return counts;
};

// Count the number of "changes needed" files for a given study and return the notification number
export const countFileNotification = study => {
  var counts = 0;
  counts = study.files.edges.filter(obj => fileLatestStatus(obj.node) === 'CHN')
    .length;
  return counts;
};
