import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Icon} from 'kf-uikit';

const CopyButton = ({className, text}) => {
  const copyButtonClass = classes(className);
  const [copied, setCopied] = useState(false);
  return (
    <span className={copyButtonClass}>
      <CopyToClipboard
        text={text}
        onCopy={() => {
          setCopied(true);
          alert('Copied!');
          setTimeout(() => {
            setCopied(false);
          }, 700);
        }}
      >
        <button>
          {copied ? (
            <span>&#10004;</span>
          ) : (
            <Icon width={12} height={12} kind="copy" />
          )}
        </button>
      </CopyToClipboard>
    </span>
  );
};

CopyButton.propTypes = {
  /** Any additional classes to be applied to the copy button*/
  className: PropTypes.string,
  /** The string to be copied */
  text: PropTypes.string.isRequired,
};

CopyButton.defaultProps = {
  className: null,
  text: null,
};

export default CopyButton;
