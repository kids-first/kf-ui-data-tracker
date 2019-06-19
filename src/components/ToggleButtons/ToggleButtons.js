import React, {useState} from 'react';
import propTypes from 'prop-types';
import {Button, Icon} from 'semantic-ui-react';

const ToggleButtons = ({buttons, onToggle}) => {
  const [active, setActive] = useState(0);

  return (
    <Button.Group floated="right">
      {buttons.map(({text, icon}, idx) => (
        <Button
          key={text}
          icon
          labelPosition="left"
          primary={active === idx}
          onClick={() => {
            setActive(idx);
            onToggle({active, text, icon});
          }}
          tabIndex="0"
        >
          <Icon name={icon} />
          {text}
        </Button>
      ))}
    </Button.Group>
  );
};

ToggleButtons.propTypes = {
  buttons: propTypes.arrayOf(
    propTypes.shape({
      /** Button text (optional) */
      text: propTypes.string,
      /** kf-uikit icon name (optional) */
      icon: propTypes.string,
    }),
  ),
  /** onClick callback that rececives the button object as args */
  onToggle: propTypes.func,
};

export default ToggleButtons;
