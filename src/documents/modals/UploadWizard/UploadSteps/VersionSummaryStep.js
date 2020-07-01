import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Icon, Divider, Grid, Segment, Form} from 'semantic-ui-react';

/**
 * Step 2 in multi-step upload modal.
 * Describes a creates a document version
 */
const VersionSummaryStep = ({fileToUpdate, file, setDescription}) => {
  return (
    <>
      <Segment size="mini" basic>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>with</Divider>
          <Grid.Row>
            <Grid.Column>
              <Header icon>
                {' '}
                <Icon name="copy" /> Update Document:
                <Header.Subheader>{fileToUpdate.name}</Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                {' '}
                <Icon name="upload cloud" /> Uploaded Document:
                <Header.Subheader>{file.name}</Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment color="blue" raised>
        <h5>
          <Icon name="pencil" />
          Help keep track of your document history by telling us what may have
          changed in this version
        </h5>
        <Form>
          <Form.Field required>
            <label>Summarize Document Changes:</label>
            <Form.TextArea
              tabIndex="1"
              data-testid="description-input"
              name="description"
              type="text"
              onChange={ev => setDescription(ev.target.value)}
            />
          </Form.Field>
        </Form>
      </Segment>
    </>
  );
};

VersionSummaryStep.propTypes = {
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Existing file node from study */
  fileToUpdate: PropTypes.object.isRequired,
};

const TrackedVersionSummary = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'version summary step']
        : ['version summary step'],
    })}
  >
    <VersionSummaryStep {...props} />
  </Amplitude>
);

export default TrackedVersionSummary;
