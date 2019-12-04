import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {MY_PROFILE} from '../state/queries';
import {UPDATE_PROFILE} from '../state/mutations';
import {
  Container,
  Form,
  Grid,
  Header,
  Image,
  Label,
  Message,
  Segment,
  Placeholder,
} from 'semantic-ui-react';
import UpdateProfileForm from '../forms/UpdateProfileForm';
import StudySubscriptionContanier from '../containers/StudySubscriptionContainer';

/**
 * A user's profile view
 */
const ProfileView = () => {
  const {loading, error, data} = useQuery(MY_PROFILE);
  const profile = data && data.myProfile;
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [errors, setErrors] = useState();

  const handleSave = (slackNotify, slackMemberId) => {
    setMessage();
    setErrors();
    setSubmitting(true);
    // Call update mutation
    updateProfile({variables: {slackNotify, slackMemberId}})
      .then(resp => {
        setMessage('Saved!');
        setSubmitting(false);
      })
      .catch(err => {
        setErrors(err.message);
        setSubmitting(false);
      });
  };

  if (loading)
    return (
      <Container as={Segment} basic>
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
          <title>KF Data Tracker - Profile - Error</title>
        </Helmet>
        <Header as="h3">Your Profile</Header>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  const fields = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
  };

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>KF Data Tracker - Profile</title>
      </Helmet>
      <Header as="h3">Your Profile</Header>
      <Segment basic secondary>
        <Grid doubling stackable>
          <Grid.Row>
            <Grid.Column
              mobile={16}
              tablet={4}
              computer={2}
              verticalAlign="middle"
            >
              <Image
                centered
                circular
                size="small"
                bordered
                src={
                  profile.picture ||
                  'https://www.w3schools.com/css/img_avatar.png'
                }
              />
            </Grid.Column>
            <Label attached="top left">{profile.roles.join(', ')}</Label>
            <Grid.Column mobile={16} tablet={12} computer={14}>
              <Form size="mini">
                <Form.Group widths={2}>
                  <Form.Field
                    label={fields['username']}
                    control="input"
                    disabled
                    value={profile['username']}
                  />
                  <Form.Field
                    label={fields['email']}
                    control="input"
                    disabled
                    value={profile['email']}
                  />
                </Form.Group>
                <Form.Group widths={2}>
                  <Form.Field
                    label={fields['firstName']}
                    control="input"
                    disabled
                    value={profile['firstName']}
                  />
                  <Form.Field
                    label={fields['lastName']}
                    control="input"
                    disabled
                    value={profile['lastName']}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Header as="h3">Notifications</Header>
      <Message
        info
        attached
        icon="send"
        header="Get Notified"
        content="If you are a member of the Kids-First slack channel, we can send you daily updates when there are changes made to the studies of your choosing."
      />
      <UpdateProfileForm
        handleSubmit={handleSave}
        defaultState={{
          slackNotify: profile.slackNotify,
          slackMemberId: profile.slackMemberId,
        }}
        errors={errors}
        loading={submitting}
        message={message}
      />
      <Header as="h3">Your Subscriptions</Header>
      <p>
        We'll notify you of daily activity when you subscribe to studies below
      </p>
      <StudySubscriptionContanier />
    </Container>
  );
};

export default ProfileView;
