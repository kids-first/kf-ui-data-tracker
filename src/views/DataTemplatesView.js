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
} from 'semantic-ui-react';
import NotFoundView from './NotFoundView';
import TemplateList from '../components/TemplateList/TemplateList';
import {hasPermission} from '../common/permissions';

const DataTemplatesView = ({match}) => {
  const [selection, setSelection] = useState([]);
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
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - Study templates ${studyName}`}</title>
        </Helmet>
        <Button
          compact
          primary
          floated="right"
          size="large"
          labelPosition="left"
          content="Download"
          as="label"
          disabled={selection.length === 0}
          icon={selection.length > 1 ? 'file archive' : 'file excel'}
          onClick={() => {
            console.log(selection);
          }}
        />
        <Header as="h2" className="mt-6">
          Data Templates
        </Header>

        {allTemplates && allTemplates.edges.length > 0 ? (
          <TemplateList
            templates={allTemplates.edges}
            selection={selection}
            setSelection={setSelection}
          />
        ) : (
          <Header disabled textAlign="center" as="h4">
            No data templates available
          </Header>
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
