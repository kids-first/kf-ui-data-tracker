import React from 'react';
import {Card, Icon} from 'semantic-ui-react';

const fileTypeDetail = {
  SHM: {
    icon: 'users',
    title: 'Pedigree File',
    description: 'File relating participants to ancestial participants',
  },
};

const Item = ({id, name, disabled, selected, onClick}) => (
  <Card
    link
    onClick={onClick}
    image={
      <center>
        <Icon
          name={fileTypeDetail[id].icon}
          size="large"
          bordered
          circular
          inverted
          color={disabled ? 'grey' : selected ? 'blue' : 'black'}
        />
      </center>
    }
    size="small"
    color={disabled ? 'grey' : selected ? 'blue' : null}
    header={fileTypeDetail[id].title}
    description={[fileTypeDetail[id].description].join('')}
    extra={
      disabled ? (
        <>
          <Icon name="warning" color="red" />
          File is missing columns 'sample_type', 'tissue_type'
        </>
      ) : (
        ''
      )
    }
  />
);

const TypeChooser = ({handleSelect}) => (
  <Card.Group itemsPerRow={3}>
    {Object.keys(fileTypeDetail).map((item, i) => (
      <Item id={item} key={item} name={item} onClick={() => handleSelect()} />
    ))}
  </Card.Group>
);

export default TypeChooser;
