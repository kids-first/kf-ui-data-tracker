import {
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';
import React, {useState} from 'react';

import {Amplitude} from '@amplitude/react-amplitude';
import FlatFile from '../../components/FlatFile/FlatFile';

const NewExperienceStep = ({
  createVersion,
  flatfileSettings,
  handleSave,
  source,
  onUploading,
  fileName,
}) => {
  const [overwriteOld, setOverwriteOld] = useState(false);
  const [mappedData, setMappedData] = useState(null);

  return (
    <Container as={Segment} basic>
      <Grid>
        <Grid.Column width={8} textAlign="center" verticalAlign="middle">
          <Header as="h3" icon>
            <Icon
              circular
              inverted
              size="huge"
              color="blue"
              name="file alternate outline"
            />
            Finish Upload
            <Header.Subheader>
              Skip mapping and submit the file now.
            </Header.Subheader>
          </Header>
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'button', 'upload button']
                : ['button', 'upload button'],
            })}
          >
            {({logEvent}) => (
              <Button
                primary
                data-testid="new-file-submit"
                labelPosition="right"
                icon="upload"
                content="Upload"
                disabled={onUploading}
                onClick={() => {
                  logEvent('click');
                  handleSave(overwriteOld, 'directSubmit');
                }}
              />
            )}
          </Amplitude>
        </Grid.Column>
        <Grid.Column width={8} textAlign="center" verticalAlign="middle">
          <Header as="h3" icon>
            <Icon circular inverted size="huge" color="violet" name="table" />
            Map and Edit
            <Header.Subheader>
              Try new file mapping and inline editing experience.
            </Header.Subheader>
          </Header>
          {mappedData ? (
            <>
              <Checkbox
                className="mr-14"
                label={{children: 'Discard original file?'}}
                checked={overwriteOld}
                onChange={() => setOverwriteOld(!overwriteOld)}
              />
              <Amplitude
                eventProperties={inheritedProps => ({
                  ...inheritedProps,
                  scope: inheritedProps.scope
                    ? [...inheritedProps.scope, 'button', 'upload button']
                    : ['button', 'upload button'],
                })}
              >
                {({logEvent}) => (
                  <Button
                    color="violet"
                    labelPosition="right"
                    icon="upload"
                    content="Submit"
                    type="button"
                    disabled={onUploading}
                    onClick={() => {
                      logEvent('click');
                      handleSave(overwriteOld, mappedData);
                    }}
                  />
                )}
              </Amplitude>
            </>
          ) : (
            <FlatFile
              flatfileSettings={flatfileSettings}
              dataSource={source}
              setMappedData={setMappedData}
              fileName={fileName}
            />
          )}
        </Grid.Column>
      </Grid>
      <Divider vertical>Or</Divider>
    </Container>
  );
};

export default NewExperienceStep;
