import {ALL_DATA_REVIEWS, GET_STUDY_BY_ID} from '../../state/queries';
import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment
} from 'semantic-ui-react';
import {ContentState, EditorState, convertToRaw} from 'draft-js';
import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';

import {CREATE_DATA_REVIEW} from '../../state/mutations';
import {Formik} from 'formik';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import MarkdownEditor from '../components/FileDetail/MarkdownEditor';
import NotFoundView from '../../views/NotFoundView';
import {draftToMarkdown} from 'markdown-draft-js';

/**
 * Review screen for initiate data review process
 */
const StartReviewView = ({
  match: {
    params: {kfId},
  },
  history,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText('')),
  );
  const [reviewDesc, setReviewDesc] = useState('');

  const {data: reviewsData} = useQuery(ALL_DATA_REVIEWS, {
    variables: {
      studyKfId: kfId,
    },
  });
  const allReviews = reviewsData && reviewsData.allDataReviews.edges;
  const existNames =
    allReviews && allReviews.length > 0
      ? allReviews.map(({node}) => node.name)
      : [];

  const [
    createDataReview,
    {loading: creationLoading, error: creationError},
  ] = useMutation(CREATE_DATA_REVIEW, {
    refetchQueries: [
      {
        query: ALL_DATA_REVIEWS,
        variables: {
          studyKfId: kfId,
        },
      },
    ],
  });

  // Study query, includes documents
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + kfId).toString('base64'),
    },
  });
  const study = data && data.study;
  const files = !loading && study ? study.files.edges : [];

  if (!loading && study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${kfId}`}
      />
    );
  }

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study reviews - Error ${
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
          {`KF Data Tracker - Study reviews ${
            study ? 'for ' + study.name : null
          }`}
        </title>
      </Helmet>
      <Link to={`/study/${kfId}/reviews`} data-testid="back-to-filelist">
        <Button
          basic
          size="mini"
          labelPosition="left"
          floated="left"
          className="mt-6 mb-5"
        >
          <Icon name="arrow left" />
          All Reviews
        </Button>
      </Link>
      <Formik
        initialValues={{
          review_title: '',
          review_desc: '',
        }}
        validate={vals => {
          let errors = {};
          if (!vals.review_title) {
            errors.review_title = 'Required';
          }
          if (existNames.includes(vals.review_title)) {
            errors.review_title = 'This name is used.';
          }
          if (reviewDesc.length < 3) {
            errors.review_desc = 'Required';
          }
          return errors;
        }}
        onSubmit={values => {
          const rawState = convertToRaw(editorState.getCurrentContent());
          const mdText = draftToMarkdown(rawState);
          var submitValue = values;
          submitValue.review_desc = mdText;
          createDataReview({
            variables: {
              input: {
                name: values.review_title,
                description: values.review_desc,
                study: study.id,
                versions: [],
              },
            },
          })
            .then(resp => {
              const drId = resp.data.createDataReview.dataReview.kfId;
              history.push(`/study/${kfId}/reviews/${drId}`);
            })
            .catch(err => {
              console.log(err);
            });
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          validateForm,
        }) => (
          <>
            <Grid.Row>
              <Grid.Column width={6}>
                <Header as="h2" className="noMargin">
                  Start a New Data Review
                </Header>
                <p>Tell us any additional details about this review</p>
              </Grid.Column>
              {files.length > 0 && (
                <Grid.Column width={10} verticalAlign="bottom">
                  <Button
                    disabled={
                      !values.review_title ||
                      !draftToMarkdown(
                        convertToRaw(editorState.getCurrentContent()),
                      ) ||
                      creationError
                    }
                    loading={creationLoading}
                    compact
                    color="teal"
                    floated="right"
                    size="large"
                    icon="save"
                    content="Save Review"
                    as="label"
                    type="submit"
                    onClick={handleSubmit}
                  />
                  <Button
                    compact
                    floated="right"
                    size="large"
                    icon="cancel"
                    content="Cancel"
                    as="label"
                    onClick={() => history.push(`/study/${kfId}/reviews/`)}
                  />
                </Grid.Column>
              )}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form onSubmit={handleSubmit}>
                  <Form.Field
                    required
                    error={
                      errors.review_title && errors.review_title.length > 0
                    }
                  >
                    <label htmlFor="review_title">Title:</label>
                    <input
                      className={
                        touched.review_title && errors.review_title
                          ? 'border-red'
                          : null
                      }
                      type="text"
                      name="review_title"
                      value={values.review_title}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    {errors.review_title && (
                      <span className="text-red">{errors.review_title}</span>
                    )}
                  </Form.Field>
                  <Form.Field required>
                    <label>Description:</label>
                    <Segment
                      color={
                        touched.review_desc && errors.review_desc ? 'red' : null
                      }
                    >
                      <MarkdownEditor
                        editorState={editorState}
                        onEditorStateChange={e => {
                          setEditorState(e);
                          setFieldTouched('review_desc');
                          validateForm();
                          const rawState = convertToRaw(e.getCurrentContent());
                          const mdText = draftToMarkdown(rawState);
                          setReviewDesc(mdText);
                        }}
                      />
                    </Segment>
                  </Form.Field>
                </Form>
                {creationError && (
                  <Message
                    negative
                    icon="warning circle"
                    header="Error in creating data review"
                    content={creationError.message}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </>
        )}
      </Formik>
    </Grid>
  );
};

export default StartReviewView;
