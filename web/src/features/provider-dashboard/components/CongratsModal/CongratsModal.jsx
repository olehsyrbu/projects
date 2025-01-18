import './CongratsModal.css';
import PropTypes from 'prop-types';
import { Dismiss24Filled as Dismiss } from '@fluentui/react-icons';
import LeftLeaf1 from '@/images/Shared/ModalLeaf-1-Left.svg';
import LeftLeaf2 from '@/images/Shared/ModalLeaf-2-Left.svg';
import LeftLeaf3 from '@/images/Shared/ModalLeaf-3-Left.svg';
import RightLeaf1 from '@/images/Shared/ModalLeaf-1-Right.svg';
import RightLeaf2 from '@/images/Shared/ModalLeaf-2-Right.svg';
import RightLeaf3 from '@/images/Shared/ModalLeaf-3-Right.svg';

export function CongratsModal({ onCloseModal, onEditProvider }) {
  return (
    <div id="congratsModalContainer">
      <div id="modalContainer" className="fade-in">
        <img src={LeftLeaf1} className="modal-leaves" id="leftLeaf1" alt="" />
        <img src={LeftLeaf2} className="modal-leaves" id="leftLeaf2" alt="" />
        <img src={LeftLeaf3} className="modal-leaves" id="leftLeaf3" alt="" />
        <img src={RightLeaf1} className="modal-leaves" id="rightLeaf1" alt="" />
        <img src={RightLeaf2} className="modal-leaves" id="rightLeaf2" alt="" />
        <img src={RightLeaf3} className="modal-leaves" id="rightLeaf3" alt="" />
        <div id="congratsModal">
          <div id="congratsModalHeading">
            <h2>Your profile has been created!</h2>
            <button className="modal-close-button" onClick={onCloseModal} type="button">
              <Dismiss className="text-p-100" />
            </button>
          </div>

          <div id="congratsModalContent">
            <p>
              We’re thrilled to have you as a member of our community as we work to make the world a
              mentally healthier place.
            </p>

            <p>
              Add additional information to help potential clients/patients get a sense of what
              makes your practice unique.
            </p>

            <p>We’re here to support you at support@miresource.com.</p>
          </div>

          <div id="congratsModalFooter">
            <button className="mir-button primary" onClick={onEditProvider}>
              Customize profile
            </button>
            <button className="mir-button" onClick={onCloseModal}>
              I’ll do it later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CongratsModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onEditProvider: PropTypes.func.isRequired,
};
