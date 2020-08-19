import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Icon,
  Message,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import {Amplitude} from '@amplitude/react-amplitude';

/**
 * A summary of the analysis for a given version
 */
const AnalysisSummary = ({version}) => {
  if (!version.analysis.knownFormat) {
    return <UnkownFormat message={version.analysis.errorMessage} />;
  }

  const columns =
    version.analysis.columns && JSON.parse(version.analysis.columns);

  return (
    <Segment basic secondary>
      <p>This is an overview of the latest version's file structure</p>

      <Table definition compact>
        <Table.Body>
          <Table.Row>
            <Table.Cell width="2">Rows</Table.Cell>
            <Table.Cell>{version.analysis.nrows}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width="2">Columns</Table.Cell>
            <Table.Cell>{version.analysis.ncols}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      {columns && <ColumnSummary columns={columns} />}
    </Segment>
  );
};

AnalysisSummary.propTypes = {
  /** Version node to display analysis for */
  version: PropTypes.object.isRequired,
};

const ValuesPopup = ({values, total}) => {
  let vals = values;
  if (vals.length + 3 < total) {
    vals.push('and ' + (total - vals.length - 3) + ' more');
  }
  return (
    <Popup
      inverted
      trigger={
        <span className="text-blue">
          {' '}
          {total - 3} more <Icon name="eye" size="small" color="blue" />
        </span>
      }
      content={vals.map(v => (
        <pre key={v}>{v}</pre>
      ))}
      position="right center"
    />
  );
};

const CommonValues = ({commonValues, distinctValues}) => {
  const first2 = commonValues.slice(0, 2).map(v => <code key={v}>{v}, </code>);

  let values = null;
  if (commonValues.length === 0) {
    return '';
  } else if (commonValues.length === 1) {
    values = <code>{commonValues[0]}</code>;
  } else if (commonValues.length === 2) {
    values = (
      <>
        <code>{commonValues[0]}</code>, <code>{commonValues[1]}</code>
      </>
    );
  } else if (commonValues.length === 3) {
    values = (
      <>
        {first2} <code>{commonValues[2]}</code>
      </>
    );
  } else if (commonValues.length > 3) {
    values = (
      <>
        {first2} <code>{commonValues[2]}</code>, and{' '}
        <ValuesPopup values={commonValues.slice(3)} total={distinctValues} />
      </>
    );
  }

  return values;
};

const ColumnSummary = ({columns}) => {
  const [allColumns, setAllcolumns] = useState(false);

  const tableHeader = () => (
    <Table.Row>
      <Table.HeaderCell>Column</Table.HeaderCell>
      <Table.HeaderCell>Common Values</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Distinct Values</Table.HeaderCell>
    </Table.Row>
  );

  const tableFooter = () => (
    <Table.HeaderCell colSpan={3}>
      {allColumns ? (
        <>
          Showing all {columns.length} columns.{' '}
          <Button
            size="small"
            labelPosition="left"
            className="text-primary"
            onClick={() => setAllcolumns(!allColumns)}
          >
            Only show first 5 columns
          </Button>
        </>
      ) : (
        <>
          {columns.length - 5} columns hidden.{' '}
          <Button
            size="small"
            labelPosition="left"
            className="text-primary"
            onClick={() => setAllcolumns(!allColumns)}
          >
            Show all columns
          </Button>
        </>
      )}
    </Table.HeaderCell>
  );
  const rowRenderer = (data, index) => ({
    key: data.name,
    cells: [
      data.name,
      {
        key: 'common_values',
        content: (
          <CommonValues
            commonValues={data.common_values}
            distinctValues={data.distinct_values}
          />
        ),
      },
      {
        key: 'distinct values',
        content: data.distinct_values,
        textAlign: 'center',
      },
    ],
  });
  return (
    <Table
      compact
      tableData={allColumns ? columns : columns.slice(0, 5)}
      headerRow={tableHeader}
      footerRow={columns.length > 5 && tableFooter}
      renderBodyRow={rowRenderer}
    />
  );
};

const UnkownFormat = ({message}) => {
  const [showError, setShowError] = useState(false);

  return (
    <Message icon size="small">
      <Icon name="warning sign" />
      <Message.Content>
        <Message.Header>Unknown File Format</Message.Header>
        <p>
          The file format for the latest version of this document was not
          understood. Please upload a version that follows the file format
          guidelines to see a summary of the file.
        </p>
        {message && (
          <Accordion>
            <Accordion.Title
              active={showError}
              onClick={() => setShowError(!showError)}
            >
              <Icon name="dropdown" /> See error details
            </Accordion.Title>
            <Accordion.Content active={showError}>
              <Segment basic>
                {message}
              </Segment>
            </Accordion.Content>
          </Accordion>
        )}
      </Message.Content>
    </Message>
  );
};

const TrackedAnalysisSummary = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'analysis summary']
        : ['analysis summary'],
    })}
  >
    <AnalysisSummary {...props} />
  </Amplitude>
);

export default TrackedAnalysisSummary;
