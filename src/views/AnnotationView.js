import React from 'react';
import FileEditorContainer from '../containers/FileEditorContainer';
import {GridContainer} from 'kf-uikit';

const AnnotationView = ({match}) => {
  // The kf_id of the file
  const fileId = match.params.fileId;
  return (
    <GridContainer collapsed="cells" className="my-20 px-12">
      <h3 className="text-blue font-normal m-0 cell-12 row-1">
        Tell us about your files
      </h3>
      <p className="m-0 cell-12 md:cell-8 row-2">
        Help ensure the fastest processing and harmonization of your study by
        telling us about the contents of your uploaded files. This helps our
        engineers accurately interpret your data.
      </p>
      <section className="study-file-list cell-12 row-3">
        <FileEditorContainer kfId={fileId} />
      </section>
    </GridContainer>
  );
};

export default AnnotationView;
