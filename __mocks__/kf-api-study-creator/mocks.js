import allStudies from './responses/allStudies';
import studyByKfId from './responses/studyByKfId.json';
import deleteFile from './responses/deleteFile.json';
import fileByKfId from './responses/fileByKfId.json';
import myProfile from './responses/myProfile.json';
import {
  ALL_STUDIES,
  GET_STUDY_BY_ID,
  GET_DEV_TOKENS,
  MY_PROFILE,
  ALL_EVENTS,
  ALL_USERS,
  GET_PROJECTS,
} from '../../src/state/queries';
import {
  CREATE_PROJECT,
  SYNC_PROJECTS,
  CREATE_STUDY,
  UPDATE_STUDY,
} from '../../src/state/mutations';
import {GET_FILE_BY_ID} from '../../src/documents/queries';
import updateFile from './responses/updateFile.json';
import updateVersion from './responses/updateVersion.json';
import createVersion from './responses/createVersion.json';
import createStudy from './responses/createStudy.json';
import updateStudy from './responses/updateStudy.json';
import devTokens from './responses/devTokens.json';
import createDevToken from './responses/createDevToken.json';
import allEvents from './responses/allEvents.json';
import allUsers from './responses/allUsers.json';
import allProjects from './responses/allProjects.json';
import syncProjects from './responses/syncProjects.json';
import {
  DELETE_FILE,
  UPDATE_FILE,
  UPDATE_VERSION,
  CREATE_VERSION,
  CREATE_DEV_TOKEN,
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
  {
    request: {
      query: GET_DEV_TOKENS,
    },
    result: devTokens,
  },
  {
    request: {
      query: GET_DEV_TOKENS,
      variables: {
        name: 'my token 4',
      },
    },
    result: createDevToken,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_8WX8QQ06',
        orderBy: '-created_at',
      },
    },
    result: allEvents,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_8WX8QQ06',
        orderBy: '-created_at',
      },
    },
    error: new Error('something went wrong with your event logs request'),
  },
  {
    request: {
      query: ALL_USERS,
    },
    result: allUsers,
  },
  {
    request: {
      query: MY_PROFILE,
    },
    error: new Error('Failed to get user profile information'),
  },
  {
    request: {
      query: GET_PROJECTS,
      variables: {
        study: '',
        deleted: false,
      },
    },
    result: allProjects,
  },
  {
    request: {
      query: GET_PROJECTS,
      variables: {
        study: '',
        deleted: false,
      },
    },
    error: new Error('Failed to get the Cavatica project data for this study'),
  },
  {
    request: {
      query: GET_PROJECTS,
      variables: {
        study: null,
        deleted: null,
      },
    },
    result: allProjects,
  },
  {
    request: {
      query: GET_PROJECTS,
      variables: {},
    },
    result: allProjects,
  },
  {
    request: {
      query: SYNC_PROJECTS,
    },
    result: syncProjects,
  },
  {
    request: {
      query: SYNC_PROJECTS,
    },
    error: new Error('Failed to sync Cavatica projects'),
  },
  {
    request: {
      query: CREATE_STUDY,
      variables: {
        workflows: ['bwa_mem', 'gatk_haplotypecaller'],
        input: {
          externalId: 'benchmark extensible e-business',
          name: 'benchmark extensible e-business',
          shortName: '',
          description: '',
          releaseDate: null,
          version: '',
          attribution: '',
          anticipatedSamples: 0,
          awardeeOrganization: '',
        },
      },
    },
    result: createStudy,
  },
  {
    request: {
      query: CREATE_STUDY,
      variables: {
        workflows: ['bwa_mem', 'gatk_haplotypecaller'],
        input: {
          externalId: 'benchmark extensible e-business',
          name: 'benchmark extensible e-business',
          shortName: '',
          description: '',
          releaseDate: null,
          version: '',
          attribution: '',
          anticipatedSamples: 0,
          awardeeOrganization: '',
        },
      },
    },
    error: new Error('Failed to create the new study'),
  },
  {
    request: {
      query: UPDATE_STUDY,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
        input: {
          externalId: 'test_study_external_id',
          name: 'benchmark extensible e-business',
          shortName: '',
          description:
            'Sudy description in markdown, commonly the X01 abstract text. --  As test study description',
          releaseDate: '2019-08-24',
          anticipatedSamples: 100,
          awardeeOrganization: 'CHOP',
          attribution: '',
          version: '',
          bucket: 'stay-wrong-ready',
        },
      },
    },
    result: updateStudy,
  },
  {
    request: {
      query: UPDATE_STUDY,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
        input: {
          externalId: 'test_study_external_id',
          name: 'benchmark extensible e-business',
          shortName: '',
          description:
            'Sudy description in markdown, commonly the X01 abstract text. --  As test study description',
          releaseDate: '2019-08-24',
          anticipatedSamples: 100,
          awardeeOrganization: 'CHOP',
          attribution: '',
          version: '',
          bucket: 'stay-wrong-ready',
        },
      },
    },
    error: new Error('Failed to update the study'),
  },
];
