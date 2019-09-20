import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Popup} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

/**
 * A simple button that is wrapped with an icon and a popup prompting the user
 * to copy the provided text.
 * Passes additional props to the Button
 */
const CopyButton = ({
  text,
  textToCopy,
  icon = 'copy',
  tooltip = 'Copy',
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <Popup
      inverted
      position="top left"
      size="mini"
      className="CopyButton--popup"
      trigger={
        <CopyToClipboard
          text={text || textToCopy}
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
  /** The string to be copied */
  text: PropTypes.string.isRequired,
};

CopyButton.defaultProps = {
  text: null,
};

export default CopyButton;
