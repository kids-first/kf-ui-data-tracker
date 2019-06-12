import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import {GridContainer} from 'kf-uikit';
import {NewDocumentForm} from '../forms';
import {CREATE_FILE} from '../state/mutations';
import {GET_STUDY_BY_ID} from '../state/queries';

/**
 * The NewDocumentView displays a form to collect details about a new file.
 * It expects that the user lands on the page after being forwarded from a
 * file browser dialog and a file present in `location.state.file` as
 * populated by the router (eg: history.push('/new', {state: <File>}) )
 */
const NewDocumentView = ({match, history, location, createDocument}) => {
  // Tracks any error state reported from the server
  const [errors, setErrors] = useState();

  // If the user landed here without a file, they probably got here from
  // some external page. We'll send them back to the study's file list view.
  if (!location.state || !location.state.file) {
    history.push(`/study/${match.params.kfId}/documents`);
  }
  const handleSubmit = (fileName, fileType, fileDescription) => {
    const studyId = match.params.kfId;
    const file = location.state.file;
    createDocument({
      variables: {
        file,
        studyId,
        name: fileName,
        fileType,
        description: fileDescription,
      },
    })
      .then(resp => {
        history.push(`/study/${studyId}/documents`);
      })
      .catch(err => {
        setErrors(err.message);
      });
  };

  return (
    <GridContainer collapsed={true} className="my-20 px-12">
      <h3 className="text-blue font-normal m-0 cell-12 row-1">
        Tell us about your study document
      </h3>
      <p className="m-0 cell-12 md:cell-8 row-2">
        Help ensure the fastest processing and harmonization of your study by
        telling us about the contents of your uploaded document. This helps our
        engineers accurately interpret your data.
      </p>
      <div className="row-3 cell-3 py-12 Form--Header text-right">
        Uploaded File:
      </div>
      <div className="row-3 cell-9 py-12 Form--Header pl-32">
        {location.state.file.name}
      </div>
      <section className="study-file-list cell-12 row-4">
        <NewDocumentForm
          handleSubmit={handleSubmit}
          handleCancel={() =>
            history.push(`/study/${match.params.kfId}/documents`)
          }
          errors={errors}
        />
      </section>
    </GridContainer>
  );
};

export default graphql(CREATE_FILE, {
  name: 'createDocument',
  options: ({match}) => ({
    awaitRefetchQueries: true,
    refetchQueries: [
      {query: GET_STUDY_BY_ID, variables: {kfId: match.params.kfId}},
    ],
  }),
})(NewDocumentView);
