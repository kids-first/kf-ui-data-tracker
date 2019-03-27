import React from 'react';
import FileEditorContainer from '../containers/FileEditorContainer';
import {GridContainer} from '../components/Grid';

const AnnotationView = ({match}) => {
  // The kf_id of the file
  const fileId = match.params.fileId;
  return (
    <GridContainer>
      <h3 className="col-12 text-blue font-normal">Tell us about your files</h3>
      <h4 className="col-12 font-normal mt-0 text-darkGrey">
        Help ensure the fastest processing and harmonization of your study by
        telling us about the contents of your uploaded files. This helps our
        engineers accurately interpret your data.
      </h4>
      <section className="study-file-list col-12">
        <FileEditorContainer kfId={fileId} />
      </section>
    </GridContainer>
  );
};

export default AnnotationView;
