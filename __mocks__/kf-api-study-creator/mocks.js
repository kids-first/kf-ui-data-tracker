import allStudies from './responses/allStudies';
import studyByKfId from './responses/studyByKfId.json';
import deleteFile from './responses/deleteFile.json';
import fileByKfId from './responses/fileByKfId.json';
import myProfile from './responses/myProfile.json';
import {
  ALL_STUDIES,
  GET_STUDY_BY_ID,
  MY_PROFILE,
} from '../../src/state/queries';
import {GET_FILE_BY_ID} from '../../src/documents/queries';
import updateFile from './responses/updateFile.json';
import updateVersion from './responses/updateVersion.json';
import createVersion from './responses/createVersion.json';
import {
  DELETE_FILE,
  UPDATE_FILE,
  UPDATE_VERSION,
  CREATE_VERSION,
} from '../../src/documents/mutations';

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
        name: 'foo bar file',
        description: 'Some description here',
        fileType: 'CLN',
      },
    },
    result: updateFile,
  },
  {
    request: {
      query: UPDATE_VERSION,
      variables: {
        versionId: 'FV_DMTKEFQW',
        description: 'version description',
        state: 'APP',
      },
    },
    result: updateVersion,
  },

  {
    request: {
      query: CREATE_VERSION,
      variables: {
        file: {
          lastModified: 1567797130510,
          name: 'organize.tsv',
          size: 7,
          type: 'text/tab-separated-values',
          webkitRelativePath: '',
        },
        fileId: 'SF_5ZPEM167',
        description: 'version description',
      },
    },
    result: createVersion,
  },
  {
    request: {
      query: MY_PROFILE,
    },
    result: myProfile,
  },
];
