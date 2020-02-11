import {GET_STUDY_RELEASES, GET_RELEASED_STUDY} from '../../src/state/queries';
import getStudyReleases from './responses/getStudyReleases.json';
import getStudyReleasesEmpty from './responses/getStudyReleasesEmpty.json';
import allReleaseStudies from './responses/allReleaseStudies.json';

export const coordMocks = {
  getStudyReleases: {
    request: {
      query: GET_STUDY_RELEASES,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
      },
    },
    result: getStudyReleases,
  },
  getStudyReleasesError: {
    request: {
      query: GET_STUDY_RELEASES,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
      },
    },
    error: new Error('Failed to fetch releases information'),
  },
  getStudyReleasesEmpty: {
    request: {
      query: GET_STUDY_RELEASES,
      variables: {
        id: 'U3R1ZHlOb2RlOlNEXzhXWDhRUTA2',
      },
    },
    result: getStudyReleasesEmpty,
  },
  allReleaseStudies: {
    request: {
      query: GET_RELEASED_STUDY,
    },
    result: allReleaseStudies,
  },
  allReleaseStudiesError: {
    request: {
      query: GET_RELEASED_STUDY,
    },
    error: new Error('Failed to fetch study releases information'),
  },
};
