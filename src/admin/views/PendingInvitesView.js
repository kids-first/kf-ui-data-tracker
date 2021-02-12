import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Container,
  Header,
  Segment,
  Message,
  Icon,
  List,
  Popup,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router-dom';
import {ALL_REFERRAL_TOEKNS} from '../queries';
import {CREATE_REFERRAL_TOKEN} from '../../state/mutations';

const dateSort = (a, b) => new Date(b) - new Date(a);

const Resend = ({node, createToken}) => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState();

  if (sent) {
    return (
      <>
        <Icon name="check" color="green" /> Invite resent
      </>
    );
  }
  if (sending) {
    return <Icon loading name="spinner" />;
  }
  if (error) {
    return (
      <>
        <Icon name="x" color="red" /> {error}
      </>
    );
  }
  return (
    <span
      onClick={() => {
        setSending(true);
        createToken({
          variables: {
            input: {
              email: node.email,
              groups: node.groups.edges.map(({node}) => node.id),
              studies: node.studies.edges.map(({node}) => node.id),
            },
          },
        })
          .then(() => {
            setSending(false);
            setSent(true);
          })
          .catch(err => {
            setSending(false);
            setError(JSON.stringify(err));
          });
      }}
      className="text-blue cursor-pointer"
    >
      Resend?
    </span>
  );
};

const PendingInvitesView = () => {
  const {loading, error, data} = useQuery(ALL_REFERRAL_TOEKNS);
  const [createToken] = useMutation(CREATE_REFERRAL_TOKEN);

  return (
    <>
      <Helmet>
        <title>KF Data Tracker - Pending Invites</title>
      </Helmet>
      <Container as={Segment} basic>
        <Header as="h3">Data Tracker Pending Invites</Header>
        <Segment basic>
          These are the new user email invites with referral tokens. When new
          user is invited, they are added to certain studied and added to
          certain permission groups.
        </Segment>
        {error && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={error.message}
          />
        )}
        {!loading && data.allReferralTokens.edges.length > 0 ? (
          <List divided relaxed="very">
            {[...data.allReferralTokens.edges]
              .sort((f1, f2) => dateSort(f1.node.createdAt, f2.node.createdAt))
              .map(({node}) => (
                <List.Item key={node.id}>
                  <List.Content floated="left">
                    <List.Header>
                      <Popup
                        inverted
                        position="left center"
                        content={
                          node.isValid
                            ? 'Pending'
                            : node.claimed
                            ? 'Accepted'
                            : 'Expired'
                        }
                        trigger={
                          <List.Icon
                            name="mail outline"
                            color={
                              node.isValid
                                ? 'black'
                                : node.claimed
                                ? 'green'
                                : 'red'
                            }
                            size="large"
                            verticalAlign="middle"
                          />
                        }
                      />
                      {node.email}
                    </List.Header>
                    <List.Description className="ml-28">
                      Invitation sent by {node.createdBy.displayName}{' '}
                      <TimeAgo date={node.createdAt} live={false} /> -{' '}
                      {node.isValid ? (
                        'waiting for response.'
                      ) : node.claimed ? (
                        `claimed by ${node.claimedBy.displayName}`
                      ) : (
                        <Resend node={node} createToken={createToken} />
                      )}
                    </List.Description>
                  </List.Content>
                  <List.Content floated="right">
                    {node.studies.edges ? (
                      <Popup
                        hoverable
                        wide="very"
                        position="top right"
                        content={
                          <List>
                            {node.studies.edges.map(({node}) => (
                              <List.Item
                                to={`/study/${node.kfId}/basic-info/info`}
                                as={Link}
                                key={node.id}
                              >
                                {node.kfId + ' - ' + node.name}
                              </List.Item>
                            ))}
                          </List>
                        }
                        trigger={
                          <p className="text-right text-blue noMargin">
                            {node.studies.edges.length + ' Assigned Studies'}
                          </p>
                        }
                      />
                    ) : (
                      <p className="text-grey text-left noMargin">
                        No Assigned Studies
                      </p>
                    )}
                    {node.groups.edges && (
                      <List.Description
                        as={List}
                        horizontal
                        className="noVerticalPadding"
                      >
                        <List.Item
                          key="permission-groups"
                          className="noVerticalPadding"
                        >
                          Permission groups:
                        </List.Item>
                        {node.groups.edges.map(({node}) => (
                          <List.Item
                            className="noVerticalPadding"
                            key={node.id}
                          >
                            {node.name}
                          </List.Item>
                        ))}
                      </List.Description>
                    )}
                  </List.Content>
                </List.Item>
              ))}
          </List>
        ) : (
          <Header as="h4" disabled textAlign="center">
            No Pending Invites
          </Header>
        )}
      </Container>
    </>
  );
};

export default PendingInvitesView;
