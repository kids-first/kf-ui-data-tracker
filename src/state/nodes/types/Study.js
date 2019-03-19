

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Study
// ====================================================

export type Study_study_files_edges_node = {
  __typename: "FileNode",
  /**
   * The ID of the object.
   */
  id: string,
  name: string,
  downloadUrl: ?string,
};

export type Study_study_files_edges = {
  __typename: "FileNodeEdge",
  /**
   * The item at the end of the edge
   */
  node: ?Study_study_files_edges_node,
};

export type Study_study_files = {
  __typename: "FileNodeConnection",
  edges: Array<?Study_study_files_edges>,
};

export type Study_study = {
  __typename: "StudyNode",
  /**
   * The name of the study
   */
  name: string,
  /**
   * Short name for study
   */
  shortName: ?string,
  /**
   * The s3 bucket name
   */
  bucket: string,
  /**
   * The Kids First Identifier
   */
  kfId: string,
  /**
   * Time of last modification
   */
  modifiedAt: any,
  files: ?Study_study_files,
};

export type Study = {
  /**
   * The ID of the object
   */
  study: ?Study_study
};

export type StudyVariables = {
  id: string
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