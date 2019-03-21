import React from 'react';
import {Query} from 'react-apollo';

import {GET_STUDY_BY_ID} from '../state/queries';
import {LoadingPlaceholder} from '../components/Loading';
import {GridContainer} from '../components/Grid';
import {UploadContainer} from '../containers';
import StudyHeader from '../components/StudyHeader/StudyHeader';

const FileUploadView = props => (
  <Query query={GET_STUDY_BY_ID} variables={{kfId: props.match.params.kfId}}>
    {({loading, error, data}) => {
      if (loading) return <LoadingPlaceholder />;
      if (error) return `Error!: ${error}`;

      const study = data.studyByKfId;
      const files = data.studyByKfId.files.edges;
      return (
        <div id="study" className="bg-lightGrey">
          <StudyHeader {...study} />
          <div className="study-content bg-white">
            <GridContainer>
              <h3 className="col-12">
                Upload Study Files & Manifests for DRC Approval
              </h3>
              <section className="study-file-list col-12">
                <ul className="w-full list-reset">
                  {files.length
                    ? files.map(({node: {id, name, downloadUrl}}) => (
                        <li key={id}>
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {name}
                          </a>
                        </li>
                      ))
                    : null}
                </ul>

                <UploadContainer />
              </section>
            </GridContainer>
          </div>
        </div>
      );
    }}
  </Query>
);

export default FileUploadView;
