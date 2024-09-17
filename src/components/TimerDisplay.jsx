import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { TimerContext } from "../App";

function TimerDisplay({ window = null }) {
  const { time, logo, eventLogo } = useContext(TimerContext);

  useEffect(() => {
    if (window) {
      const style = document.createElement("style");
      style.textContent = `
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          background-color: #f0f0f0; 
        }
        .timer-container { 
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh; 
          width: 100vw;
          background-color: white;
          padding: 40px;
          box-sizing: border-box;
          overflow: hidden; 
        }
        .timer-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
        }
        .big-text { 
          font-size: 8rem; /* Increased font size */
          font-weight: bold; 
          color: #4CAF50; 
          margin-bottom: 20px;
        }
        .precise-time { 
          font-size: 3rem; /* Increased font size */
          color: #666; 
        }
        .logo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        .brand-logo, .footer-logo {
          max-width: auto; /* Adjust size as needed */
          max-height: 250px; /* Adjust size as needed */
          margin: 0 10px; /* Adjust spacing between logos */
          object-fit: contain; /* Ensures logo maintains its aspect ratio */
        }
        .header-logo {
          margin-bottom: 20px;
        }
      `;
      window.document.head.appendChild(style);
    }
  }, [window]);

  const formatBigText = ({ hours, minutes, seconds }) => {
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} remaining`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} remaining`;
    }
  };

  const formatPreciseTime = ({ hours, minutes, seconds }) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Validate the URLs before using them
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const timerContent = (
    <div className="timer-container">
      <div className="header-logo">
        {eventLogo && isValidURL(eventLogo) ? (
          <img src={eventLogo} alt="Event Logo" className="brand-logo" />
        ) : // <div>No Event Logo</div>
        null}
      </div>
      <div className="timer-content">
        <div className="big-text">{formatBigText(time)}</div>
        <div className="precise-time">{formatPreciseTime(time)}</div>
      </div>
      <div className="logo-container">
        {logo && isValidURL(logo) ? (
          <img src={logo} alt="Organization Logo" className="footer-logo" />
        ) : // <div>No Organization Logo</div>
        null}
      </div>
    </div>
  );

  if (window) {
    return createPortal(
      timerContent,
      window.document.getElementById("timer-root")
    );
  }

  return timerContent;
}

export default TimerDisplay;
