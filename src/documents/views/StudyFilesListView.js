import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {FILE_DOWNLOAD_URL, UPDATE_FILE, DELETE_FILE} from '../mutations';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import {
  Grid,
  Message,
  Placeholder,
  Container,
  Segment,
  Button,
  Responsive,
  Header,
  Icon,
} from 'semantic-ui-react';
import UploadWizard from '../modals/UploadWizard/UploadWizard';
import NotFoundView from '../../views/NotFoundView';
import ListFilterBar from '../components/ListFilterBar/ListFilterBar';
import BatchActionBar from '../components/ListFilterBar/BatchActionBar';
import {createDateSort, modifiedDateSort} from '../utilities';
import {hasPermission} from '../../common/permissions';

/**
 * A place holder skeleton for a list of files
 */
const StudyListSkeleton = () => (
  <Grid divided="vertically">
    {[1, 2, 3].map(i => (
      <Grid.Row key={i}>
        <Grid.Column mobile={14} tablet={14} computer={15}>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="full" />
            </Placeholder.Header>
          </Placeholder>
        </Grid.Column>
        <Grid.Column mobile={2} tablet={2} computer={1}>
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        </Grid.Column>
      </Grid.Row>
    ))}
  </Grid>
);

const filterFiles = (fileList, filters) => {
  const sortFuncs = {
    createDate: createDateSort,
    modifyDate: modifiedDateSort,
    default: modifiedDateSort,
  };
  var sortedList = fileList.sort(
    sortFuncs[filters.sortMethod] || sortFuncs.default,
  );
  sortedList = sortedList.filter(obj =>
    obj.node.fileType.includes(filters.typeFilterStatus),
  );
  sortedList = sortedList.filter(obj =>
    obj.node.tags.join(',').includes(filters.tagFilterStatus),
  );
  sortedList = sortedList.filter(
    obj =>
      obj.node.name
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()) ||
      obj.node.description
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()),
  );
  return sortedList;
};

/**
 * List and manage files in a study and allow a user to upload more
 */
const StudyFilesListView = ({
  match: {
    params: {kfId},
  },
  history,
}) => {
  // Document mutations
  const [downloadFile] = useMutation(FILE_DOWNLOAD_URL);
  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [{query: GET_STUDY_BY_ID, variables: {kfId: kfId}}],
  });
  const [updateFile] = useMutation(UPDATE_FILE, {
    refetchQueries: [{query: GET_STUDY_BY_ID, variables: {kfId: kfId}}],
    onError: error => {
      setUpdateFileError(error);
    },
  });

  // Study query, includes documents
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: kfId,
    },
  });
  const studyByKfId = data && data.studyByKfId;
  // Query for user
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowView =
    myProfile &&
    (hasPermission(myProfile, 'view_my_study') ||
      hasPermission(myProfile, 'view_study'));
  const allowUpload = myProfile && hasPermission(myProfile, 'add_file');
  const allowDelete = myProfile && hasPermission(myProfile, 'delete_file');
  const allowEdit = myProfile && hasPermission(myProfile, 'change_file');

  const [dialog, setDialog] = useState(false);
  // View state
  const [uploadedFile, setFile] = useState(false);
  const [updateFileError, setUpdateFileError] = useState(null);
  const [filters, setFilters] = useState({
    sortMethod: '',
    sortDirection: 'ascending',
    typeFilterStatus: '',
    tagFilterStatus: '',
    searchString: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Computed state
  const files = !loading && studyByKfId ? studyByKfId.files.edges : [];
  const filteredFiles =
    filters.sortDirection === 'ascending'
      ? filterFiles(files, filters)
      : filterFiles(files, filters).reverse();

  if (!loading && studyByKfId === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${kfId}`}
      />
    );
  }
  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study documents - Error ${
              studyByKfId ? 'for ' + studyByKfId.kfId : null
            }`}
          </title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  return (
    <Grid as={Segment} basic container columns={1}>
      <Helmet>
        <title>
          {`KF Data Tracker - Study documents ${
            studyByKfId ? 'for ' + studyByKfId.name : null
          }`}
        </title>
      </Helmet>
      <Grid.Row>
        <Grid.Column width={10}>
          <h2>Study Documents</h2>
        </Grid.Column>
        {files.length > 0 && (
          <Grid.Column width={6}>
            <Button
              compact
              primary
              floated="right"
              size="large"
              icon="cloud upload"
              labelPosition="left"
              content="Upload Document"
              as="label"
              htmlFor="file"
            />
            <input
              hidden
              multiple
              id="file"
              type="file"
              onChange={e => {
                setFile(e.target.files[0]);
                setDialog(true);
              }}
            />
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          {files.length > 0 ? (
            <>
              {selectedFiles.length === 0 ? (
                <ListFilterBar
                  fileList={files}
                  filters={filters}
                  setFilters={setFilters}
                />
              ) : (
                <BatchActionBar
                  fileList={files}
                  studyId={kfId}
                  deleteFile={deleteFile}
                  downloadFileMutation={downloadFile}
                  selection={selectedFiles}
                  setSelection={setSelectedFiles}
                />
              )}
              <FileList
                fileList={filteredFiles}
                studyId={kfId}
                isAdmin={isAdmin}
                updateFile={updateFile}
                updateError={updateFileError}
                downloadFileMutation={downloadFile}
                deleteFile={deleteFile}
                selection={selectedFiles}
                setSelection={setSelectedFiles}
              />
            </>
          ) : (
            <>
              {loading ? (
                <StudyListSkeleton />
              ) : (
                <Segment basic>
                  <Header icon textAlign="center">
                    <Icon name="file alternate outline" />
                    You don't have any documents yet.
                  </Header>
                </Segment>
              )}
            </>
          )}
          {dialog && (
            <UploadWizard
              history={history}
              studyId={kfId}
              file={uploadedFile}
              fileList={files}
              onCloseDialog={() => {
                setFile(false);
                setDialog(false);
              }}
            />
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Responsive
          as={UploadContainer}
          minWidth={Responsive.onlyTablet.minWidth}
          handleUpload={file => {
            setFile(file);
            return !files.length
              ? history.push('documents/new-document', {file})
              : setDialog(true);
          }}
        />
      </Grid.Row>
    </Grid>
  );
};

export default StudyFilesListView;
