import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  GET_STUDY_BY_ID,
  ALL_TEMPLATE_VERSIONS,
  MY_PROFILE,
} from '../../state/queries';
import {
  FILE_DOWNLOAD_URL,
  UPDATE_FILE,
  DELETE_FILE,
  CREATE_FLATFILE_SETTINGS,
} from '../mutations';
import {UploadContainer} from '../containers';
import FileList from '../components/FileList/FileList';
import {
  Grid,
  Message,
  Placeholder,
  Container,
  Segment,
  Button,
  Header,
  Icon,
} from 'semantic-ui-react';
import NotFoundView from '../../views/NotFoundView';
import FileFolder from '../components/FileFolder/FileFolder';
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
  if (filters.tagFilterStatus.length > 0) {
    filteredList = filteredList.filter(obj =>
      filters.tagFilterStatus.includes('untagged')
        ? filters.andJoin
          ? filters.tagFilterStatus
              .filter(t => t !== 'untagged')
              .every(t => obj.node.tags.includes(t)) ||
            obj.node.tags.length === 0
          : obj.node.tags.some(
              t =>
                filters.tagFilterStatus
                  .filter(t => t !== 'untagged')
                  .indexOf(t) >= 0,
            ) || obj.node.tags.length === 0
        : filters.andJoin
        ? filters.tagFilterStatus.every(t => obj.node.tags.includes(t))
        : obj.node.tags.some(t => filters.tagFilterStatus.indexOf(t) >= 0),
    );
  }

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
  location,
}) => {
  const studyId = Buffer.from('StudyNode:' + kfId).toString('base64');

  // Document mutations
  const [downloadFile] = useMutation(FILE_DOWNLOAD_URL);
  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: studyId,
        },
      },
    ],
  });
  const [updateFile] = useMutation(UPDATE_FILE, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: studyId,
        },
      },
    ],
    onError: error => {
      setUpdateFileError(error);
    },
  });

  // Get flatfile settings
  const {data: templateData, loading: templateLoading} = useQuery(
    ALL_TEMPLATE_VERSIONS,
    {
      variables: {
        studies: [studyId],
      },
      fetchPolicy: 'network-only',
    },
  );
  const [createFlatfileSettings] = useMutation(CREATE_FLATFILE_SETTINGS);
  const [flatfileSettings, setFlatfileSettings] = useState('');
  const templateList =
    templateData &&
    templateData.allTemplateVersions &&
    templateData.allTemplateVersions.edges.length > 0
      ? templateData.allTemplateVersions.edges.map(({node}) => node.id)
      : [];
  useEffect(() => {
    if (flatfileSettings.length === 0 && !templateLoading) {
      createFlatfileSettings({
        variables: {
          templateVersions: templateList,
        },
      })
        .then(resp => {
          if (resp.data.createFlatfileSettings.flatfileSettings) {
            setFlatfileSettings(
              resp.data.createFlatfileSettings.flatfileSettings,
            );
          }
        })
        .catch(err => {
          console.log(err);
          const errorMessage = err.message
            ? err.message
            : 'Problem creating flatfile settings';
          setFlatfileSettings('ERROR: ' + errorMessage);
        });
    }
  }, [
    createFlatfileSettings,
    setFlatfileSettings,
    templateList,
    flatfileSettings.length,
    templateLoading,
  ]);

  // Study query, includes documents
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: studyId,
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
  const allowAddReview =
    myProfile && hasPermission(myProfile, 'add_datareview');

  // View state
  const [updateFileError, setUpdateFileError] = useState(null);
  const [filters, setFilters] = useState({
    typeFilterStatus: '',
    tagFilterStatus: [],
    searchString: '',
    andJoin: true,
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

  const onUpload = file => {
    history.push('documents/upload', {file});
  };

  const [folderMode, setFolderMode] = useState(true);

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
      {!folderMode && (
        <Grid.Row>
          <Grid.Column width={4}>
            <Header as="h2" className="noMargin">
              Study Documents
            </Header>
          </Grid.Column>
          {files.length > 0 && (allowUploadFile || allowUploadVersion) && (
            <Grid.Column width={12} textAlign="right">
              <Button.Group floated="right" className="ml-15">
                <Button
                  icon="folder"
                  active={folderMode}
                  data-testid="file-folder-mode"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFolderMode(!folderMode);
                  }}
                />
                <Button
                  icon="list"
                  active={!folderMode}
                  data-testid="file-list-mode"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFolderMode(!folderMode);
                  }}
                />
              </Button.Group>
              {allowAddReview && (
                <Button
                  className="ml-15"
                  compact
                  color="teal"
                  floated="right"
                  size="large"
                  icon="check"
                  labelPosition="left"
                  content="Start Review"
                  as="label"
                  onClick={() =>
                    history.push(`/study/${study.kfId}/start-review`)
                  }
                />
              )}
              <Button
                className="ml-15"
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
                onChange={e => onUpload(e.target.files[0])}
              />
            </Grid.Column>
          )}
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Column width={16}>
          {files.length > 0 ? (
            <>
              {folderMode ? (
                <FileFolder
                  fileList={files}
                  onUpload={onUpload}
                  updateFile={allowEdit ? updateFile : null}
                  deleteFile={allowDelete ? deleteFile : null}
                  allowUploadFile={allowUploadFile}
                  allowUploadVersion={allowUploadVersion}
                  folderMode={folderMode}
                  setFolderMode={setFolderMode}
                  selection={selectedFiles}
                  setSelection={setSelectedFiles}
                  tagOptions={tagOptions}
                  updateError={updateFileError}
                  downloadFileMutation={downloadFile}
                  allowAddReview={allowAddReview}
                />
              ) : (
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
                    filters={filters}
                    setFilters={setFilters}
                  />
                </>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <StudyListSkeleton />
              ) : (
                <>
                  {allowUploadFile || allowUploadVersion ? (
                    <Grid.Row centered>
                      <UploadContainer handleUpload={file => onUpload(file)} />
                    </Grid.Row>
                  ) : (
                    <Segment placeholder>
                      <Header icon textAlign="center" disabled>
                        <Icon name="file outline" />
                        {allowView
                          ? "You don't have any documents yet."
                          : "You don't have access to view any documents."}
                      </Header>
                    </Segment>
                  )}
                </>
              )}
            </>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default StudyFilesListView;
