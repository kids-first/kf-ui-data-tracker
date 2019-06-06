import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import ReactModal from 'react-modal';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
/**
 * Displays modal view
 */
const Modal = ({
  className,
  onSubmit,
  title,
  children,
  onCloseModal,
  onBeforeClose,
  disableSubmit,
  cancelText,
  submitText,
}) => {
  let modalClass = classes('Modal--container', className);
  return (
    <ReactModal
      data-testid="modal"
      isOpen={true}
      contentLabel="File Version Uploda/Annotation Modal"
      onRequestClose={onBeforeClose}
      className={modalClass}
      overlayClassName="Modal--overlay"
      ariaHideApp={false}
    >
      <ModalHeader title={title} onCloseModal={onCloseModal} />
      <section className="Modal--content">
        <Fragment>{children}</Fragment>
      </section>
      <ModalFooter
        onCloseModal={onCloseModal}
        onSubmit={onSubmit}
        disableSubmit={disableSubmit}
        cancelText={cancelText}
        submitText={submitText}
      />
    </ReactModal>
  );
};

Modal.propTypes = {
  /** Any additional classes to be applied to the modal*/
  className: PropTypes.string,
  /** Action to submit content*/
  onSubmit: PropTypes.func,
  /** Modal title*/
  title: PropTypes.string,
};

Modal.defaultProps = {
  className: null,
};

export default Modal;
