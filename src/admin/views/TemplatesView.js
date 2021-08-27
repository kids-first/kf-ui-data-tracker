import React, {Fragment, useState} from 'react';
import {Formik} from 'formik';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  ALL_TEMPLATE_VERSIONS,
  MY_PROFILE,
  ALL_STUDIES,
} from '../../state/queries';
import {
  UPLOAD_FIEID_DEFINITIONS,
  CREATE_DATA_TEMPLATE,
  UPDATE_DATA_TEMPLATE,
  DELETE_DATA_TEMPLATE,
  CREATE_TEMPLATE_VERSION,
  UPDATE_TEMPLATE_VERSION,
} from '../../state/mutations';
import {
  Container,
  Header,
  Message,
  Segment,
  Placeholder,
} from 'semantic-ui-react';
import TemplateList from '../../components/TemplateList/TemplateList';
import DataTemplateConfirmModal from '../../modals/DataTemplateConfirmModal';
import DataTemplateEditModal from '../../modals/DataTemplateEditModal';
import {dataTemplateIcons} from '../../common/enums';

const TemplatesView = () => {
  const [open, setOpen] = useState('');
  const [creationError, setCreationError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [editConfirm, setEditConfirm] = useState(false);
  const [fieldData, setFieldData] = useState([]);
  const [editing, setEditing] = useState([]);

  const [uploadFieldDefinitions] = useMutation(UPLOAD_FIEID_DEFINITIONS);
  const [createDataTemplate] = useMutation(CREATE_DATA_TEMPLATE);
  const [updateDataTemplate] = useMutation(UPDATE_DATA_TEMPLATE);
  const [deleteDataTemplate] = useMutation(DELETE_DATA_TEMPLATE, {
    refetchQueries: [
      {
        query: ALL_TEMPLATE_VERSIONS,
      },
    ],
  });
  const [createTemplateVersion] = useMutation(CREATE_TEMPLATE_VERSION, {
    refetchQueries: [
      {
        query: ALL_TEMPLATE_VERSIONS,
      },
    ],
  });
  const [updateTemplateVersion] = useMutation(UPDATE_TEMPLATE_VERSION);

  const {loading, data, refetch, error} = useQuery(ALL_TEMPLATE_VERSIONS, {
    fetchPolicy: 'network-only',
  });
  const allTemplates = data && data.allTemplateVersions;

  const {data: profileData} = useQuery(MY_PROFILE);
  const profile = profileData && profileData.myProfile;
  const organizations = profile && profile.organizations;
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

  const {error: studyError, data: studyData} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'cache-first',
  });
  const allStudies = studyData && studyData.allStudies;
  const studyList = allStudies ? allStudies.edges : [];
  const currentOrgStudies = studyList
    ? studyList.filter(({node}) => node.organization.id === currentOrg.id)
    : [];
  const studyIds = currentOrgStudies.map(({node}) => node.id);
  const [studySelect, setStudySelect] = useState(studyIds);
  const onSelectOne = id => {
    if (studySelect.includes(id)) {
      setStudySelect(studySelect.filter(i => i !== id));
    } else {
      setStudySelect([...studySelect, id]);
    }
  };
  const onSelectAll = () => {
    if (studySelect.length === 0) {
      setStudySelect(studyIds);
    } else {
      setStudySelect([]);
    }
  };

  const handleUpload = file => {
    uploadFieldDefinitions({
      variables: {file: file},
    })
      .then(resp => {
        const fieldDefinitions = JSON.parse(
          resp.data.uploadFieldDefinitions.fieldDefinitions,
        ).fields.map((f, index) => ({
          ...f,
          tempId: String(index),
        }));
        setFieldData(fieldDefinitions);
        setCreationError('');
        setEditing([]);
      })
      .catch(err => {
        console.log(err);
        setCreationError(err.message);
        setEditing([]);
      });
  };

  const handleModalClose = () => {
    setOpen('');
    setCurrentStep(0);
    setCreationError('');
    setFieldData([]);
    setStudySelect(studyIds);
    setEditConfirm(false);
    refetch();
  };

  if (loading)
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

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Templates</title>
      </Helmet>
      <Header as="h2">
        Manage Data Templates
        <Header.Subheader>
          Organization administrators can create data submission templates to
          standardize how data is data collected for their studies.
        </Header.Subheader>
      </Header>
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
            <Segment basic vertical>
              {error && (
                <Message
                  negative
                  icon="warning circle"
                  header="Error"
                  content={error.message}
                />
              )}
              {allTemplates && (
                <TemplateList
                  templates={allTemplates.edges}
                  setOpen={setOpen}
                  organization={currentOrg}
                  setFieldValue={formikProps.setFieldValue}
                  setFieldData={setFieldData}
                  setStudySelect={setStudySelect}
                  deleteDataTemplate={deleteDataTemplate}
                  organizationsList={organizations.edges}
                />
              )}
            </Segment>
            {editConfirm ? (
              <DataTemplateConfirmModal
                open={open}
                formikProps={formikProps}
                fieldData={fieldData}
                studyList={currentOrgStudies}
                studyError={studyError}
                studySelect={studySelect}
                setEditConfirm={setEditConfirm}
                handleModalClose={handleModalClose}
                updateDataTemplate={updateDataTemplate}
                updateTemplateVersion={updateTemplateVersion}
              />
            ) : (
              <DataTemplateEditModal
                formikProps={formikProps}
                open={open}
                setOpen={setOpen}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                editing={editing}
                setEditing={setEditing}
                fieldData={fieldData}
                setFieldData={setFieldData}
                studySelect={studySelect}
                setStudySelect={setStudySelect}
                creationError={creationError}
                setCreationError={setCreationError}
                studyIds={studyIds}
                currentOrg={currentOrg}
                onSelectOne={onSelectOne}
                onSelectAll={onSelectAll}
                handleUpload={handleUpload}
                createDataTemplate={createDataTemplate}
                createTemplateVersion={createTemplateVersion}
                setEditConfirm={setEditConfirm}
                studyList={studyList}
                studyError={studyError}
                editable={currentOrg.id === formikProps.values.organization.id}
              />
            )}
          </Fragment>
        )}
      </Formik>
    </Container>
  );
};

export default TemplatesView;
