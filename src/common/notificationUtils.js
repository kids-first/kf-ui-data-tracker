import {fileLatestStatus} from '../documents/utilities';

// An object contains the label for each study data field
export const fieldLabel = {
  externalId: 'External ID',
  name: 'Study Name',
  shortName: 'Study Short Name',
  description: 'Description',
  releaseDate: 'Release Date',
  anticipatedSamples: 'Number of anticipated samples',
  awardeeOrganization: 'Awardee organization',
  attribution: 'Attribution',
  version: 'dbGaP Version',
  bucket: 'S3 Bucket',
  workflowType: 'Cavatica Projects',
};

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

// A list of research study field that are tracked for completemess for ADMIN
export const trackedResearchStudyFields = ['name', 'shortName', 'description'];

// A list of study fields for each step to display as study basic info
export const steppingFields = [
  ['name', 'shortName', 'bucket'],
  ['externalId', 'version', 'attribution'],
  ['releaseDate', 'anticipatedSamples', 'awardeeOrganization', 'description'],
];

// Count the missing fields for a given study and return the notification number
export const countStudyNotification = (study, isResearch) => {
  var counts = 0;
  if (isResearch) {
    trackedResearchStudyFields.map(field => {
      if (!study[field] || study[field].length === 0 || study[field] === 0) {
        counts += 1;
      }
      return counts;
    });
  } else {
    trackedStudyFields.map(field => {
      if (!study[field] || study[field].length === 0 || study[field] === 0) {
        counts += 1;
      }
      return counts;
    });
  }
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

// Controlling the previous/next steps in study info page
export const prevNextStep = (stepName, newStudy, history) => {
  if (newStudy) {
    history.push('/study/new-study/' + stepName);
  } else {
    history.push(
      '/study/' +
        history.location.pathname.split('/')[2] +
        '/basic-info/' +
        stepName,
    );
  }
};

/**
 * Return true for false to determin if current field is on tracking
 * - Only tracking for ADMIN
 * - Only tracking the fields listed in trackedStudyFields
 * - Only return true when field has no value
 */
export const noValueWarning = (id, value) => {
  return (
    trackedStudyFields.includes(id) &&
    (value === null || value === 0 || value.length === 0)
  );
};

// Check and display use first name and last name or username
export const showuUserName = user => {
  const userName = user && user.username ? user.username : 'Unknown user';
  const userFullName =
    user && (user.firstName || user.lastName)
      ? (user.firstName ? user.firstName + ' ' : '') +
        (user.lastName ? user.lastName : '')
      : userName;
  return userFullName;
};
