import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {UPDATE_STUDY} from '../../state/mutations';
import NewResearchStudyForm from '../forms/NewResearchStudyForm';
import {Container, Segment, Message, Placeholder} from 'semantic-ui-react';
import NotFoundView from '../../views/NotFoundView';

const NewResearchStudyInfo = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
    fetchPolicy: 'network-only',
  });
  const studyByKfId = data && data.studyByKfId;
  const studyName = studyByKfId ? 'for ' + studyByKfId.name : '';
  const user = useQuery(MY_PROFILE);
  const [updateStudy] = useMutation(UPDATE_STUDY);

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;

  const [apiErrors, setApiErrors] = useState(null);
  const submitUpdate = values => {
    var inputObject = {
      name: values.name,
      shortName: values.shortName,
      description: values.description,
    };
    updateStudy({
      variables: {
        id: studyByKfId.id,
        input: inputObject,
      },
    })
      .then(() => {
        setApiErrors(null);
      })
      .catch(err => setApiErrors(err.message));
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
  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Research Study info - Error ${
              match.params.kfId
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
  if (studyByKfId === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the research study with ID ${match.params.kfId}`}
      />
    );
  }

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Study info ${studyName}`}</title>
      </Helmet>
      <NewResearchStudyForm
        isAdmin={isAdmin}
        history={history}
        submitValue={submitUpdate}
        apiErrors={apiErrors}
        studyNode={studyByKfId}
        editing={isAdmin}
      />
    </Container>
  );
};

export default NewResearchStudyInfo;
