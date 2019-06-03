import React from 'react';
import FileEditorContainer from '../../containers/FileEditorContainer';
import FileEditor from '../FileAnnotation/FileEditor';
import Modal from '../Modal/Modal';

const AnnotateVersionModalContainer = ({
  kfId,
  additionalContent,
  onCloseDialog,
}) => {
  return (
    <FileEditorContainer kfId={kfId}>
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
        <Modal
          title="EDIT FILE INFO"
          onSubmit={e => onSubmit(e, updateFile, onCloseDialog)}
          onCloseModal={onCloseDialog}
        >
          <p className="font-title mt-0">
            Help ensure the fastest processing and harmonization of your study
            file by telling us about its contents. This helps our engineers
            accurately interpret your data.
          </p>
          <div className="FileDialog--Edit">
            <FileEditor
              kfId={fileByKfId.kfId}
              name={fileNameInput}
              description={fileByKfId.description}
              fileType={fileType}
              selectFileType={selectFileType}
              onNameChange={e => setFileName(e.target.value)}
              onDescriptionChange={e => setFileDescription(e.target.value)}
            />
          </div>
          {additionalContent && additionalContent()}
        </Modal>
      )}
    </FileEditorContainer>
  );
};

export default AnnotateVersionModalContainer;
