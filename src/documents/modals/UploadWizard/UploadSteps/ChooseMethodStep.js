import React from 'react';
import PropTypes from 'prop-types';
import {LogOnMount} from '@amplitude/react-amplitude';
import {AmplitudeProxy} from '../../../../analyticsTracking';
import {Button, Header, Icon, Grid, Segment, Divider} from 'semantic-ui-react';

/**
 * Step 1 in multi-step upload proess to choose whether to
 * create a new document or a new document version
 */

const ChooseMethodStep = ({file, history, setStep, trackingProperties}) => (
  <AmplitudeProxy eventProperties={trackingProperties}>
    {({buttonTracking, EVENT_CONSTANTS: {UPLOAD_WIZARD_}}) => (
      <Segment placeholder>
        <LogOnMount
          eventType={`${UPLOAD_WIZARD_.STEP}_0`}
          eventProperties={trackingProperties}
        />
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>Or</Divider>

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <Header icon>
                <Icon name="copy" /> Update to Existing Document
                <Header.Subheader as="p">
                  This is a new version of a previously uploaded document.
                </Header.Subheader>
              </Header>
              <Button
                datavfsary
                {...buttonTracking(
                  'Update Existing Document',
                  null,
                  null,
                  'Update Existing Document',
                )}
                onClick={() => {
                  buttonTracking(
                    'Update Existing Document',
                    null,
                    null,
                    'Update Existing Document',
                  ).onClick();
                  setStep(1);
                }}
              >
                Update Existing Document
              </Button>
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name="file" /> New Study Document
                <Header.Subheader as="p">
                  This document has not previously been provided uploaded.
                </Header.Subheader>
              </Header>
              <Button
                primary
                {...buttonTracking(
                  'Create New Document',
                  null,
                  {file},
                  'Create New Document',
                )}
                onClick={() => {
                  buttonTracking(
                    'Create New Document',
                    null,
                    {file},
                    'Create New Document',
                  ).onClick();
                  history.push('documents/new-document', {file});
                }}
              >
                Create New Document
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )}
  </AmplitudeProxy>
);

ChooseMethodStep.propTypes = {
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Function to advance multi-step modal to the next step  */
  setStep: PropTypes.func.isRequired,
  /** React-router hisotry object  */
  history: PropTypes.any,
};

export default ChooseMethodStep;
