import allStudies from './responses/allStudies';
import studyByKfId from './responses/studyByKfId.json';
import deleteFile from './responses/deleteFile.json';
import {ALL_STUDIES, GET_STUDY_BY_ID} from '../../src/state/queries';
import {DELETE_FILE} from '../../src/state/mutations';

export const mocks = [
  {
    request: {
      query: ALL_STUDIES,
    },
    result: allStudies,
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_8WX8QQ06',
      },
    },
    result: studyByKfId,
  },
  {
    request: {
      query: DELETE_FILE,
      variables: {
        kfId: 'SF_Y07IN1HO',
      },
    },
    result: deleteFile,
  },
];
