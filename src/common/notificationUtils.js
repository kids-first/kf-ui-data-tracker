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
