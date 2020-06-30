import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Header, Icon, Grid, Segment, Divider} from 'semantic-ui-react';

/**
 * Step 1 in multi-step upload proess to choose whether to
 * create a new document or a new document version
 */

const ChooseMethodStep = ({
  file,
  history,
  setStep,
  allowUploadFile,
  allowUploadVersion,
}) => (
  <Segment placeholder>
    <Grid columns={2} stackable textAlign="center">
      <Divider vertical>Or</Divider>

      <Grid.Row verticalAlign="middle">
        <Grid.Column>
          <Header icon disabled={!allowUploadVersion}>
            {' '}
            <Icon name="copy" /> Update to Existing Document
            <Header.Subheader as="p">
              This is a new version of a previously uploaded document.
            </Header.Subheader>
          </Header>
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [
                    ...inheritedProps.scope,
                    'button',
                    'update existing document',
                  ]
                : ['button', 'update existing document'],
            })}
          >
            {({logEvent}) => (
              <Button
                disabled={!allowUploadVersion}
                data-testid="update-existing-button"
                primary
                onClick={() => {
                  logEvent('click');
                  setStep(1);
                }}
              >
                Update Existing Document
              </Button>
            )}
          </Amplitude>
        </Grid.Column>

        <Grid.Column>
          <Header icon disabled={!allowUploadFile}>
            {' '}
            <Icon name="file" /> New Study Document
            <Header.Subheader as="p">
              This document has not previously been provided uploaded.
            </Header.Subheader>
          </Header>
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'create new document']
                : ['button', 'create new document'],
            })}
          >
            {({logEvent}) => (
              <Button
                disabled={!allowUploadFile}
                primary
                onClick={() => {
                  logEvent('click');
                  history.push('documents/new-document', {file});
                }}
              >
                Create New Document
              </Button>
            )}
          </Amplitude>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

ChooseMethodStep.propTypes = {
  /** The file that the document is being created or updated for */
  file: PropTypes.object.isRequired,
  /** Function to advance multi-step modal to the next step  */
  setStep: PropTypes.func.isRequired,
  /** React-router hisotry object  */
  history: PropTypes.any,
};

const TrackedChooseMethod = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'choose method step']
        : ['choose method step'],
    })}
  >
    <ChooseMethodStep {...props} />
  </Amplitude>
);

export default TrackedChooseMethod;
