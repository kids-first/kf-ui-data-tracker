import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';
import {formFile, processExcel} from '../../../common/treeDataUtils';

import {Amplitude} from '@amplitude/react-amplitude';
import FlatFile from '../FlatFile/FlatFile';
import documentText from '../../../assets/submit.png';

const NewExperienceStep = ({
  nextStep,
  previousStep,
  createVersion,
  updateVersion,
  saveDocument,
  createFlatfileSettings,
  selectedTemplate,
  version,
  history,
  match,
  values,
  isSubmitting,
  isValid,
  setSubmitting,
  setErrors,
  uploadedFile,
  mappedData,
  setMappedData,
}) => {
  const [flatfileSettings, setFlatfileSettings] = useState('');
  const [source, setSource] = useState(null);
  const [overwriteOld, setOverwriteOld] = useState(false);

  const studyKfid = match.params.kfId;

  if (uploadedFile) {
    const file = uploadedFile;
    var read = new FileReader();
    read.readAsBinaryString(file);
    read.onloadend = function() {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSource(processExcel(read.result));
      } else if (file.name.endsWith('.tsv') || file.name.endsWith('.csv')) {
        setSource(read.result);
      }
    };
  }

  useEffect(() => {
    if (flatfileSettings.length === 0) {
      createFlatfileSettings({
        variables: {
          templateVersions:
            selectedTemplate.length > 0 ? [selectedTemplate] : [],
        },
      })
        .then(resp => {
          if (resp.data.createFlatfileSettings.flatfileSettings) {
            setFlatfileSettings(
              resp.data.createFlatfileSettings.flatfileSettings,
            );
          }
        })
        .catch(err => {
          console.log(err);
          const errorMessage = err.message
            ? err.message
            : 'Problem creating flatfile settings';
          setFlatfileSettings('ERROR: ' + errorMessage);
        });
    }
  }, [createFlatfileSettings, flatfileSettings.length, selectedTemplate]);

  const handleSubmitNewDoc = () => {
    const fileName = version.fileName || 'data.csv';
    const file = formFile(fileName, mappedData);
    if (!overwriteOld) {
      saveDocument({
        variables: {
          version: version.id,
          study: Buffer.from('StudyNode:' + match.params.kfId).toString(
            'base64',
          ),
          name: values.file_name,
          fileType: selectedTemplate ? 'OTH' : values.file_type,
          description: values.file_desc,
          tags: [],
          templateVersion:
            selectedTemplate.length > 0 ? selectedTemplate : null,
        },
      })
        .then(resp => {
          createVersion({
            variables: {
              file: file,
              description: 'Mapped Version',
              fileId: resp.data.createFile.file.kfId,
            },
          })
            .then(() => {
              const fvId = resp.data.createFile.file.kfId;
              history.push(`/study/${studyKfid}/documents/${fvId}`);
              window.location.reload(false);
            })
            .catch(err => {
              setSubmitting(false);
              setErrors({all: err});
            });
        })
        .catch(err => {
          setSubmitting(false);
          setErrors({all: err});
        });
    } else {
      createVersion({
        variables: {
          file: file,
          description: 'Mapped Version',
          study: Buffer.from('StudyNode:' + match.params.kfId).toString(
            'base64',
          ),
        },
      })
        .then(resp => {
          saveDocument({
            variables: {
              version: resp.data.createVersion.version.id,
              study: Buffer.from('StudyNode:' + match.params.kfId).toString(
                'base64',
              ),
              name: values.file_name,
              fileType: selectedTemplate ? 'OTH' : values.file_type,
              description: values.file_desc,
              tags: [],
              templateVersion:
                selectedTemplate.length > 0 ? selectedTemplate : null,
            },
          })
            .then(resp => {
              const fvId = resp.data.createFile.file.kfId;
              history.push(`/study/${studyKfid}/documents/${fvId}`);
              window.location.reload(false);
            })
            .catch(err => {
              setSubmitting(false);
              setErrors({all: err});
            });
        })
        .catch(err => {
          setSubmitting(false);
          setErrors({all: err});
        });
    }
  };

  const handleSubmitNewVersion = () => {
    const fileName = version.fileName || 'data.csv';
    const file = formFile(fileName, mappedData);
    if (!overwriteOld) {
      updateVersion({
        variables: {
          versionId: version.kfId,
          document: values.doc.id,
          description: 'Original Version:  ' + values.file_desc,
          state: 'PEN',
        },
      })
        .then(() => {
          createVersion({
            variables: {
              file: file,
              description: 'Mapped Version:  ' + values.file_desc,
              fileId: values.doc.kfId,
            },
          })
            .then(resp => {
              history.push(`/study/${studyKfid}/documents/${values.doc.kfId}`);
              window.location.reload(false);
            })
            .catch(err => {
              setSubmitting(false);
              setErrors({all: err});
            });
        })
        .catch(err => {
          setSubmitting(false);
          setErrors({all: err});
        });
    } else {
      createVersion({
        variables: {
          file: file,
          description: 'Mapped Version:  ' + values.file_desc,
          fileId: values.doc.kfId,
        },
      })
        .then(resp => {
          history.push(`/study/${studyKfid}/documents/${values.doc.kfId}`);
          window.location.reload(false);
        })
        .catch(err => {
          setSubmitting(false);
          setErrors({all: err});
        });
    }
  };

  const handleSubmit = () => {
    if (values.upload_type === 'document') handleSubmitNewDoc();
    else if (values.upload_type === 'version') handleSubmitNewVersion();
  };

  return (
    <>
      <Grid.Row>
        <Grid.Column width={4}>
          <Image src={documentText} size="medium" centered rounded />
        </Grid.Column>
        <Grid.Column width={12} as={Segment} basic>
          <Grid>
            <Grid.Column width={8} textAlign="center" verticalAlign="middle">
              <Header as="h3" icon className="display-block">
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
                    content="Submit"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    loading={isSubmitting}
                    onClick={() => isValid && logEvent('click')}
                  />
                )}
              </Amplitude>
            </Grid.Column>
            <Grid.Column width={8} textAlign="center" verticalAlign="middle">
              <Header as="h3" icon>
                <Icon
                  circular
                  inverted
                  size="huge"
                  color="violet"
                  name="table"
                />
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
                        disabled={isSubmitting || !isValid}
                        loading={isSubmitting}
                        onClick={() => {
                          if (isValid) {
                            logEvent('click');
                            handleSubmit();
                          }
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
                  fileName={uploadedFile.name}
                />
              )}
            </Grid.Column>
          </Grid>
          <Divider vertical>Or</Divider>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16} textAlign="right">
          <Button content="Back" onClick={previousStep} />
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

export default NewExperienceStep;
