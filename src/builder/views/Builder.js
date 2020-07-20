import React, {useState} from 'react';
import {Accordion, Button, Segment, Icon} from 'semantic-ui-react';
import TypeChooser from '../components/TypeChooser';
import Mapper from '../components/Mapper';

const Builder = ({file}) => {
  const [step, setStep] = useState(0);

  const handleClick = (e, titleProps) => {
    const {index} = titleProps;
    setStep(index);
  };

  const handleSelect = () => {
    console.log('select');
    setStep(1);
  };

  return (
    <>
      <Segment>
        <p>
          <b>Uploaded File:</b> {file.name}
        </p>
        <Button
          primary
          icon="upload"
          labelPosition="left"
          content="Upload new file"
        />
      </Segment>
      <Accordion fluid>
        <Accordion.Title active={step === 0} onClick={handleClick} index={0}>
          <Icon name="dropdown" />
          Document Type
        </Accordion.Title>
        <Accordion.Content active={step === 0}>
          <p>
            Select which type of document this is. The Data Coordinating Center
            requires that files adhere to the proper.{' '}
            <a href="/">format guidelines</a> for the respective file types.
          </p>
          <TypeChooser handleSelect={handleSelect} />
        </Accordion.Content>
        <Accordion.Title active={step === 1} onClick={handleClick} index={1}>
          <Icon name="dropdown" />
          Mapping Cofiguration
        </Accordion.Title>
        <Accordion.Content active={step === 1}>
          <p>
            We found the following columns in the file provided. Please confirm
            that columns are correctly being mapped to Kids First concepts.
          </p>
          <Mapper />
        </Accordion.Content>
      </Accordion>
      <Segment basic>
        <Button size="huge">Submit!</Button>
      </Segment>
    </>
  );
};
export default Builder;
