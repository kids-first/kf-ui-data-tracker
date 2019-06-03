import React, {Fragment} from 'react';
import FileEditorContainer from '../containers/FileEditorContainer';
import {GridContainer} from 'kf-uikit';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {Button} from 'kf-uikit';

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
        <FileEditorContainer kfId={fileId}>
          {({
            updateFile,
            fileByKfId,
            fileNameInput,
            fileType,
            selectFileType,
            onSubmit,
            setFileName,
            setFileDescription,
          }) => (
            <FileEditor
              showStatus
              kfId={fileByKfId.kfId}
              name={fileNameInput}
              description={fileByKfId.description}
              fileType={fileType}
              selectFileType={selectFileType}
              onSubmit={e => onSubmit(e, updateFile)}
              onNameChange={e => setFileName(e.target.value)}
              onDescriptionChange={e => setFileDescription(e.target.value)}
              renderButtons={history => (
                <Fragment>
                  <Button
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" className="ml-12">
                    Annotate File
                  </Button>
                </Fragment>
              )}
            />
          )}
        </FileEditorContainer>
      </section>
    </GridContainer>
  );
};

export default AnnotationView;
