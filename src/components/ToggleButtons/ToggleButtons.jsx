import React, {useState} from 'react';
import propTypes from 'prop-types';
import classnames from 'classnames';
import {Button} from 'kf-uikit';

const ToggleButtons = ({buttons, className, onToggle}) => {
  const ToggleButtonsClass = classnames('ToggleButtons', className);
  const [active, setActive] = useState(0);

  return (
    <div className={ToggleButtonsClass}>
      {buttons.map(({text, icon}, idx) => (
        <Button
          key={text + icon}
          icon={icon}
          color={active === idx ? 'primary' : null}
          onClick={() => {
            setActive(idx);
            onToggle({active, text, icon});
          }}
          tabIndex="0"
        >
          {text}
        </Button>
      ))}
    </div>
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
  /** additional classes to add the wrapping div */
  className: propTypes.string,
  /** onClick callback that rececives the button object as args */
  onToggle: propTypes.func,
};

export default ToggleButtons;
