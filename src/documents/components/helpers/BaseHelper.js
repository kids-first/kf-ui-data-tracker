import React, {useState} from 'react';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
} from 'semantic-ui-react';

/**
 * Displays a help message with an image.
 */
const BaseHelper = ({title, image, children}) => {
  // Keep the hidden state stored in localstorage so it won't be displayed next
  // time if the user does not want it
  const lsKey = `helper - ${title}`;
  const [isVisible, setIsVisible] = useState(
    localStorage.getItem(lsKey)
      ? JSON.parse(localStorage.getItem(lsKey))
      : true,
  );

  const toggleVisible = () => {
    setIsVisible(!isVisible);
    localStorage.setItem(lsKey, !isVisible);
  };

  if (!isVisible)
    return (
      <Button
        basic
        className="text-button"
        floated="right"
        onClick={toggleVisible}
      >
        About this Page <Icon name="dropdown" />
      </Button>
    );

  return (
    <Grid as={Segment} color="blue" secondary divided>
      <Grid.Column width={3}>
        <Image src={image} />
      </Grid.Column>
      <Grid.Column width={13}>
        <Header as="h2">
          {title}
          <Button
            basic
            className="text-button"
            icon="close"
            floated="right"
            onClick={toggleVisible}
          >
            Close
          </Button>
        </Header>
        <Container>{children}</Container>
      </Grid.Column>
    </Grid>
  );
};

export default BaseHelper;
