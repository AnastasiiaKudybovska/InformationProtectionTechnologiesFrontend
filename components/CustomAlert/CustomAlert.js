import React, { useState, useEffect } from 'react';
import css from './CustomAlert.module.css'; 

const CustomAlert = ({ message, success}) => {
  const [visible, setVisible] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(95);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 50);
    setTimeout(() => {
      clearInterval(intervalId);
      setVisible(false);
      setSecondsLeft(95);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const timerWidth = `${secondsLeft}%`;

  return (
    <>
      {visible && (
        <div
          className={`${css.customAlert} ${success ? css.success : css.error}`}
          data-testid="custom-alert"
        >
          <div className={css.alertContent}>
            <div className={css.message}>{message}</div>
          </div>
          <div className={css.timerWrapper} style={{ width: timerWidth }} data-testid="timer-wrapper" />
        </div>
      )}
    </>
  );
};

export default CustomAlert;