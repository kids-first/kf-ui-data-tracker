import React from 'react';
import PrivateRoute from '../routes/PrivateRoute';
import {StudyFilesListView, FileDetailView, UploadView} from './views';

const DocumentRoutes = () => (
  <>
    <PrivateRoute
      exact
      path="/study/:kfId/documents"
      component={StudyFilesListView}
    />
    <PrivateRoute path="/study/:kfId/documents/upload" component={UploadView} />
    <PrivateRoute
      exact
      path="/study/:kfId/documents/:fileId(SF_\w{8})"
      component={FileDetailView}
    />
  </>
);

export default DocumentRoutes;
