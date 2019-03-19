// @flow
import React from "react";
import { graphql, OperationComponent } from "react-apollo";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import { ALL_STUDIES_QUERY } from "../state/nodes";
import type { AllStudies as AllStudiesType } from "../state/nodes";
import StudyCard from "../components/StudyCard";
import { renderWhileLoading, LoadingPlaceholder } from "../components/Loading";

const StudyListView = ({
  studies: {
    loading,
    allStudies: { edges }
  }
}) => {
  return (
    <ul className="study-list grid-container list-reset">
      {edges.map(node => (
        <li className="col-3 study-list--item" key={node.node.id}>
          <Link to={`/study/${node.node.id}/files`}>
            <StudyCard title={node.node.name}>{node.node.id}</StudyCard>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const withAllStudiesData: OperationComponent<AllStudiesType> = graphql(
  ALL_STUDIES_QUERY,
  { name: "studies" }
);

export default compose(
  withAllStudiesData,
  renderWhileLoading(LoadingPlaceholder, "studies")
)(StudyListView);
