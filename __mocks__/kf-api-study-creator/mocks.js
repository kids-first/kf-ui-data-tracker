import {
  ALL_STUDIES,
  GET_STUDY_BY_ID,
  MY_PROFILE,
  ALL_EVENTS,
  ALL_USERS,
  GET_PROJECTS,
  STATUS,
} from '../../src/state/queries';
import {
  CREATE_PROJECT,
  SYNC_PROJECTS,
  CREATE_STUDY,
  UPDATE_STUDY,
} from '../../src/state/mutations';
import {GET_FILE_BY_ID} from '../../src/documents/queries';
import {
  CREATE_FILE,
  DELETE_FILE,
  UPDATE_FILE,
  UPDATE_VERSION,
  CREATE_VERSION,
  FILE_DOWNLOAD_URL,
} from '../../src/documents/mutations';
import {GET_DEV_TOKENS} from '../../src/admin/queries';
import {DELETE_DEV_TOKEN, CREATE_DEV_TOKEN} from '../../src/admin/mutations';
import allStudies from './responses/allStudies';
import allStudies_empty from './responses/allStudies_empty';
import studyByKfId from './responses/studyByKfId.json';
import studyByKfId_refetch from './responses/studyByKfId_refetch.json';
import studyByKfId_event_err from './responses/studyByKfId_event_err.json';
import studyByKfId_no_projects from './responses/studyByKfId_no_projects.json';
import studyByKfId_empty from './responses/studyByKfId_empty.json';
import studyByKfId_pagination from './responses/studyByKfId_pagination.json';
import deleteFile from './responses/deleteFile.json';
import fileByKfId from './responses/fileByKfId.json';
import fileByKfId_empty from './responses/fileByKfId_empty.json';
import fileByKfId_init_desc from './responses/fileByKfId_init_desc.json';
import fileByKfId_update_desc from './responses/fileByKfId_update_desc.json';
import myProfile from './responses/myProfile.json';
import createFile from './responses/createFile.json';
import updateFile from './responses/updateFile.json';
import updateFile_desc from './responses/updateFile_desc.json';
import updateVersion from './responses/updateVersion.json';
import createVersion from './responses/createVersion.json';
import createStudy from './responses/createStudy.json';
import updateStudy from './responses/updateStudy.json';
import devTokens from './responses/devTokens.json';
import createDevToken from './responses/createDevToken.json';
import allEvents from './responses/allEvents.json';
import allEvents_refetch from './responses/allEvents_refetch.json';
import allEvents_20 from './responses/allEvents_20.json';
import allEvents_40 from './responses/allEvents_40.json';
import allUsers from './responses/allUsers.json';
import allProjects from './responses/allProjects.json';
import signedUrl from './responses/signedUrl.json';
import syncProjects from './responses/syncProjects.json';
import deleteToken from './responses/deleteToken.json';
import status from './responses/status.json';
import allEvents_studyCreation from './responses/allEvents_studyCreation.json';
import allEvents_studyCreation_err from './responses/allEvents_studyCreation_err.json';
import allEvents_studyCreation_ing from './responses/allEvents_studyCreation_ing.json';
import {GraphQLError} from 'graphql';

export const allStudiesMock = {
  request: {
    query: ALL_STUDIES,
  },
  result: allStudies,
};

export const myProfileMock = {
  request: {
    query: MY_PROFILE,
  },
  result: myProfile,
};

export const myProfileErrorMock = {
  request: {
    query: MY_PROFILE,
  },
  result: new Error('User not found'),
};

export const statusMock = {
  request: {
    query: STATUS,
  },
  result: status,
};

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
        description:
          '| Tables | Are | Cool | |----------|:-------------:|------:| | col 1 is | left-aligned | $1600 | | col 2 is | centered | $12 | | col 3 is | right-aligned | $1 |\\s\\s\nMonth necessary animal end standard case. View system operation message decade. Actually sing because deal everything woman subject.\n',
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
      query: CREATE_DEV_TOKEN,
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
        first: 20,
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
        first: 20,
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
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        first: 20,
      },
    },
    result: allEvents,
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_8WX8QQ06',
      },
    },
    result: studyByKfId_refetch,
  },
  {
    request: {
      query: CREATE_VERSION,
      variables: {
        file: {},
        fileId: 'SF_5ZPEM167',
        description: 'my changes',
      },
    },
    result: createVersion,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        username: 'Justin Heath',
        first: 20,
      },
    },
    result: allEvents_refetch,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        username: 'Justin Heath',
        studyId: 'SD_SG5N41K8',
        first: 20,
      },
    },
    result: allEvents_refetch,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        username: 'Justin Heath',
        studyId: 'SD_SG5N41K8',
        eventType: 'FV_CRE',
        first: 20,
      },
    },
    result: allEvents_refetch,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        first: 20,
      },
    },
    error: new Error('Failed to fetch events information'),
  },
  {
    request: {
      query: FILE_DOWNLOAD_URL,
      variables: {
        studyId: 'SD_00000000',
        fileId: 'SF_5ZPEM167',
        versionId: 'FV_TT8NF09R',
      },
    },
    result: signedUrl,
  },
  {
    request: {
      query: GET_PROJECTS,
      variables: {},
    },
    error: new Error('Failed to fetch projects information'),
  },
  {
    request: {
      query: DELETE_DEV_TOKEN,
      variables: {
        name: 'my token 1',
      },
    },
    result: deleteToken,
  },
  {
    request: {
      query: CREATE_DEV_TOKEN,
      variables: {
        name: 'my token 4',
      },
    },
    error: new Error('Failed to create new token'),
  },
  {
    request: {
      query: GET_DEV_TOKENS,
    },
    error: new Error('Failed to fetch tokens information'),
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        studyId: 'SD_8WX8QQ06',
        eventType: 'FV_CRE',
        first: 20,
      },
    },
    result: allEvents_refetch,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        studyId: 'SD_8WX8QQ06',
      },
    },
    result: allEvents_studyCreation,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        studyId: 'SD_8WX8QQ06',
      },
    },
    result: allEvents_studyCreation_err,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        studyId: 'SD_8WX8QQ06',
      },
    },
    result: allEvents_studyCreation_ing,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_8WX8QQ06',
        orderBy: '-created_at',
      },
    },
    error: new Error('Failed to fetch events information'),
  },
  {
    request: {
      query: STATUS,
    },
    result: status,
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_8WX8QQ06',
      },
    },
    result: studyByKfId_event_err,
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_8WX8QQ06',
      },
    },
    result: studyByKfId_no_projects,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {orderBy: '-created_at', first: 20},
    },
    result: allEvents_20,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        orderBy: '-created_at',
        first: 20,
        cursor: 'YXJyYXljb25uZWN0aW9uOjE5',
      },
    },
    result: allEvents_40,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_8WX8QQ06',
        orderBy: '-created_at',
        first: 20,
      },
    },
    result: allEvents_20,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_8WX8QQ06',
        orderBy: '-created_at',
        first: 20,
        cursor: 'YXJyYXljb25uZWN0aW9uOjE5',
      },
    },
    result: allEvents_40,
  },
  {
    request: {
      query: ALL_STUDIES,
    },
    error: new Error('Failed to fetch study information'),
  },
  {
    request: {
      query: ALL_STUDIES,
    },
    result: allStudies_empty,
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_INVALID',
      },
    },
    result: studyByKfId_empty,
  },
  {
    request: {
      query: GET_FILE_BY_ID,
      variables: {
        kfId: 'SF_INVALIDS',
      },
    },
    result: fileByKfId_empty,
  },
  {
    request: {
      query: ALL_EVENTS,
      variables: {
        studyId: 'SD_INVALID',
        orderBy: '-created_at',
        first: 20,
      },
    },
    result: allEvents,
  },
  {
    request: {
      query: CREATE_STUDY,
      variables: {
        input: {
          name: 'benchmark extensible e-business',
          shortName: '',
          description: '',
          externalId: 'benchmark-extensible-e-business',
        },
        workflows: [],
      },
    },
    result: createStudy,
  },
  {
    request: {
      query: CREATE_STUDY,
      variables: {
        workflows: [],
        input: {
          externalId: 'benchmark-extensible-e-business',
          name: 'benchmark extensible e-business',
          shortName: '',
          description: '',
        },
      },
    },
    error: new Error('Failed to create the new research study'),
  },
  {
    request: {
      query: UPDATE_STUDY,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
        input: {
          name: 'benchmark extensible e-business',
          shortName: 'Test short name input on update',
          description:
            'Sudy description in markdown, commonly the X01 abstract text. --  As test study description',
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
          name: 'benchmark extensible e-business',
          shortName: '',
          description:
            'Sudy description in markdown, commonly the X01 abstract text. --  As test study description',
        },
      },
    },
    error: new Error('Failed to update the study'),
  },
  {
    request: {
      query: ALL_USERS,
    },
    error: new Error('Failed to fetch users information'),
  },
  {
    request: {
      query: CREATE_FILE,
      variables: {
        file: {
          lastModified: 1567797130510,
          name: 'organize.tsv',
          size: 7,
          type: 'text/tab-separated-values',
          webkitRelativePath: '',
        },
        studyId: 'SD_8WX8QQ06',
        name: 'name',
        fileType: 'SHM',
        description: 'description input addeddescription\n',
        tags: [],
      },
    },
    result: createFile,
  },
  {
    request: {
      query: CREATE_FILE,
      variables: {
        file: {
          lastModified: 1567797130510,
          name: 'organize.tsv',
          size: 7,
          type: 'text/tab-separated-values',
          webkitRelativePath: '',
        },
        studyId: 'SD_8WX8QQ06',
        name: 'name',
        fileType: 'SHM',
        description: '#description\n',
        tags: [],
      },
    },
    error: new Error('Failed to create the file'),
  },
  {
    request: {
      query: UPDATE_FILE,
      variables: {
        kfId: 'SF_5ZPEM167',
        fileType: 'CLN',
        tags: ['email'],
      },
    },
    result: updateFile,
  },
  {
    request: {
      query: UPDATE_FILE,
      variables: {
        kfId: 'SF_5ZPEM167',
        fileType: 'CLN',
        tags: [],
      },
    },
    result: {
      errors: [new GraphQLError('Failed to update the file tags')],
    },
  },
  {
    request: {
      query: UPDATE_FILE,
      variables: {
        kfId: 'SF_5ZPEM167',
        name: 'foo bar file',
        description:
          'Month necessary animal end standard case. View system operation message decade. Actually sing because deal everything woman subject.\n',
        fileType: 'CLN',
      },
    },
    result: updateFile,
  },
  {
    request: {
      query: GET_FILE_BY_ID,
      variables: {
        kfId: 'SF_Y07IN1HO',
      },
    },
    result: fileByKfId_init_desc,
  },
  {
    request: {
      query: UPDATE_FILE,
      variables: {
        kfId: 'SF_Y07IN1HO',
        fileType: 'SHM',
        description:
          '| Tables | Are | Cool | |----------|:-------------:|------:| | col 1 is | left-aligned | $1600 | | col 2 is | centered | $12 | | col 3 is | right-aligned | $1 |\\s\\s\nQuestion meeting move recognize.\n',
      },
    },
    result: updateFile_desc,
  },
  {
    request: {
      query: GET_FILE_BY_ID,
      variables: {
        kfId: 'SF_Y07IN1HO',
      },
    },
    result: fileByKfId_update_desc,
  },
  {
    request: {
      query: FILE_DOWNLOAD_URL,
      variables: {
        studyId: 'SD_8WX8QQ06',
        fileId: 'SF_Y07IN1HO',
        versionId: null,
      },
    },
    result: signedUrl,
  },
  {
    request: {
      query: FILE_DOWNLOAD_URL,
      variables: {
        studyId: 'SD_8WX8QQ06',
        fileId: 'SF_5ZPEM167',
        versionId: null,
      },
    },
    result: signedUrl,
  },
  {
    request: {
      query: GET_FILE_BY_ID,
      variables: {
        kfId: 'SF_5ZPEMOOO',
      },
    },
    error: new Error('Failed to get the file information'),
  },
  {
    request: {
      query: GET_STUDY_BY_ID,
      variables: {
        kfId: 'SD_X6E5KWM4',
      },
    },
    result: studyByKfId_pagination,
  },
];
