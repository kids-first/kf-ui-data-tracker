import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Button} from 'kf-uikit';
/**
 * Displays the footer of the modal
 */
const ModalFooter = ({
  className,
  onCloseModal,
  onSubmit,
  cancelText,
  submitText,
  disableSubmit,
  footerButton,
}) => {
  let modalFooterClass = classes('Modal--Footer', className);
  return (
    <footer className={modalFooterClass}>
      <Button className="w-32 justify-center" onClick={onCloseModal}>
        {cancelText}
      </Button>
      {footerButton}
      <Button
        onClick={onSubmit}
        className="w-32 justify-center"
        color="primary"
        disabled={disableSubmit}
      >
        {submitText}
      </Button>
    </footer>
  );
};

ModalFooter.propTypes = {
  /** Any additional classes to be applied to the modal footer*/
  className: PropTypes.string,
  /** Text on cancel button*/
  cancelText: PropTypes.string,
  /** Text on submit button*/
  submitText: PropTypes.string,
  /** Action to close modal*/
  onCloseModal: PropTypes.func,
  /** Action to submit content*/
  onSubmit: PropTypes.func,
};

ModalFooter.defaultProps = {
  className: null,
  cancelText: 'CANCEL',
  submitText: 'SUBMIT',
};

export default ModalFooter;
