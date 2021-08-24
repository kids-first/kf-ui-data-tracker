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
