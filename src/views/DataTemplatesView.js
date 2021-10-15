import React, {Fragment, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Formik} from 'formik';
import {useQuery} from '@apollo/client';
import {
  GET_STUDY_BY_ID,
  ALL_TEMPLATE_VERSIONS,
  MY_PROFILE,
  ALL_STUDIES,
} from '../state/queries';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Icon,
} from 'semantic-ui-react';
import NotFoundView from './NotFoundView';
import TemplateList from '../components/TemplateList/TemplateList';
import DataTemplateEditModal from '../modals/DataTemplateEditModal';
import {dataTemplateIcons} from '../common/enums';
import {hasPermission} from '../common/permissions';

const DataTemplatesView = ({match}) => {
  const [open, setOpen] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldData, setFieldData] = useState([]);

  const studyId = Buffer.from('StudyNode:' + match.params.kfId).toString(
    'base64',
  );

  const {loading, data, error} = useQuery(ALL_TEMPLATE_VERSIONS, {
    variables: {
      studies: [studyId],
    },
    fetchPolicy: 'network-only',
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

  const {error: studyError, data: studyListData} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'cache-first',
  });
  const allStudies = studyListData && studyListData.allStudies;
  const studyList = allStudies ? allStudies.edges : [];
  const currentOrgStudies = studyList
    ? studyList.filter(({node}) => node.organization.id === currentOrg.id)
    : [];
  const studyIds = currentOrgStudies.map(({node}) => node.id);

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
        <Formik
          initialValues={{
            id: null,
            versionId: null,
            name: '',
            description: '',
            icon: 'file excel',
            organization: {},
            fieldDefinitions: '',
            studies: [],
            origin: {},
            existFields: [],
          }}
          validate={vals => {
            let errors = {};
            ['name', 'description'].forEach(function(field) {
              if (!vals[field]) {
                errors[field] = 'Required';
              }
            });
            if (!dataTemplateIcons.includes(vals.icon)) {
              errors.icon = 'Invalid icon';
            }
            return errors;
          }}
        >
          {formikProps => (
            <Fragment>
              {allTemplates && allTemplates.edges.length > 0 ? (
                <TemplateList
                  templates={allTemplates.edges}
                  organization={currentOrg}
                  setFieldValue={formikProps.setFieldValue}
                  setFieldData={setFieldData}
                  setOpen={setOpen}
                  studyKfid={study.kfId}
                  match={match}
                />
              ) : (
                <Segment placeholder>
                  <Header icon disabled>
                    <Icon name="file outline" />
                    No Templates Available
                    <Header.Subheader>
                      Your organization has not assigned any data templates to
                      this study.
                    </Header.Subheader>
                  </Header>
                </Segment>
              )}
              <DataTemplateEditModal
                formikProps={formikProps}
                open={open}
                setOpen={setOpen}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                fieldData={fieldData}
                setFieldData={setFieldData}
                studySelect={studyIds}
                studyIds={studyIds}
                currentOrg={currentOrg}
                studyList={currentOrgStudies}
                studyError={studyError}
                editing={[]}
              />
            </Fragment>
          )}
        </Formik>
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
