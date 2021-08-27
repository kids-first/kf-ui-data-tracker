import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Label,
  List,
  Placeholder,
  Popup,
  Radio,
  Segment,
} from 'semantic-ui-react';
import React, {Fragment} from 'react';

import {Link} from 'react-router-dom';
import {fileTypeDetail} from '../../../common/enums';

export const TypeCardPlaceholder = props => (
  <Card>
    <Card.Content>
      <Label color="yellow" corner="right">
        <Icon name="star" />
      </Label>
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length="medium" />
          <Placeholder.Line length="short" />
        </Placeholder.Paragraph>
      </Placeholder>
    </Card.Content>
  </Card>
);

export const TypeCard = ({
  field: {name, onChange},
  form: {values, setFieldValue},
  id,
  expedited,
  setSelectedTemplate,
}) => (
  <Card
    as="div"
    className="cursor-pointer"
    color={id === values.file_type ? (expedited ? 'yellow' : 'blue') : 'grey'}
    onClick={() => {
      setFieldValue(name, id);
      setSelectedTemplate('');
    }}
  >
    <Card.Content>
      {expedited && (
        <Label color="yellow" corner="right">
          <Icon name="star" />
        </Label>
      )}

      <Card.Header>
        <Radio
          name={name}
          id={id}
          value={id}
          checked={id === values.file_type}
          onChange={onChange}
          label={() => (
            <Icon
              name={fileTypeDetail[id].icon}
              bordered
              circular
              inverted
              color={
                id === values.file_type
                  ? expedited
                    ? 'yellow'
                    : 'blue'
                  : 'black'
              }
            />
          )}
        />
        {fileTypeDetail[id].title}
      </Card.Header>
      <Popup
        wide
        on="hover"
        mouseEnterDelay={500}
        disabled={fileTypeDetail[id].description.length <= 150}
        content={fileTypeDetail[id].description}
        trigger={
          <Card.Description>
            {fileTypeDetail[id].description.substring(0, 150)}
            {fileTypeDetail[id].description.length > 150 && '...'}
          </Card.Description>
        }
      />
    </Card.Content>
    {fileTypeDetail[id].url && (
      <Card.Content extra>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={fileTypeDetail[id].url}
        >
          More info
        </a>
      </Card.Content>
    )}
  </Card>
);

const FieldsList = ({fields, title, color}) => (
  <Fragment>
    <Header as="h5" color={fields.length > 0 ? color : 'grey'}>
      {fields.length + title}
    </Header>
    {fields.length > 15 ? (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <List
              bulleted
              size="small"
              items={fields.slice(0, Math.round(fields.length / 2))}
            />
          </Grid.Column>
          <Grid.Column>
            <List
              bulleted
              size="small"
              items={fields.slice(Math.round(fields.length / 2), fields.length)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <List bulleted size="small" items={fields} />
    )}
  </Fragment>
);

export const TemplateCard = ({
  node,
  selectedTemplate,
  setSelectedTemplate,
  setFieldValue,
  result,
  studyId,
}) => (
  <Popup
    wide="very"
    position="right center"
    disabled={result.length === 0}
    trigger={
      <Card
        as="div"
        className="cursor-pointer"
        onClick={() => {
          setFieldValue('file_type', '');
          setSelectedTemplate(node.id);
        }}
        color={selectedTemplate === node.id ? 'blue' : 'grey'}
      >
        <Card.Content>
          {result.length > 0 &&
            result[0].matchesTemplate &&
            result[0].matchedRequiredCols
              .concat(result[0].missingRequiredCols)
              .concat(result[0].matchedOptionalCols)
              .concat(result[0].missingOptionalCols).length > 0 && (
              <Label
                color={selectedTemplate === node.id ? 'blue' : 'green'}
                corner="right"
              >
                <Icon name="check" />
              </Label>
            )}
          <Card.Header>
            <Radio
              name={node.dataTemplate.name}
              id={node.id}
              value={node.id}
              checked={true}
              label={() => (
                <Icon
                  name={node.dataTemplate.icon || 'file outline'}
                  bordered
                  circular
                  inverted
                  color={selectedTemplate === node.id ? 'blue' : 'black'}
                />
              )}
            />
            <span className={selectedTemplate === node.id ? 'text-blue' : ''}>
              {node.dataTemplate.name}
            </span>
            <Link to={`/study/${studyId}/templates/`} target="_blank">
              <Icon name="external" size="tiny" className="ml-5" color="blue" />
            </Link>
          </Card.Header>
          <Card.Description>
            {node.dataTemplate.description.substring(0, 120)}
            {node.dataTemplate.description.length > 120 && '...'}
          </Card.Description>
        </Card.Content>
        {result.length > 0 ? (
          <Card.Content extra>
            <List className="mb-0" bulleted>
              <List.Item className="text-red">
                {result[0].missingRequiredCols.length +
                  '/' +
                  (result[0].matchedRequiredCols.length +
                    result[0].missingRequiredCols.length) +
                  ' required fields missing'}
              </List.Item>
              <List.Item className="text-green">
                {result[0].matchedRequiredCols.length +
                  '/' +
                  (result[0].matchedRequiredCols.length +
                    result[0].missingRequiredCols.length) +
                  ' required fields matched'}
              </List.Item>
              <List.Item className="text-yellow">
                {result[0].missingOptionalCols.length +
                  '/' +
                  (result[0].matchedOptionalCols.length +
                    result[0].missingOptionalCols.length) +
                  ' optional fields missing'}
              </List.Item>
              <List.Item className="text-teal">
                {result[0].matchedOptionalCols.length +
                  '/' +
                  (result[0].matchedOptionalCols.length +
                    result[0].missingOptionalCols.length) +
                  ' optional fields matched'}
              </List.Item>
            </List>
            <Button disabled floated="right" basic size="mini">
              More info
            </Button>
          </Card.Content>
        ) : (
          <Card.Content extra>
            <span className="text-grey">No field evaluation results</span>
          </Card.Content>
        )}
      </Card>
    }
  >
    {result.length > 0 && (
      <Popup.Content className="pt-5">
        {result[0].matchedRequiredCols
          .concat(result[0].missingRequiredCols)
          .concat(result[0].matchedOptionalCols)
          .concat(result[0].missingOptionalCols).length > 0 ? (
          <Label
            attached="top"
            color={result[0].matchesTemplate ? 'green' : 'red'}
          >
            {result[0].matchesTemplate ? 'MATCHED' : 'UNMATCHED'}
          </Label>
        ) : (
          <Label attached="top" color="grey">
            NO RESULTS
          </Label>
        )}
        <FieldsList
          fields={result[0].missingRequiredCols}
          title=" Missing Required Fields"
          color="red"
        />
        <FieldsList
          fields={result[0].matchedRequiredCols}
          title=" Matched Required Fields"
          color="green"
        />
        <FieldsList
          fields={result[0].missingOptionalCols}
          title=" Missing Optional Fields"
          color="yellow"
        />
        <FieldsList
          fields={result[0].matchedOptionalCols}
          title=" Matched Optional Fields"
          color="teal"
        />
      </Popup.Content>
    )}
  </Popup>
);

export const ResultDisplay = ({result}) => (
  <Popup
    wide="very"
    position="bottom center"
    disabled={result.length === 0}
    trigger={
      <Segment basic className="noMargin">
        <Header as="h4" color="grey">
          Template{' '}
          {result.length > 0 &&
            result[0].matchedRequiredCols
              .concat(result[0].missingRequiredCols)
              .concat(result[0].matchedOptionalCols)
              .concat(result[0].missingOptionalCols).length > 0 && (
              <Label
                content={result[0].matchesTemplate ? 'MATCHED' : 'UNMATCHED'}
                color={result[0].matchesTemplate ? 'green' : 'red'}
                size="mini"
              />
            )}
        </Header>
        {result.length > 0 ? (
          <>
            <List className="noMargin" bulleted horizontal size="tiny">
              <List.Item className="text-red">
                {result[0].missingRequiredCols.length +
                  '/' +
                  (result[0].matchedRequiredCols.length +
                    result[0].missingRequiredCols.length) +
                  ' required fields missing'}
              </List.Item>
              <List.Item className="text-green">
                {result[0].matchedRequiredCols.length +
                  '/' +
                  (result[0].matchedRequiredCols.length +
                    result[0].missingRequiredCols.length) +
                  ' required fields matched'}
              </List.Item>
            </List>
            <List className="noMargin" bulleted horizontal size="tiny">
              <List.Item className="text-yellow">
                {result[0].missingOptionalCols.length +
                  '/' +
                  (result[0].matchedOptionalCols.length +
                    result[0].missingOptionalCols.length) +
                  ' optional fields missing'}
              </List.Item>
              <List.Item className="text-teal">
                {result[0].matchedOptionalCols.length +
                  '/' +
                  (result[0].matchedOptionalCols.length +
                    result[0].missingOptionalCols.length) +
                  ' optional fields matched'}
              </List.Item>
            </List>
          </>
        ) : (
          <span className="text-grey">No field evaluation results</span>
        )}
      </Segment>
    }
  >
    {result.length > 0 && (
      <Popup.Content className="pt-5">
        {result[0].matchedRequiredCols
          .concat(result[0].missingRequiredCols)
          .concat(result[0].matchedOptionalCols)
          .concat(result[0].missingOptionalCols).length > 0 ? (
          <Label
            attached="top"
            color={result[0].matchesTemplate ? 'green' : 'red'}
          >
            {result[0].matchesTemplate ? 'MATCHED' : 'UNMATCHED'}
          </Label>
        ) : (
          <Label attached="top" color="grey">
            NO RESULTS
          </Label>
        )}
        <FieldsList
          fields={result[0].missingRequiredCols}
          title=" Missing Required Fields"
          color="red"
        />
        <FieldsList
          fields={result[0].matchedRequiredCols}
          title=" Matched Required Fields"
          color="green"
        />
        <FieldsList
          fields={result[0].missingOptionalCols}
          title=" Missing Optional Fields"
          color="yellow"
        />
        <FieldsList
          fields={result[0].matchedOptionalCols}
          title=" Matched Optional Fields"
          color="teal"
        />
      </Popup.Content>
    )}
  </Popup>
);
