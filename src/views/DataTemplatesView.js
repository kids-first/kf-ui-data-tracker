import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {
  GET_STUDY_BY_ID,
  ALL_TEMPLATE_VERSIONS,
  MY_PROFILE,
} from '../state/queries';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Icon,
  Button,
  Dropdown,
} from 'semantic-ui-react';
import NotFoundView from './NotFoundView';
import TemplateList from '../components/TemplateList/TemplateList';
import {hasPermission} from '../common/permissions';
import {KF_STUDY_API} from '../common/globals';

const DataTemplatesView = ({match}) => {
  const [selection, setSelection] = useState([]);
  const [format, setFormat] = useState('excel');
  const studyId = Buffer.from('StudyNode:' + match.params.kfId).toString(
    'base64',
  );

  const {loading, data, error} = useQuery(ALL_TEMPLATE_VERSIONS, {
    variables: {
      studies: [studyId],
    },
  });

  const {loading: studyLoading, data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: studyId,
    },
    fetchPolicy: 'network-only',
  });
  const study = studyData && studyData.study;
  const studyName = study ? 'for ' + study.name : '';
  const allTemplates = data && data.allTemplateVersions;
  const {data: profileData, error: userError} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const organizations = myProfile && myProfile.organizations;
  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }
  if (!currentOrg) {
    currentOrg = organizations && organizations.edges[0].node;
    localStorage.setItem('currentOrganization', JSON.stringify(currentOrg));
  }

  const allowView =
    myProfile &&
    (hasPermission(myProfile, 'view_datatemplate') ||
      hasPermission(myProfile, 'list_all_datatemplate'));

  if (loading || studyLoading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );
  if ((error || userError) && allowView)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study templates - Error ${match.params.kfId}`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Templates Error: {error.message}</p>}
            {userError && userError.message && (
              <p>User Error: {userError.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );
  if (study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${match.params.kfId}`}
      />
    );
  }
  if (allowView) {
    return (
      <Container as={Segment} basic vertical className="text-right">
        <Helmet>
          <title>{`KF Data Tracker - Study templates ${studyName}`}</title>
        </Helmet>
        <Header as="h2" className="mt-6" floated="left">
          Data Templates
        </Header>
        <Dropdown
          floating
          selection
          placeholder="Organizations"
          disabled={!(allTemplates && allTemplates.edges.length > 0)}
          value={format}
          options={[
            {
              key: 'excel',
              text: 'Excel Workbook',
              value: 'excel',
              icon: 'file excel',
            },
            {key: 'zip', text: 'Zip File', value: 'zip', icon: 'file archive'},
          ]}
          onChange={(ev, data) => {
            setFormat(data.value);
          }}
        />
        <Button
          compact
          primary
          floated="right"
          size="large"
          labelPosition="left"
          content="Download"
          as="label"
          disabled={selection.length === 0}
          icon={format === 'zip' ? 'file archive' : 'file excel'}
          onClick={() => {
            const tempList = selection.join(',');
            const bearerToken = 'Bearer ' + localStorage.getItem('accessToken');
            const url = `${KF_STUDY_API}/download/templates/${match.params.kfId}?file_format=${format}&template_versions=${tempList}`;
            let anchor = document.createElement('a');
            document.body.appendChild(anchor);
            let file = url;
            let headers = new Headers();
            headers.append('Authorization', bearerToken);
            const fileName = `${study.kfId}_templates${
              format === 'zip' ? '.zip' : '.xlsx'
            }`;
            fetch(file, {headers})
              .then(response => response.blob())
              .then(blobby => {
                let objectUrl = window.URL.createObjectURL(blobby);
                anchor.href = objectUrl;
                anchor.download = fileName;
                anchor.click();
                window.URL.revokeObjectURL(objectUrl);
              });
          }}
        />
        {allTemplates && allTemplates.edges.length > 0 ? (
          <TemplateList
            templates={allTemplates.edges}
            selection={selection}
            setSelection={setSelection}
            organization={currentOrg}
          />
        ) : (
          <Segment placeholder>
            <Header icon disabled>
              <Icon name="file outline" />
              No Templates Available
              <Header.Subheader>
                Your organization has not assigned any data templates to this
                study.
              </Header.Subheader>
            </Header>
          </Segment>
        )}
      </Container>
    );
  } else {
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Study templates for {study.name}</title>
        </Helmet>
        <Message
          warning
          icon="warning circle"
          header="You don't have access to data templates."
          content="Data templates will show up here once the permission is added to your account."
        />
      </Container>
    );
  }
};

export default DataTemplatesView;
