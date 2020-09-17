import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  Container,
  Dimmer,
  Header,
  Loader,
  List,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {ALL_VALIDATIONS} from '../queries';
import {CREATE_VALIDATION} from '../mutations';
import NewValidationForm from '../forms/NewValidationForm';
import defaultAvatar from '../../assets/defaultAvatar.png';

const ValidationList = ({validations}) => {
  if (!validations) return 'No validation runs yet';

  return (
    <List divided>
      {validations.map(({node}) => (
        <List.Item>
          <Image avatar src={node.creator.picture || defaultAvatar} />
          <List.Content>
            <List.Header>
              {node.creator.displayName} ran an validation{' '}
              <TimeAgo date={node.createdAt} />
            </List.Header>
            <List.Description>Result: {node.result}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

const ValidationsView = () => {
  const [createValidation, {data: createData}] = useMutation(
    CREATE_VALIDATION,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{query: ALL_VALIDATIONS}],
    },
  );

  const {loading: loadingValidations, error, data: validationsData} = useQuery(
    ALL_VALIDATIONS,
  );
  const allValidations =
    validationsData && validationsData.allValidations.edges;

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Validations - Error</title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  const handleSubmit = (values, {setSubmitting, setErrors}) => {
    setSubmitting(true);

    let versions = values.versions.replace(/\s/g, '').split(',');
    versions = versions.map(version =>
      Buffer.from('VersionNode:' + version).toString('base64'),
    );
    createValidation({variables: {versions}}).catch(err =>
      setErrors({all: err}),
    );

    setSubmitting(false);
  };

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Ingest Validation</title>
      </Helmet>
      <Header>Ingest Validation</Header>
      <Segment basic>Validations are run on a set of versions</Segment>

      <NewValidationForm handleSubmit={handleSubmit} />
      {createData && (
        <Message>
          <pre>{JSON.stringify(createData.createValidation, null, 2)}</pre>
        </Message>
      )}

      <Segment basic>
        {loadingValidations ? (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading past validations...</Loader>
            </Dimmer>
          </Segment>
        ) : (
          <>
            <Header>Latest Validation Runs</Header>
            <ValidationList validations={allValidations} />
          </>
        )}
      </Segment>
    </Container>
  );
};

export default ValidationsView;
