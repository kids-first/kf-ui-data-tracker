

/* @flow */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllStudies
// ====================================================

export type AllStudies_allStudies_edges_node = {
  __typename: "StudyNode",
  /**
   * The ID of the object.
   */
  id: string,
  /**
   * The Kids First Identifier
   */
  kfId: string,
  /**
   * The name of the study
   */
  name: string,
};

export type AllStudies_allStudies_edges = {
  __typename: "StudyNodeEdge",
  /**
   * The item at the end of the edge
   */
  node: ?AllStudies_allStudies_edges_node,
};

export type AllStudies_allStudies = {
  __typename: "StudyNodeConnection",
  edges: Array<?AllStudies_allStudies_edges>,
};

export type AllStudies = {
  allStudies: ?AllStudies_allStudies
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