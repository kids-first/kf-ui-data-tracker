import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Message,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import React, {useEffect, useState} from 'react';

import {Amplitude} from '@amplitude/react-amplitude';
import Markdown from 'react-markdown';
import {dateCompare} from '../../utilities';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {longDate} from '../../../common/dateUtils';

/**
 * Form to display data review details
 */
const DataValidation = ({
  reviewNode,
  history,
  match,
  downloadFileMutation,
  allowViewReview,
  allowStartValidation,
  startValidationRun,
  cancelValidationRun,
  startPolling,
  stopPolling,
}) => {
  const [report, setReport] = useState('');
  const [validationError, setValidationError] = useState('');

  const studyId = match.params.kfId;
  const validationRun =
    reviewNode &&
    reviewNode.validationRuns.edges.length > 0 &&
    [...reviewNode.validationRuns.edges].sort(dateCompare)[0].node;
  const validationRunState = validationRun && validationRun.state;
  const result = reviewNode.validationResultset;
  const validationState = !allowViewReview
    ? 'invalid'
    : validationRunState
    ? validationRunState
    : 'not_started';

  useEffect(() => {
    if (
      validationRunState === 'running' ||
      validationRunState === 'canceling'
    ) {
      startPolling(1000);
    }
    if (validationRunState === 'failed' || validationRunState === 'canceled') {
      stopPolling();
    }
    if (result && validationRunState === 'completed') {
      stopPolling();
      const downloadURL = result.downloadReportUrl;
      if (downloadURL) {
        fetch(downloadURL, {
          headers: new Headers({
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          }),
        })
          .then(function(res) {
            if (!res.ok) throw new Error('Failed to fetch the document');
            return res.text();
          })
          .then(function(res) {
            setReport(res);
          });
      }
    }
  }, [result, validationRunState, startPolling, stopPolling]);

  return (
    <Grid className="mb-50 pr-0" style={{width: '100%'}}>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={14}>
          <Link to={`/study/${studyId}/reviews/${reviewNode.kfId}`}>
            <Button basic size="mini" labelPosition="left" floated="left">
              <Icon name="arrow left" />
              Back to Data Review
            </Button>
          </Link>
          <Header as="h2" className="pt-10">
            {reviewNode.name}
          </Header>
        </Grid.Column>
      </Grid.Row>
      {validationError && (
        <Message
          className="ml-15"
          negative
          icon="warning circle"
          header="Error"
          content={validationError}
        />
      )}
      {validationState === 'completed' && result ? (
        <Grid.Row className="noVerticalPadding" reversed="computer">
          <Grid.Column
            tablet={3}
            computer={2}
            mobile={16}
            className="noPadding"
          >
            <Menu vertical secondary fluid>
              {reviewNode.creator && (
                <>
                  <Menu.Item header as="h4" className="text-grey noMargin">
                    Creator
                  </Menu.Item>
                  <Menu.Item>
                    <Image
                      className="small-avatar"
                      src={reviewNode.creator.picture || defaultAvatar}
                      avatar
                    />
                    {reviewNode.creator.displayName ||
                      reviewNode.creator.username}
                  </Menu.Item>
                </>
              )}
              {result.createdAt && (
                <>
                  <Menu.Item header as="h4" className="text-grey noMargin">
                    Timestamp
                  </Menu.Item>
                  <Menu.Item>{longDate(result.createdAt)}</Menu.Item>
                </>
              )}
              {allowStartValidation && (
                <>
                  <Menu.Item header as="h4" className="text-grey noMargin">
                    Actions
                  </Menu.Item>
                  <Amplitude
                    eventProperties={inheritedProps => ({
                      ...inheritedProps,
                      scope: inheritedProps.scope
                        ? [
                            ...inheritedProps.scope,
                            'button',
                            'rerun validation button',
                          ]
                        : ['button', 'rerun validation button'],
                    })}
                  >
                    {({logEvent}) => (
                      <Popup
                        content="Re-run data validation"
                        position="left center"
                        inverted
                        trigger={
                          <Menu.Item
                            onClick={() => {
                              logEvent('click');
                              startValidationRun({
                                variables: {
                                  input: {
                                    dataReview: reviewNode.id,
                                  },
                                },
                              })
                                .then(resp => {
                                  startPolling(1000);
                                })
                                .catch(err => {
                                  setValidationError(err.message);
                                });
                            }}
                          >
                            <Icon name="repeat" />
                            Re-Run
                          </Menu.Item>
                        }
                      />
                    )}
                  </Amplitude>
                </>
              )}
            </Menu>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={13} computer={14} className="pt-10">
            <Header as="h4" color="grey" className="pb-5">
              Summary
            </Header>
            <Grid stackable columns={3}>
              <Grid.Column>
                <Header as="h4" textAlign="center">
                  <Icon name="check circle" color="green" />
                  <Header.Content>{result.passed} Checks Passed</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4" textAlign="center">
                  <Icon name="times circle" color="red" />
                  <Header.Content>{result.failed} Checks Failed</Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4" textAlign="center">
                  <Icon name="warning circle" color="yellow" />
                  <Header.Content>
                    {result.didNotRun} Checks Did Not Run
                  </Header.Content>
                </Header>
              </Grid.Column>
            </Grid>
            <Header as="h4" color="grey" className="pb-5">
              Validation Report
            </Header>
            {report ? (
              <Segment basic secondary className="x-scroll h-500-container">
                <Markdown
                  source={report}
                  renderers={{
                    image: Image,
                    table: props => <Table>{props.children}</Table>,
                  }}
                  linkTarget="_blank"
                />
              </Segment>
            ) : (
              <Segment basic secondary placeholder>
                <Header icon as="h4" disabled>
                  <Icon name="clipboard outline" />
                  No data validation report available
                </Header>
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      ) : (
        <Grid.Row className="noVerticalPadding">
          <Grid.Column className="pr-0 pt-20">
            {validationState === 'not_started' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="clipboard check" />
                  No data validation report created
                </Header>
                {allowStartValidation && (
                  <Button
                    primary
                    onClick={() => {
                      startValidationRun({
                        variables: {
                          input: {
                            dataReview: reviewNode.id,
                          },
                        },
                      })
                        .then(resp => {
                          startPolling(1000);
                        })
                        .catch(err => {
                          setValidationError(err.message);
                        });
                    }}
                  >
                    Run Validation
                  </Button>
                )}
              </Segment>
            )}
            {['initializing', 'running', 'canceling'].includes(
              validationState,
            ) && (
              <Segment placeholder>
                <Header icon>
                  <Icon loading name="spinner" />
                  {validationState === 'canceling' ? 'Canceling ' : 'Running '}
                  data validation, this may take several minutes
                </Header>
                <Button
                  negative
                  disabled={validationState === 'canceling'}
                  onClick={() => {
                    cancelValidationRun({
                      variables: {
                        id: validationRun.id,
                      },
                    })
                      .then(resp => {
                        startPolling(1000);
                      })
                      .catch(err => {
                        setValidationError(err.message);
                      });
                  }}
                >
                  Cancel Validation
                </Button>
              </Segment>
            )}
            {['failed', 'canceled'].includes(validationState) && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="x" />
                  Data validation run {validationState}
                  {validationRun.errorMsg && (
                    <Header.Subheader>
                      {validationRun.errorMsg}
                    </Header.Subheader>
                  )}
                </Header>
                {allowStartValidation && (
                  <Button
                    primary
                    onClick={() => {
                      startValidationRun({
                        variables: {
                          input: {
                            dataReview: reviewNode.id,
                          },
                        },
                      })
                        .then(resp => {
                          startPolling(1000);
                        })
                        .catch(err => {
                          setValidationError(err.message);
                        });
                    }}
                  >
                    Run Again
                  </Button>
                )}
              </Segment>
            )}
            {validationState === 'invalid' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="dont" />
                  No data validation report available for this data review
                </Header>
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default withRouter(DataValidation);
