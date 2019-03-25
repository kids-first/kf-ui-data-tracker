import React from 'react';
import FileEditorContainer from '../containers/FileEditorContainer';

const AnnotationView = ({match}) => {
  // The kf_id of the file
  const fileId = match.params.fileId;
  return <FileEditorContainer kfId={fileId} />;
};

export default AnnotationView;
