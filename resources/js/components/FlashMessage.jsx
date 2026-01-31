import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import '../css/FlashMessage.css';

const FlashMessage = () => {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
// console.log(flash);
  useEffect(() => {
    // Check for any flash message type
    if (flash?.success || flash?.error || flash?.warning || flash?.info) {
      const messageData = {
        type: flash.success ? 'success' : flash.error ? 'error' : flash.warning ? 'warning' : 'info',
        text: flash.success || flash.error || flash.warning || flash.info
      };
      
      setMessage(messageData);
      setVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setMessage(null), 300); // Wait for animation to complete
  };

  if (!message) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getTitle = () => {
    switch (message.type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
      case 'warning':
        return 'Warning!';
      case 'info':
        return 'Info';
      default:
        return 'Notification';
    }
  };

  return (
    <div className={`flash-message-container ${visible ? 'show' : ''}`}>
      <div className={`flash-message flash-${message.type}`}>
        <div className="flash-icon">
          <i className={`bi ${getIcon()}`}></i>
        </div>
        <div className="flash-content">
          <div className="flash-title">{getTitle()}</div>
          <div className="flash-text">{message.text}</div>
        </div>
        <button className="flash-close" onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        <div className="flash-progress">
          <div className="flash-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default FlashMessage;