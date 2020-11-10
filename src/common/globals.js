export const KF_STUDY_API = process.env.REACT_APP_STUDY_API;
export const PRIMARY_HOST = process.env.REACT_APP_PRIMARY_HOST;
export const REDIRECT_TO_PRIMARY =
  process.env.REACT_APP_REDIRECT_TO_PRIMARY === 'true';
export const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
export const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
export const auth0RedirectUri = process.env.REACT_APP_AUTH0_REDIRECT_URI;
export const auth0LogoutRedirectUri =
  process.env.REACT_APP_AUTH0_LOGOUT_REDIRECT_URI;
export const auth0Aud = process.env.REACT_APP_AUTH0_AUD;
export const AMPLITUDE_KEY = process.env.REACT_APP_AMPLITUDE_KEY;
export const STUDY_DOCS_SIMILARITY_THRESHOLD = 0.9;
export const DOC_TITLE_FILENAME_SIMILARITY_THRESHOLD = 0.9;
export const DEV_BAR = process.env.REACT_APP_DEV_BAR;

// The number of documents shown on one page in a study's documents tab
export const DOCS_PER_PAGE = 10;

// The number of studies shown on one page in study table
export const STUDIES_PER_PAGE = 10;
