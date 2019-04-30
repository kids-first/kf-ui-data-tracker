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
          setTimeout(() => {
            setCopied(false);
          }, 700);
        }}
      >
        <button>
          {copied ? (
            <span className="CopyButton">
              <svg
                viewBox="0 0 26 26"
                fill="green"
                version="1.1"
                width="10px"
                height="10px"
              >
                <g id="surface1">
                  <path d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z " />
                </g>
              </svg>
              <span className="CopyTooltip">Copied!</span>
            </span>
          ) : (
            <Icon width={10} height={10} kind="copy" />
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
