import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Message,
  Segment,
  Table,
} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import React, {useEffect, useState} from 'react';

import Markdown from 'react-markdown';
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
  const validationRun =
    reviewNode &&
    reviewNode.validationRuns.edges.length > 0 &&
    reviewNode.validationRuns.edges[reviewNode.validationRuns.edges.length - 1]
      .node;
  const validationRunState = validationRun && validationRun.state;
  const result = reviewNode.validationResultset;
  const validationState = !allowViewReview
    ? 'invalid'
    : result
    ? 'completed'
    : validationRunState
    ? validationRunState
    : 'not_started';

  const [hasReport, setHasReport] = useState(validationState);
  const [report, setReport] = useState('');
  const [validationError, setValidationError] = useState('');

  const studyId = match.params.kfId;

  useEffect(() => {
    if (validationRunState === 'failed') {
      stopPolling();
      setHasReport('failed');
    }
    if (result) {
      stopPolling();
      setHasReport('completed');
      const downloadURL = result.downloadReportUrl;

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
  }, [result, hasReport, validationRunState, startPolling, stopPolling]);

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
      {hasReport === 'completed' ? (
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
            {hasReport ? (
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
            {hasReport === 'not_started' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="clipboard check" />
                  No data validation report created
                </Header>
                {allowStartValidation && (
                  <Button
                    primary
                    onClick={() => {
                      setHasReport('running');
                      startValidationRun({
                        variables: {
                          input: {
                            dataReview: reviewNode.id,
                          },
                        },
                      })
                        .then(resp => {
                          startPolling(10000);
                        })
                        .catch(err => {
                          setHasReport('not_started');
                          setValidationError(err.message);
                        });
                    }}
                  >
                    Run Validation
                  </Button>
                )}
              </Segment>
            )}
            {hasReport === 'running' && (
              <Segment placeholder>
                <Header icon>
                  <Icon loading name="spinner" />
                  Running data validation, this may take several minutes
                </Header>
                <Button
                  negative
                  onClick={() => {
                    // setHasReport('canceled');
                    cancelValidationRun({
                      variables: {
                        id: validationRun.id,
                      },
                    })
                      .then(resp => {
                        startPolling(1000);
                      })
                      .catch(err => {
                        setHasReport('failed');
                        setValidationError(err.message);
                      });
                  }}
                >
                  Cancel Validation
                </Button>
              </Segment>
            )}
            {hasReport === 'failed' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="x" />
                  Failed to run validation report.
                </Header>
                {allowStartValidation && (
                  <Button
                    primary
                    onClick={() => {
                      setHasReport('running');
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
                          setHasReport('not_started');
                          setValidationError(err.message);
                        });
                    }}
                  >
                    Run Again
                  </Button>
                )}
              </Segment>
            )}
            {hasReport === 'invalid' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="dont" />
                  No data validation report available for this data review
                </Header>
              </Segment>
            )}
            {hasReport === 'canceled' && (
              <Segment placeholder>
                <Header icon>
                  <Icon name="dont" />
                  Canceled
                </Header>
                {allowStartValidation && (
                  <Button
                    primary
                    onClick={() => {
                      setHasReport('running');
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
                          setHasReport('not_started');
                          setValidationError(err.message);
                        });
                    }}
                  >
                    Run Again
                  </Button>
                )}
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default withRouter(DataValidation);
