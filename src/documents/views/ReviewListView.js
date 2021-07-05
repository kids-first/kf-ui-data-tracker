import {
  ALL_DATA_REVIEWS,
  GET_STUDY_BY_ID,
  MY_PROFILE,
} from '../../state/queries';
import {
  Button,
  Container,
  Dimmer,
  Grid,
  Header,
  Icon,
  List,
  Loader,
  Message,
  Popup,
  Segment,
  Table
} from 'semantic-ui-react';

import {Helmet} from 'react-helmet';
import Markdown from 'react-markdown';
import NotFoundView from '../../views/NotFoundView';
import React from 'react';
import TimeAgo from 'react-timeago';
import {hasPermission} from '../../common/permissions';
import {longDate} from '../../common/dateUtils';
import {reviewStatus} from '../../common/enums';
import {useQuery} from '@apollo/client';

/**
 * Review list screen
 */
const ReviewListView = ({
  match: {
    params: {kfId},
  },
  history,
}) => {
  const {data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + kfId).toString('base64'),
    },
  });
  const study = studyData && studyData.study;

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowAddReview =
    myProfile && hasPermission(myProfile, 'add_datareview');
  const allowViewReview =
    myProfile && hasPermission(myProfile, 'list_all_datareview');

  const {loading, data, error} = useQuery(ALL_DATA_REVIEWS, {
    variables: {
      studyKfId: kfId,
    },
  });

  const reviews =
    data && data.allDataReviews.edges ? data.allDataReviews.edges : [];

  if (!loading && reviews === null) {
    return (
      <NotFoundView
        title="Reviews not found"
        message={`Cannot find the reviews`}
      />
    );
  }

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading Data Review List ...</Loader>
      </Dimmer>
    );

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study documents - Error ${
              study ? 'for ' + study.kfId : null
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

  return (
    <Grid as={Segment} basic container columns={1}>
      <Helmet>
        <title>
          {`KF Data Tracker - Study documents ${
            study ? 'for ' + study.name : null
          }`}
        </title>
      </Helmet>
      <Grid.Row>
        <Grid.Column width={4}>
          <Header as="h2" className="noMargin">
            Study Reviews
          </Header>
        </Grid.Column>
        <Grid.Column width={12} textAlign="right">
          {allowAddReview && (
            <Button
              compact
              color="teal"
              floated="right"
              size="large"
              icon="check"
              labelPosition="left"
              content="Start New Review"
              as="label"
              onClick={() => history.push(`/study/${study.kfId}/start-review`)}
            />
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          {reviews.length > 0 ? (
            <List relaxed="very">
              {reviews.map(({node}) => (
                <List.Item key={node.kfId}>
                  <Popup
                    inverted
                    position="left center"
                    content={reviewStatus[node.state].text}
                    trigger={
                      <List.Icon
                        name={reviewStatus[node.state].icon}
                        color={reviewStatus[node.state].color}
                        size="big"
                        verticalAlign="middle"
                      />
                    }
                  />
                  <List.Content>
                    <List.Header
                      as="a"
                      onClick={() =>
                        history.push(
                          `/study/${study.kfId}/reviews/${node.kfId}`,
                        )
                      }
                    >
                      {node.name.substring(0, 100)}
                      {node.name.length > 100 && '...'}
                      <small className="text-normal text-grey ml-10">
                        {node.kfId}
                      </small>
                      <small className="text-normal text-grey ml-10">
                        <TimeAgo
                          date={node.createdAt}
                          live={false}
                          title={longDate(node.createdAt)}
                        />
                      </small>
                      {node.description.length > 0 && (
                        <Popup
                          wide="very"
                          position="top left"
                          trigger={
                            <Icon
                              className="ml-10"
                              color="grey"
                              size="small"
                              name="info circle"
                            />
                          }
                          content={
                            <Markdown
                              source={node.description}
                              renderers={{
                                image: Image,
                                table: props => <Table>{props.children}</Table>,
                              }}
                              linkTarget="_blank"
                            />
                          }
                        />
                      )}
                    </List.Header>
                    <List.Description as={List} bulleted horizontal>
                      <List.Item>
                        {node.versions.edges ? node.versions.edges.length : '0'}{' '}
                        document(s) in review
                      </List.Item>
                      {node.validationResultset ? (
                        <>
                          <List.Item className="text-green">
                            {node.validationResultset.passed} Tests Passed
                          </List.Item>
                          <List.Item className="text-red">
                            {node.validationResultset.failed} Tests Failed
                          </List.Item>
                          <List.Item className="text-yellow">
                            {node.validationResultset.didNotRun} Tests Did Not
                            Run
                          </List.Item>
                        </>
                      ) : (
                        <List.Item>No data validation report created</List.Item>
                      )}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          ) : (
            <Message
              warning
              icon="warning circle"
              header="No data review found."
              content={
                allowViewReview
                  ? 'To create a new data review for this study, click on the start new review button.'
                  : "You don't have access to data reviews."
              }
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ReviewListView;
