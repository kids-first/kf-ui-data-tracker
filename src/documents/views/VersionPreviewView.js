import React, {useState, useEffect, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {GET_FILE_BY_ID} from '../queries';
import {fileSortedVersions} from '../utilities';
import {
  Button,
  Container,
  Header,
  Message,
  Segment,
  Popup,
  Grid,
  Icon,
  Label,
  Placeholder,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {LogOnMount} from '@amplitude/react-amplitude';
const PreviewTable = React.lazy(() =>
  import('../components/PreviewTable/PreviewTable'),
);

/**
 * A skeleton placeholder for the loading state
 */
const HeaderSkeleton = () => (
  <Container as={Segment} basic>
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  </Container>
);

const VersionPreviewView = ({match}) => {
  const [fullWidth, setFullWidth] = useState(false);
  const [displayLength, setDisplayLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const {data: fileData, loading: fileLoading, error: fileError} = useQuery(
    GET_FILE_BY_ID,
    {
      variables: {kfId: match.params.fileId},
    },
  );
  const file = fileData && fileData.fileByKfId;
  const fileName = file && file.name;
  const version =
    file &&
    file.versions.edges.find(v => v.node.kfId === match.params.versionId) &&
    file.versions.edges.find(v => v.node.kfId === match.params.versionId).node;
  const latestVersionId = file && fileSortedVersions(file)[0].node.kfId;
  const downloadURL = version && version.downloadUrl;

  const parseData = (contents, limiteLength) => {
    const parsed = limiteLength
      ? Papa.parse(contents, {
          preview: 101,
        })
      : Papa.parse(contents);
    setErrors(parsed.errors);
    if (parsed.errors.length > 0) {
      setData(contents.substring(0, 2048));
    } else {
      setData(parsed.data);
    }
    setDisplayLength(parsed.data.length);
    setLoading(false);
  };

  const getData = limiteLength => {
    setLoading(true);
    if (fileError || !version) {
      setErrors('Failed to fetch the document information.');
      setLoading(false);
    }
    if (
      !(
        version.fileName.endsWith('csv') ||
        version.fileName.endsWith('tsv') ||
        version.fileName.endsWith('xls') ||
        version.fileName.endsWith('xlsx')
      )
    ) {
      const fileFormat = version.fileName.split('.').reverse()[0];
      setErrors(
        fileFormat +
          ' is not an understood data format. We only support .csv .tsv .xlsx and .xls files.',
      );
      setLoading(false);
    } else {
      fetch(downloadURL, {
        headers: new Headers({
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        }),
      })
        .then(function(res) {
          if (!res.ok) throw new Error('Failed to fetch the document');
          return version.fileName.endsWith('csv') ||
            version.fileName.endsWith('tsv')
            ? res
            : res.arrayBuffer();
        })
        .then(function(res) {
          if (
            version.fileName.endsWith('csv') ||
            version.fileName.endsWith('tsv')
          ) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            reader.read().then(function(result) {
              const contents = decoder.decode(result.value);
              parseData(contents, limiteLength);
            });
          } else {
            var data = new Uint8Array(res);
            var workbook = XLSX.read(data, {type: 'array'});
            const contents = XLSX.utils.sheet_to_csv(
              workbook.Sheets[Object.keys(workbook.Sheets)[0]],
            );
            parseData(contents, limiteLength);
          }
        });
    }
  };

  useEffect(() => {
    if (downloadURL && data.length === 0 && errors.length === 0) {
      getData(true);
    }
  });

  return (
    <>
      <Helmet>
        <title>
          {`KF Data Tracker - Study document preview ${
            match.params.fileId ? 'for ' + fileName : null
          }`}
        </title>
      </Helmet>
      <Container as={Segment} basic vertical clearing>
        <Header as="h1" floated="left" className="noMargin">
          File Preview
        </Header>
        {data.length > 0 && (
          <Popup
            inverted
            content="Toggle full width view"
            position="top center"
            trigger={
              <Button
                floated="right"
                data-cy="toggle width button"
                active={fullWidth}
                onClick={() => setFullWidth(!fullWidth)}
                icon={fullWidth ? 'compress' : 'expand'}
              />
            }
          />
        )}
      </Container>
      {fileLoading ? (
        <HeaderSkeleton />
      ) : (
        <Container as={Segment} basic secondary clearing className="my-2">
          {version ? (
            <>
              <Header as="h3" className="noMargin" floated="left">
                <Icon.Group size="big">
                  <Icon name="file outline" />
                  <Icon corner="bottom right" name="table" />
                </Icon.Group>
                <Popup
                  inverted
                  content={
                    <>
                      Version created{' '}
                      <TimeAgo date={version.createdAt} live={false} />
                    </>
                  }
                  position="top center"
                  trigger={
                    <Header.Content className="ml-10">
                      {fileName}
                      {version && (
                        <Header.Subheader>{version.fileName}</Header.Subheader>
                      )}
                    </Header.Content>
                  }
                />
              </Header>
              {version.analysis && (
                <>
                  <Header
                    icon
                    className="noMargin px-20"
                    floated="left"
                    as="div"
                    content={version.analysis.ncols}
                    subheader="Columns"
                  />
                  <Header
                    icon
                    className="noMargin"
                    floated="left"
                    as="div"
                    content={version.analysis.nrows}
                    subheader="Rows"
                  />
                </>
              )}
              <Popup
                inverted
                content="This is not the latest version of the document, click to preview the latest version"
                position="top center"
                trigger={
                  <Label
                    basic
                    color="black"
                    floated="right"
                    size="tiny"
                    as={Button}
                    disabled={latestVersionId === version.kfId}
                    content={
                      latestVersionId === version.kfId
                        ? 'LATEST VERSION'
                        : 'PREVIEW LATEST VERSION'
                    }
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(
                        `/study/${match.params.studyId}/documents/${
                          match.params.fileId
                        }/versions/${latestVersionId}`,
                      );
                    }}
                  />
                }
              />
            </>
          ) : (
            <Message
              warning
              icon="warning sign"
              header="Error finding document"
              content={
                fileError
                  ? fileError.message
                  : 'Failed to get the information for this document version'
              }
            />
          )}
        </Container>
      )}
      <Grid
        as={Segment}
        basic
        container={!fullWidth}
        loading={loading}
        className="mt-0"
      >
        <Grid.Row>
          <Grid.Column>
            <LogOnMount eventType="document preview" />
            {errors.length > 0 && (
              <Message
                warning
                icon="warning sign"
                header="Error previewing file"
                content={errors}
              />
            )}
            {data.length > 0 && errors.length === 0 && (
              <Suspense
                fallback={
                  <Dimmer active inverted className="mt-30">
                    <Loader inverted>Loading data table</Loader>
                  </Dimmer>
                }
              >
                <PreviewTable data={data} />
              </Suspense>
            )}
            {displayLength >= 101 && version.analysis.nrows !== 100 && (
              <Button
                fluid
                content={
                  displayLength > 101
                    ? 'Click here to display first 100 rows'
                    : 'Click here to display all the rows'
                }
                onClick={() => getData(displayLength > 101)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default VersionPreviewView;
