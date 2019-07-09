import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import jwtDecode from 'jwt-decode';
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
} from 'semantic-ui-react';
import UpdateProfileForm from '../forms/UpdateProfileForm';
import StudySubscriptionContanier from '../containers/StudySubscriptionContainer';

/**
 * A user's profile view
 */
const ProfileView = ({
  data: {loading, error, myProfile: profile},
  updateProfile,
}) => {
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

  if (loading) return <span>Loading...</span>;
  if (error) return <span>{error.message}</span>;

  const fields = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
  };

  const token =
    localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
  const decoded = jwtDecode(token);
  const roles =
    decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;
  return (
    <Container as={Segment} basic vertical>
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
                src={profile.picture}
              />
            </Grid.Column>
            <Label attached="top left">{roles.join(', ')}</Label>
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

export default compose(
  graphql(MY_PROFILE),
  graphql(UPDATE_PROFILE, {name: 'updateProfile'}),
)(ProfileView);
