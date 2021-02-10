import React from 'react';
import './popup.scss';

const Popup = ({ content, isPopupOpen, closePopup }) => {
  return (
    <div
      className={isPopupOpen ? 'bg-overlay active' : 'bg-overlay'}
      data-testid="bg-overlay"
      onClick={(e) => closePopup(e)}
    >
      <div
        className={isPopupOpen ? 'popup-container open' : 'popup-container'}
        data-testid="popup-container"
      >
        <div className="button-container">
          <div
            className="close-button"
            id="popup-close-btn"
            data-testid="popup-close-btn"
          >
            <span className="line" />
            <span className="line" />
          </div>
        </div>

        <div className="popup-content">{content}</div>
      </div>
    </div>
  );
};

export default Popup;
