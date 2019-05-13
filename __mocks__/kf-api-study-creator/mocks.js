import allStudies from './responses/allStudies';
import studyByKfId from './responses/studyByKfId.json';
import deleteFile from './responses/deleteFile.json';
import fileByKfId from './responses/fileByKfId.json';
import {
  ALL_STUDIES,
  GET_STUDY_BY_ID,
  GET_FILE_BY_ID,
} from '../../src/state/queries';
import updateFile from './responses/updateFile.json';
import {DELETE_FILE, UPDATE_FILE} from '../../src/state/mutations';

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
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_8WX8QQ06',
      },
    },
    error: new Error('something went wrong'),
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
  {
    request: {
      query: GET_FILE_BY_ID,
      variables: {
        kfId: 'SF_5ZPEM167',
      },
    },
    result: fileByKfId,
  },
  {
    request: {
      query: UPDATE_FILE,
      variables: {
        kfId: 'SF_5ZPEM167',
        name: 'mynewfile.txt',
        description: 'Some description here',
        fileType: 'CLN',
      },
    },
    result: updateFile,
  },
];
