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
  const groups =
    decoded['https://kidsfirstdrc.org/groups'] || decoded.context.groups;
  const roles =
    decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;
  return (
    <Container style={{marginTop: '30px'}}>
      <Header as="h3">Your Profile</Header>
      <Segment basic>
        <Grid>
          <Grid.Row>
            <Grid.Column width="2" verticalAlign="middle">
              <Image
                centered
                circular
                size={100}
                src={profile.picture}
              />
            </Grid.Column>
            <Grid.Column width="8">
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
            <Grid.Column width="6" textAlign="right">
              <Header as="h5">Your Roles</Header>
              <Label.Group size="tiny">
                {roles.map((role, i) => (
                  <Label key={i}>{role}</Label>
                ))}
              </Label.Group>
              <Header as="h5">Your Groups</Header>
              <Label.Group size="tiny">
                {groups.map((group, i) => (
                  <Label key={i}>{group}</Label>
                ))}
              </Label.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Header as="h3">Notifications</Header>
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
