import React from 'react';
import FileEditorContainer from '../containers/FileEditorContainer';

const AnnotationView = ({match}) => {
  // The kf_id of the file
  const fileId = match.params.fileId;
  return (
    <div className="sm:px-20 p-2 BodyContent">
      <h3 className="text-blue font-normal my-16">Tell us about your files</h3>
      <p className="pb-20">
        Help ensure the fastest processing and harmonization of your study by
        telling us about the contents of your uploaded files. This helps our
        engineers accurately interpret your data.
      </p>
      <section className="study-file-list">
        <FileEditorContainer kfId={fileId} />
      </section>
    </div>
  );
};

export default AnnotationView;
