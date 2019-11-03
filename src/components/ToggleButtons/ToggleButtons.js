import React, {useState} from 'react';
import propTypes from 'prop-types';
import {Button, Icon} from 'semantic-ui-react';

/**
 * Toggle Buttons taking two or more buttons and show as a group for toggle
 * Takes buttons prop as an array of {text, icon} objects
 * Dispaly text on buttons as optional
 * Customize diffrent buttons in diffrent sized
 */
const ToggleButtons = ({buttons, onToggle, size, hideText}) => {
  const [active, setActive] = useState(0);

  return (
    <Button.Group size={size}>
      {buttons.map(({text, icon}, idx) => (
        <Button
          key={text}
          icon={hideText}
          primary={active === idx}
          onClick={() => {
            setActive(idx);
            onToggle({active, text, icon});
          }}
          tabIndex="0"
        >
          <Icon name={icon} />
          {!hideText && text}
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
  /** Button group size. */
  size: propTypes.oneOf([
    'mini',
    'tiny',
    'small',
    'medium',
    'large',
    'big',
    'huge',
    'massive',
  ]),
  /** Show toggle button as icons obly */
  hideText: propTypes.bool,
};

export default ToggleButtons;
