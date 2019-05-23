import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Icon} from 'kf-uikit';
/**
 * Displays the footer of the modal
 */
const ModalHeader = ({className, onCloseModal, title}) => {
  let modalHeaderClass = classes('Modal--Header', className);
  return (
    <header className={modalHeaderClass}>
      <h2 className="Modal--Title">{title}</h2>
      <button
        className="mt-4"
        onClick={onCloseModal}
        data-testid="close-modal-button"
      >
        <Icon kind="close" />
      </button>
    </header>
  );
};

ModalHeader.propTypes = {
  /** Any additional classes to be applied to the modal header*/
  className: PropTypes.string,
  /** Text on modal header*/
  title: PropTypes.string,
  /** Action to close modal*/
  onCloseModal: PropTypes.func,
};

ModalHeader.defaultProps = {
  className: null,
  title: null,
};

export default ModalHeader;
