import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  MY_PROFILE,
  GET_STUDY_BY_ID,
  ALL_EVENTS,
  ALL_TEMPLATE_VERSIONS,
} from '../../state/queries';
import {GET_FILE_BY_ID} from '../queries';
import {
  UPDATE_FILE,
  DELETE_FILE,
  FILE_DOWNLOAD_URL,
  EVALUATE_TEMPLATE_MATCH,
} from '../mutations';
import {Container, Segment, Dimmer, Loader, Message} from 'semantic-ui-react';
import FileDetail from '../components/FileDetail/FileDetail';
import NotFoundView from '../../views/NotFoundView';
import {hasPermission} from '../../common/permissions';

const FileDetailView = ({match}) => {
  // Study query get used tags within current study
  const {data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
  });
  const studyByKfId = studyData && studyData.study;
  const files = studyByKfId ? studyByKfId.files.edges : [];
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

  const {loading, data, error} = useQuery(GET_FILE_BY_ID, {
    variables: {kfId: match.params.fileId},
  });
  const fileByKfId = data && data.fileByKfId;
  const [updateFile, {error: updateError}] = useMutation(UPDATE_FILE, {
    refetchQueries: [
      {query: GET_FILE_BY_ID, variables: {kfId: match.params.fileId}},
      {
        query: ALL_EVENTS,
        variables: {
          fileId: match.params.fileId,
          orderBy: '-created_at',
          first: 20,
        },
      },
    ],
  });

  const templates = useQuery(ALL_TEMPLATE_VERSIONS, {
    variables: {
      studies: [
        Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
      ],
    },
  });

  const [evaluateTemplateMatch] = useMutation(EVALUATE_TEMPLATE_MATCH);

  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
        },
      },
    ],
  });
  const [downloadFileMutation] = useMutation(FILE_DOWNLOAD_URL);
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowEdit =
    myProfile &&
    (hasPermission(myProfile, 'change_file') ||
      hasPermission(myProfile, 'change_my_study_file'));
  const allowUpload =
    myProfile &&
    (hasPermission(myProfile, 'add_version') ||
      hasPermission(myProfile, 'add_my_study_version'));
  const allowDelete = myProfile && hasPermission(myProfile, 'delete_file');
  const allowViewVersion =
    myProfile &&
    (hasPermission(myProfile, 'view_version') ||
      hasPermission(myProfile, 'view_my_version'));
  const allowExtractConfig =
    myProfile &&
    (hasPermission(myProfile, 'extract_version_config') ||
      hasPermission(myProfile, 'extract_my_version_config'));

  const event = useQuery(ALL_EVENTS, {
    variables: {
      fileId: match.params.fileId,
      orderBy: '-created_at',
      first: 20,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading File Details ...</Loader>
      </Dimmer>
    );

  if (error)
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>
            {`KF Data Tracker - Study document - Error ${
              fileByKfId ? 'for ' + fileByKfId.kfId : null
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
  if (fileByKfId === null) {
    return (
      <NotFoundView
        title="Document not found"
        message={`Cannot find the document with ID ${match.params.fileId}`}
      />
    );
  }
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>
          {`KF Data Tracker - Study document ${
            fileByKfId ? 'for ' + fileByKfId.name : null
          }`}
        </title>
      </Helmet>
      <FileDetail
        fileNode={fileByKfId}
        allowUpload={allowUpload}
        deleteFile={allowDelete ? deleteFile : null}
        updateFile={allowEdit ? updateFile : null}
        downloadFileMutation={downloadFileMutation}
        allowViewVersion={allowViewVersion}
        updateError={updateError}
        tagOptions={tagOptions}
        allowExtractConfig={allowExtractConfig}
        event={event}
        studyFiles={
          files ? files.filter(({node}) => node.name !== fileByKfId.name) : []
        }
        templates={
          templates.data ? templates.data.allTemplateVersions.edges : []
        }
        evaluateTemplateMatch={evaluateTemplateMatch}
      />
    </Container>
  );
};

export default FileDetailView;
