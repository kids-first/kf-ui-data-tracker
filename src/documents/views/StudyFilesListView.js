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
  // Filter by fileType
  var filteredList = fileList.filter(obj =>
    obj.node.fileType.includes(filters.typeFilterStatus),
  );
  // Filter by tags
  filteredList = filteredList.filter(obj =>
    obj.node.tags.join(',').includes(filters.tagFilterStatus),
  );
  // Filter by search string
  filteredList = filteredList.filter(
    obj =>
      obj.node.kfId
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()) ||
      obj.node.name
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()) ||
      obj.node.description
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()),
  );
  return filteredList;
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
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + kfId).toString('base64'),
        },
      },
    ],
  });
  const [updateFile] = useMutation(UPDATE_FILE, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + kfId).toString('base64'),
        },
      },
    ],
    onError: error => {
      setUpdateFileError(error);
    },
  });

  // Study query, includes documents
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + kfId).toString('base64'),
    },
  });
  const study = data && data.study;
  // Query for user
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowView =
    myProfile &&
    (hasPermission(myProfile, 'view_my_study') ||
      hasPermission(myProfile, 'view_study'));
  const allowUploadFile =
    myProfile &&
    (hasPermission(myProfile, 'add_file') ||
      hasPermission(myProfile, 'add_my_study_file'));
  const allowUploadVersion =
    myProfile &&
    (hasPermission(myProfile, 'add_version') ||
      hasPermission(myProfile, 'add_my_study_version'));
  const allowDelete = myProfile && hasPermission(myProfile, 'delete_file');
  const allowEdit =
    myProfile &&
    (hasPermission(myProfile, 'change_file') ||
      hasPermission(myProfile, 'change_my_study_file'));

  const [dialog, setDialog] = useState(false);
  // View state
  const [uploadedFile, setFile] = useState(false);
  const [updateFileError, setUpdateFileError] = useState(null);
  const [filters, setFilters] = useState({
    typeFilterStatus: '',
    tagFilterStatus: '',
    searchString: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Set state for show/hide Kids First ID column and sync with local storage
  const [showId, setShowId] = useState(
    localStorage.getItem('showFileId') !== null
      ? JSON.parse(localStorage.getItem('showFileId'))
      : false,
  );

  // Computed state
  const files = !loading && study ? study.files.edges : [];
  const filteredFiles = filterFiles(files, filters);

  if (!loading && study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${kfId}`}
      />
    );
  }

  // Form tag options accoring the current used tags in this study
  var tagList = [];
  files.map(({node}) => {
    node.tags.map(tag => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
      return true;
    });
    return true;
  });
  const tagOptions = tagList.sort().map(t => ({key: t, value: t, text: t}));

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study documents - Error ${
              study ? 'for ' + study.kfId : null
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
            study ? 'for ' + study.name : null
          }`}
        </title>
      </Helmet>
      <Grid.Row>
        <Grid.Column width={10}>
          <h2>Study Documents</h2>
        </Grid.Column>
        {files.length > 0 && (allowUploadFile || allowUploadVersion) && (
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
              <ListFilterBar
                fileList={files}
                filters={filters}
                setFilters={setFilters}
                studyId={kfId}
                deleteFile={allowDelete ? deleteFile : null}
                downloadFileMutation={downloadFile}
                selection={selectedFiles}
                setSelection={setSelectedFiles}
                disabled={selectedFiles.length === 0}
                tagOptions={tagOptions}
                showId={showId}
                setShowId={setShowId}
              />
              <FileList
                fileList={filteredFiles}
                studyId={kfId}
                updateFile={allowEdit ? updateFile : null}
                updateError={updateFileError}
                downloadFileMutation={downloadFile}
                deleteFile={allowDelete ? deleteFile : null}
                selection={selectedFiles}
                setSelection={setSelectedFiles}
                tagOptions={tagOptions}
                showId={showId}
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
                    {allowView
                      ? "You don't have any documents yet."
                      : "You don't have access to any documents."}
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
              allowUploadFile={allowUploadFile}
              allowUploadVersion={allowUploadVersion}
            />
          )}
        </Grid.Column>
      </Grid.Row>
      {(allowUploadFile || allowUploadVersion) && (
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
      )}
    </Grid>
  );
};

export default StudyFilesListView;
