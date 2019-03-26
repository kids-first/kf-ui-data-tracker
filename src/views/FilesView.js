import React from 'react';
import {Link} from 'react-router-dom';
import {Query} from 'react-apollo';

import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import {GridContainer} from '../components/Grid';
import {UploadContainer} from '../containers';

const FileUploadView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder componentName="File List" />;
      if (error) return `Error!: ${error}`;

      const files = data.studyByKfId.files.edges;
      return (
        <GridContainer>
          <h3 className="col-12">
            Upload Study Files & Manifests for DRC Approval
          </h3>
          <section className="study-file-list col-12">
            <ul className="w-full list-reset">
              {files.length
                ? files.map(
                    ({node: {kfId, name, description, downloadUrl}}) => (
                      <li key={kfId}>
                        <Link
                          to={`/study/${props.match.params.kfId}/files/${kfId}`}
                        >
                          Edit
                        </Link>
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {name}
                        </a>
                        {name}
                        {description}
                      </li>
                    ),
                  )
                : null}
            </ul>
            <UploadContainer />
          </section>
        </GridContainer>
      );
    }}
  </Query>
);

export default FileUploadView;
