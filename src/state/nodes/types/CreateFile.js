

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFile
// ====================================================

export type CreateFile_createFile_file = {
  __typename: "FileNode",
  /**
   * The ID of the object.
   */
  id: string,
  name: string,
  downloadUrl: ?string,
};

export type CreateFile_createFile = {
  __typename: "UploadMutation",
  success: ?boolean,
  file: ?CreateFile_createFile_file,
};

export type CreateFile = {
  createFile: ?CreateFile_createFile
};

export type CreateFileVariables = {
  file: any,
  studyId: string,
};

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================