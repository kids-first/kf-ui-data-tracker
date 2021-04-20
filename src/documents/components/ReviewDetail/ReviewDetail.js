import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Label,
  Menu,
  Popup,
  Segment,
} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';

import {Amplitude} from '@amplitude/react-amplitude';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import React from 'react';
import ReviewDescription from './ReviewDescription';
import ReviewName from './ReviewName';
import ReviewTimelines from './ReviewTimelines';
import ReviewVersions from './ReviewVersions';
import {reviewStatus} from '../../../common/enums';

const ActionButtons = ({
  reviewNode,
  awaitReview,
  approveReview,
  closeReview,
  reopenReview,
  awaitError,
  approveError,
  closeError,
  reopenError,
  vertical,
  updateReview,
}) => {
  if (updateReview) {
    return (
      <Menu vertical={vertical} secondary fluid>
        <Menu.Item header as="h4" className="text-grey noMargin">
          Actions
        </Menu.Item>
        {reviewStatus[reviewNode.state].actions.length === 0 && (
          <Menu.Item disabled>
            No actions allowed for current review state
          </Menu.Item>
        )}
        {reviewStatus[reviewNode.state].actions.includes('await') && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'await review button']
                : ['button', 'await review button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                header="Are you sure?"
                content={
                  <>
                    Wait for updates for a data review
                    <Divider />
                    {awaitError ? (
                      <span className="text-red">{awaitError.message}</span>
                    ) : (
                      <Button
                        fluid
                        color="orange"
                        size="mini"
                        content="Await Review"
                        onClick={e => {
                          logEvent('click');
                          awaitReview({variables: {id: reviewNode.id}});
                        }}
                      />
                    )}
                  </>
                }
                on="click"
                position="left center"
                trigger={
                  <Menu.Item
                    onClick={() => {
                      logEvent('click');
                    }}
                  >
                    <Icon name="pause" />
                    Await
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
        )}
        {reviewStatus[reviewNode.state].actions.includes('approve') && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'approve review button']
                : ['button', 'approve review button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                header="Are you sure?"
                content={
                  <>
                    Approve the data review
                    <Divider />
                    {approveError ? (
                      <span className="text-red">{approveError.message}</span>
                    ) : (
                      <Button
                        fluid
                        color="green"
                        size="mini"
                        content="Approve Review"
                        onClick={e => {
                          logEvent('click');
                          approveReview({variables: {id: reviewNode.id}});
                        }}
                      />
                    )}
                  </>
                }
                on="click"
                position="left center"
                trigger={
                  <Menu.Item
                    onClick={() => {
                      logEvent('click');
                    }}
                  >
                    <Icon name="check" />
                    Approve
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
        )}
        {reviewStatus[reviewNode.state].actions.includes('reopen') && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'reopen review button']
                : ['button', 'reopen review button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                header="Are you sure?"
                content={
                  <>
                    Re-open a closed data review
                    <Divider />
                    {reopenError ? (
                      <span className="text-red">{reopenError.message}</span>
                    ) : (
                      <Button
                        fluid
                        color="yellow"
                        size="mini"
                        content="Re-open Review"
                        onClick={e => {
                          logEvent('click');
                          reopenReview({variables: {id: reviewNode.id}});
                        }}
                      />
                    )}
                  </>
                }
                on="click"
                position="left center"
                trigger={
                  <Menu.Item
                    onClick={() => {
                      logEvent('click');
                    }}
                  >
                    <Icon name="play" />
                    Reopen
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
        )}
        {reviewStatus[reviewNode.state].actions.includes('close') && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'close review button']
                : ['button', 'close review button'],
            })}
          >
            {({logEvent}) => (
              <Popup
                header="Are you sure?"
                content={
                  <>
                    Close an incomplete data review
                    <Divider />
                    {closeError ? (
                      <span className="text-red">{closeError.message}</span>
                    ) : (
                      <Button
                        fluid
                        negative
                        size="mini"
                        content="Close Review"
                        onClick={e => {
                          logEvent('click');
                          closeReview({variables: {id: reviewNode.id}});
                        }}
                      />
                    )}
                  </>
                }
                on="click"
                position="left center"
                trigger={
                  <Menu.Item
                    onClick={() => {
                      logEvent('click');
                    }}
                  >
                    <Icon name="stop" />
                    Close
                  </Menu.Item>
                }
              />
            )}
          </Amplitude>
        )}
      </Menu>
    );
  } else {
    return (
      <Menu vertical={vertical} secondary fluid>
        <Menu.Item header as="h4" className="text-grey noMargin">
          Actions
        </Menu.Item>
        <Menu.Item disabled>
          No actions allowed for current review state
        </Menu.Item>
      </Menu>
    );
  }
};

/**
 * Form to display data review details
 */
const ReviewDetail = ({
  reviewNode,
  history,
  match,
  allReviews,
  setAddFileOpen,
  updateReview,
  awaitReview,
  approveReview,
  closeReview,
  reopenReview,
  updateError,
  awaitError,
  approveError,
  closeError,
  reopenError,
  downloadFileMutation,
  canAddFile,
  canStartValidation,
  validationRunState,
}) => {
  const studyId = match.params.kfId;

  return (
    <Grid className="mb-50" style={{width: '100%'}}>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={14}>
          <Link to={`/study/${studyId}/reviews`}>
            <Button basic size="mini" labelPosition="left" floated="left">
              <Icon name="arrow left" />
              All Data Reviews
            </Button>
          </Link>
          <ReviewName
            allReviews={allReviews}
            reviewNode={reviewNode}
            updateReview={updateReview}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="noVerticalPadding">
        <Grid.Column mobile={16} only="mobile">
          <ActionButtons
            {...{
              reviewNode,
              updateReview,
              awaitReview,
              approveReview,
              closeReview,
              reopenReview,
              awaitError,
              approveError,
              closeError,
              reopenError,
              vertical: false,
            }}
          />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={13} computer={14} className="pl-0">
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={5}>
                <Segment basic>
                  <Header as="h4" color="grey">
                    Basic info
                  </Header>
                  <AvatarTimeAgo
                    size="small"
                    showUsername
                    creator={reviewNode.creator}
                    createdAt={reviewNode.createdAt}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={4}>
                <Segment basic>
                  <Header as="h4" color="grey">
                    State
                  </Header>
                  <Label color={reviewStatus[reviewNode.state].color}>
                    <Icon name={reviewStatus[reviewNode.state].icon} />
                    {reviewStatus[reviewNode.state].text}
                  </Label>
                </Segment>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={7}>
                <Segment basic>
                  <Header as="h4" color="grey">
                    Validation Summary
                  </Header>
                  {reviewNode.validationResultset ? (
                    <Label.Group>
                      <Label
                        as="a"
                        onClick={() => {
                          history.push(
                            `/study/${match.params.kfId}/reviews/${reviewNode.kfId}/validation`,
                          );
                        }}
                      >
                        <Icon name="check circle" color="green" />
                        {reviewNode.validationResultset.passed} Passed
                      </Label>
                      <Label
                        as="a"
                        onClick={() => {
                          history.push(
                            `/study/${match.params.kfId}/reviews/${reviewNode.kfId}/validation`,
                          );
                        }}
                      >
                        <Icon name="times circle" color="red" />
                        {reviewNode.validationResultset.failed} Failed
                      </Label>
                      <Label
                        as="a"
                        onClick={() => {
                          history.push(
                            `/study/${match.params.kfId}/reviews/${reviewNode.kfId}/validation`,
                          );
                        }}
                      >
                        <Icon name="warning circle" color="yellow" />
                        {reviewNode.validationResultset.didNotRun} Did Not Run
                      </Label>
                    </Label.Group>
                  ) : (
                    <>
                      {['in_review', 'awaiting_updates'].includes(
                        reviewNode.state,
                      ) && canStartValidation ? (
                        <>
                          {validationRunState === 'running' ? (
                            <Label
                              as="a"
                              color="blue"
                              onClick={() => {
                                history.push(
                                  `/study/${match.params.kfId}/reviews/${reviewNode.kfId}/validation`,
                                );
                              }}
                            >
                              <Icon loading name="spinner" />
                              Running Validation
                            </Label>
                          ) : (
                            <Label
                              as="a"
                              color="blue"
                              onClick={() => {
                                history.push(
                                  `/study/${match.params.kfId}/reviews/${reviewNode.kfId}/validation`,
                                );
                              }}
                            >
                              <Icon name="clipboard check" />
                              Click to Start Validation
                            </Label>
                          )}
                        </>
                      ) : (
                        <Label>No data validation report created</Label>
                      )}
                    </>
                  )}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Segment basic className="noMargin">
            <ReviewDescription
              reviewNode={reviewNode}
              updateReview={updateReview}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column
          tablet={3}
          computer={2}
          only="tablet computer"
          className="noPadding"
        >
          <ActionButtons
            {...{
              reviewNode,
              updateReview,
              awaitReview,
              approveReview,
              closeReview,
              reopenReview,
              awaitError,
              approveError,
              closeError,
              reopenError,
              vertical: true,
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="noVerticalPadding">
        <Grid.Column mobile={16} tablet={16} computer={14} className="pl-0">
          <ReviewVersions
            studyId={match.params.kfId}
            reviewNode={reviewNode}
            updateReview={updateReview}
            setAddFileOpen={setAddFileOpen}
            downloadFileMutation={downloadFileMutation}
            updateError={updateError}
            canAddFile={canAddFile}
          />
          <Segment basic className="noMargin">
            <Header as="h4" color="grey">
              Timeline{' '}
              <span className="text-10 text-normal">
                (latest first, most recent 20 events)
              </span>
            </Header>
            {reviewNode.events && (
              <ReviewTimelines
                eventData={reviewNode.events}
                downloadFileMutation={null}
              />
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withRouter(ReviewDetail);
