import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import '../css/FlashMessage.css';

const FlashMessage = ({ errors = null }) => {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
// console.log(flash);
  useEffect(() => {
    // Check for validation errors first (client-side)
    if (errors && Object.keys(errors).length > 0) {
      const errorMessages = Object.entries(errors).map(([field, msg]) => msg).join('\n');
      const messageData = {
        type: 'error',
        text: errorMessages,
        isError: true
      };
      
      setMessage(messageData);
      setVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
    
    // Check for flash messages (server-side)
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
  }, [flash, errors]);

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