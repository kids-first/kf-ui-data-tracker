import React, {useState} from 'react';
import propTypes from 'prop-types';
import {Button, Icon} from 'semantic-ui-react';
/**
 * Toggle Buttons taking two or more buttons and show as a group for toggle
 * Takes buttons prop as an array of {text, icon} objects
 * Dispaly text on buttons as optional
 * Customize diffrent buttons in diffrent sized
 */
const ToggleButtons = ({buttons, onToggle, size, hideText, selected}) => {
  const [active, setActive] = useState(selected || buttons[0].key);

  return (
    <Button.Group size={size}>
      {buttons.map(({key, text, icon}, idx) => (
        <Button
          key={key}
          icon={hideText}
          data-testid={key}
          primary={active === key}
          onClick={() => {
            setActive(key);
            onToggle({active, key, icon});
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
      /** Button key (required) */
      key: propTypes.string,
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
  /** The key of pre-selected button */
  selected: propTypes.string,
};

export default ToggleButtons;
