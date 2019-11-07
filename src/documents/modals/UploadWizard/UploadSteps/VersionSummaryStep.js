import React from 'react';
import PropTypes from 'prop-types';
import {LogOnMount} from '@amplitude/react-amplitude';
import {AmplitudeProxy} from '../../../../analyticsTracking';
import {Header, Icon, Divider, Grid, Segment, Form} from 'semantic-ui-react';

/**
 * Step 2 in multi-step upload modal.
 * Describes a creates a document version
 */
const VersionSummaryStep = ({
  fileToUpdate,
  file,
  setDescription,
  trackingProperties,
}) => {
  return (
    <AmplitudeProxy eventProperties={trackingProperties}>
      {({logEvent, EVENT_CONSTANTS: {UPLOAD_WIZARD_}}) => (
        <>
          <Segment size="mini" basic>
            <LogOnMount
              eventType={`${UPLOAD_WIZARD_.STEP}_2`}
              eventProperties={{
                ...trackingProperties,
                document_to_update: {
                  document_name: fileToUpdate.name,
                  type: fileToUpdate.fileType,
                  kfId: fileToUpdate.kfId,
                  similarity_rating: fileToUpdate.rating,
                  num_previous_versions: fileToUpdate.versions.edges.length,
                },
              }}
            />
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
              Help keep track of your document history by telling us what may
              have changed in this version
            </h5>
            <Form>
              <Form.Field required focus>
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
      )}
    </AmplitudeProxy>
  );
};

VersionSummaryStep.propTypes = {
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Existing file node from study */
  fileToUpdate: PropTypes.object.isRequired,
};

export default VersionSummaryStep;
