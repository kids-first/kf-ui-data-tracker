import React from 'react';
import PrivateRoute from '../Routes/PrivateRoute';
import {StudyFilesListView, FileDetailView, NewDocumentView} from './views';

const DocumentRoutes = () => (
  <>
    <PrivateRoute
      exact
      path="/study/:kfId/documents"
      component={StudyFilesListView}
    />
    <PrivateRoute
      path="/study/:kfId/documents/new-document"
      component={NewDocumentView}
    />
    <PrivateRoute
      exact
      path="/study/:kfId/documents/:fileId(SF_\w{8})"
      component={FileDetailView}
    />
  </>
);

export default DocumentRoutes;
