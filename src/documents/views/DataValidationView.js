import {
  CANCEL_VALIDATION_RUN,
  START_VALIDATION_RUN,
} from '../../state/mutations';
import {
  Container,
  Dimmer,
  Grid,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import {DATA_REVIEW, GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {useMutation, useQuery} from '@apollo/client';

import DataValidation from '../components/DataValidation/DataValidation';
import {FILE_DOWNLOAD_URL} from '../mutations';
import {Helmet} from 'react-helmet';
import NotFoundView from '../../views/NotFoundView';
import React from 'react';
import {hasPermission} from '../../common/permissions';

/**
 * Data validation screen for study document review process
 */
const DataValidationView = ({
  match: {
    params: {kfId, reviewId},
  },
  history,
}) => {
  // Study query, includes documents
  const {data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + kfId).toString('base64'),
    },
  });
  const study = studyData && studyData.study;

  // Query for user
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

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
      fetchPolicy: 'cache-first',
    },
  );
  const review = data && data.dataReview;

  const [startValidationRun] = useMutation(START_VALIDATION_RUN, {
    refetchQueries: [
      {
        query: DATA_REVIEW,
        variables: {
          id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
        },
      },
    ],
  });

  const [cancelValidationRun] = useMutation(CANCEL_VALIDATION_RUN, {
    refetchQueries: [
      {
        query: DATA_REVIEW,
        variables: {
          id: Buffer.from('DataReviewNode:' + reviewId).toString('base64'),
        },
      },
    ],
  });

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
        <DataValidation
          reviewNode={review}
          downloadFileMutation={downloadFileMutation}
          startValidationRun={startValidationRun}
          cancelValidationRun={cancelValidationRun}
          allowViewReview={allowViewReview}
          allowStartValidation={allowStartValidation}
          startPolling={startPolling}
          stopPolling={stopPolling}
        />
      )}
    </Grid>
  );
};

export default DataValidationView;
