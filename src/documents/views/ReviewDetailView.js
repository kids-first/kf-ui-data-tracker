import {
  ALL_DATA_REVIEWS,
  DATA_REVIEW,
  GET_STUDY_BY_ID,
  MY_PROFILE,
} from '../../state/queries';
import {
  APPROVE_DATA_REVIEW,
  AWAIT_DATA_REVIEW,
  CLOSE_DATA_REVIEW,
  REOPEN_DATA_REVIEW,
  UPDATE_DATA_REVIEW,
} from '../../state/mutations';
import {
  Button,
  Container,
  Dimmer,
  Grid,
  Loader,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';

import {FILE_DOWNLOAD_URL} from '../mutations';
import {Helmet} from 'react-helmet';
import NotFoundView from '../../views/NotFoundView';
import ReviewDetail from '../components/ReviewDetail/ReviewDetail';
import ReviewFileSection from '../components/ReviewFiles/ReviewFileSection';
import {hasPermission} from '../../common/permissions';

/**
 * Review screen for study document review process
 */
const ReviewDetailView = ({
  match: {
    params: {kfId, reviewId},
  },
  history,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [addFileOpen, setAddFileOpen] = useState(false);
  const [addFileError, setAddFileError] = useState('');

  // Study query, includes documents
  const {data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + kfId).toString('base64'),
    },
  });
  const study = studyData && studyData.study;
  const files = study ? study.files.edges : [];
  // Query for user
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowChangeReview =
    myProfile && hasPermission(myProfile, 'change_datareview');
  const allowViewReview =
    myProfile && hasPermission(myProfile, 'view_datareview');
  const allowStartValidation =
    myProfile && hasPermission(myProfile, 'add_validationrun');

  const [downloadFileMutation] = useMutation(FILE_DOWNLOAD_URL);

  const {loading, data, error, startPolling, stopPolling} = useQuery(
    DATA_REVIEW,
    {
      variables: {
        id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
      },
      fetchPolicy: 'network-only',
    },
  );
  const review = data && data.dataReview;
  const addedFiles = review
    ? review.versions.edges.map(({node}) => node.rootFile.kfId)
    : [];
  const validationRun =
    review &&
    review.validationRuns.edges.length > 0 &&
    review.validationRuns.edges[review.validationRuns.edges.length - 1].node;
  const validationRunState = validationRun && validationRun.state;
  const result = review && review.validationResultset;
  const validationState = !allowViewReview
    ? 'invalid'
    : result
    ? 'completed'
    : validationRunState
    ? validationRunState
    : 'not_started';

  const {data: reviewsData} = useQuery(ALL_DATA_REVIEWS, {
    variables: {
      studyKfId: kfId,
    },
  });
  const allReviews = reviewsData && reviewsData.allDataReviews.edges;

  const [updateReview, {error: updateError}] = useMutation(UPDATE_DATA_REVIEW, {
    refetchQueries: [
      {
        query: ALL_DATA_REVIEWS,
        variables: {
          studyKfId: kfId,
        },
      },
    ],
  });
  const [awaitReview, {error: awaitError}] = useMutation(AWAIT_DATA_REVIEW, {
    refetchQueries: [
      {
        query: DATA_REVIEW,
        variables: {
          id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
        },
      },
    ],
  });
  const [approveReview, {error: approveError}] = useMutation(
    APPROVE_DATA_REVIEW,
    {
      refetchQueries: [
        {
          query: DATA_REVIEW,
          variables: {
            id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
          },
        },
      ],
    },
  );
  const [closeReview, {error: closeError}] = useMutation(CLOSE_DATA_REVIEW, {
    refetchQueries: [
      {
        query: DATA_REVIEW,
        variables: {
          id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
        },
      },
    ],
  });
  const [reopenReview, {error: reopenError}] = useMutation(REOPEN_DATA_REVIEW, {
    refetchQueries: [
      {
        query: DATA_REVIEW,
        variables: {
          id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
        },
      },
    ],
  });

  useEffect(() => {
    if (validationState === 'running') {
      startPolling(1000);
    }
    if (result) {
      stopPolling();
    }
  }, [result, validationState, startPolling, stopPolling]);

  if (!loading && review === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${kfId}`}
      />
    );
  }

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading Data Review Details ...</Loader>
      </Dimmer>
    );

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study review detail - Error ${
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

  if (!allowViewReview)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study review detail - Error ${
              study ? 'for ' + study.kfId : null
            }`}
          </title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Not allowed"
          content="You don't have access to view this data review."
        />
      </Container>
    );
  return (
    <Grid as={Segment} basic container columns={1}>
      <Helmet>
        <title>
          {`KF Data Tracker - Study review detail ${
            study ? 'for ' + study.name : null
          }`}
        </title>
      </Helmet>
      {review && (
        <ReviewDetail
          reviewNode={review}
          updateReview={allowChangeReview && updateReview}
          awaitReview={awaitReview}
          approveReview={approveReview}
          closeReview={closeReview}
          reopenReview={reopenReview}
          updateError={updateError}
          awaitError={awaitError}
          approveError={approveError}
          closeError={closeError}
          reopenError={reopenError}
          allReviews={allReviews}
          setAddFileOpen={setAddFileOpen}
          downloadFileMutation={downloadFileMutation}
          canAddFile={
            files.filter(({node}) => !addedFiles.includes(node.kfId)).length >
              0 &&
            review.state !== 'completed' &&
            review.state !== 'closed' &&
            allowChangeReview
          }
          canStartValidation={allowStartValidation}
          validationRunState={validationRunState}
        />
      )}
      <Modal
        open={addFileOpen}
        onClose={() => setAddFileOpen(false)}
        closeIcon
        closeOnDocumentClick
      >
        <Modal.Header>Add documents to current data review</Modal.Header>
        <Modal.Content>
          <ReviewFileSection
            files={files.filter(({node}) => !addedFiles.includes(node.kfId))}
            studyId={kfId}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
        </Modal.Content>
        <Modal.Actions>
          {addFileError && <span className="text-red">{addFileError}</span>}
          <Button
            onClick={() => {
              setAddFileOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            disabled={selectedFiles.length === 0 || addFileError.length > 0}
            onClick={() => {
              const addedVersions = review
                ? review.versions.edges.map(({node}) => node.id)
                : [];
              updateReview({
                variables: {
                  id: review.id,
                  input: {
                    name: review.name,
                    description: review.descrition,
                    versions: addedVersions.concat(selectedFiles),
                  },
                },
              })
                .then(() => {
                  setSelectedFiles([]);
                  setAddFileOpen(false);
                })
                .catch(err => setAddFileError(err.message));
            }}
          >
            Add
          </Button>
        </Modal.Actions>
      </Modal>
    </Grid>
  );
};

export default ReviewDetailView;
