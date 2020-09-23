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
import {urls} from '../../../common/urls';

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
    <>
      <Table definition compact="very">
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
    </>
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
      hoverable
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

const ValueLabel = ({children}) => <code className="label">{children}</code>;

const CommonValues = ({commonValues, distinctValues}) => {
  const formattedValues = commonValues.map(v =>
    v.length === 0 ? (
      <>
        ⛔️<em>empty</em>
      </>
    ) : (
      v
    ),
  );

  const first2 = formattedValues.slice(0, 2).map(v => (
    <span key={v}>
      <ValueLabel key={v}>{v}</ValueLabel>,{' '}
    </span>
  ));

  let values = null;
  if (formattedValues.length === 0) {
    return '';
  } else if (formattedValues.length === 1) {
    // Only show the first value if there is only one
    values = <ValueLabel>{formattedValues[0]}</ValueLabel>;
  } else if (formattedValues[0].length > 20) {
    // Only show the first value of the length is long
    values = (
      <>
        <ValueLabel>{formattedValues[0]}</ValueLabel> and{' '}
        <ValuesPopup
          values={formattedValues.slice(1)}
          total={distinctValues + 2}
        />
      </>
    );
  } else if (formattedValues.length === 2) {
    // Show first and second values
    values = (
      <>
        <ValueLabel>{formattedValues[0]}</ValueLabel>,{' '}
        <ValueLabel>{formattedValues[1]}</ValueLabel>
      </>
    );
  } else if (formattedValues.length === 3) {
    // Show first three values
    values = (
      <>
        {first2} <ValueLabel>{formattedValues[2]}</ValueLabel>
      </>
    );
  } else if (formattedValues.length > 3) {
    // Show first three values and a popup with additional values
    values = (
      <>
        {first2} <ValueLabel>{formattedValues[2]}</ValueLabel>, and{' '}
        <ValuesPopup values={formattedValues.slice(3)} total={distinctValues} />
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
    <Table.Row>
      <Table.HeaderCell colSpan={1} />
      <Table.HeaderCell colSpan={2}>
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
    </Table.Row>
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
      celled
      compact="very"
      definition
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
    <Message icon>
      <Icon name="warning sign" />
      <Message.Content>
        <Message.Header>Unknown File Format</Message.Header>
        <p>
          The file contents were not able to be interpreted for analysis.
          Utilize additional Data Tracker functionality by providing a file in
          one of the known{' '}
          <a target="_blank" rel="noopener noreferrer" href={urls.fileFormats}>
            file formats
          </a>
          .
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
              <Segment basic>{message}</Segment>
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
