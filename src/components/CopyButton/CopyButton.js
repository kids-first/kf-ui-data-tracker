import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Popup} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
/**
 * A simple button that is wrapped with an icon and a popup prompting the user
 * to copy the provided text.
 * Passes additional props to the Button
 */
const CopyButton = ({text, textToCopy, icon, tooltip, position, ...props}) => {
  const [copied, setCopied] = useState(false);
  return (
    <Popup
      inverted
      position={position}
      trigger={
        <CopyToClipboard
          text={textToCopy || text}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 700);
          }}
        >
          <Button icon onClick={e => e.stopPropagation()} {...props}>
            <Icon name={icon} />
            {text}
          </Button>
        </CopyToClipboard>
      }
    >
      {copied ? <Icon color="green" name="check" /> : tooltip}
    </Popup>
  );
};

CopyButton.propTypes = {
  /** The string to be displayed on button and copied */
  text: PropTypes.string,
  /** The string to be copied */
  textToCopy: PropTypes.string,
  /** Copy button icon name */
  icon: PropTypes.string,
  /** Copy button tooltip text */
  tooltip: PropTypes.string,
  /** Copy button tooltip position */
  position: PropTypes.oneOf([
    'top center',
    'top left',
    'top right',
    'bottom center',
    'bottom left',
    'bottom right',
    'right center',
    'left center',
  ]),
};

CopyButton.defaultProps = {
  text: null,
  icon: 'copy',
  tooltip: 'Copy',
  position: 'top left',
};

export default CopyButton;
