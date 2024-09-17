import { useState, useEffect, createContext } from "react";
import ControlPanel from "./components/ControlPanel";
import TimerDisplay from "./components/TimerDisplay";
import { Button } from "./components/ui/button";

// Update TimerContext to include logo and its updater function
export const TimerContext = createContext({
  time: { hours: 0, minutes: 5, seconds: 0 },
  setTime: () => {},
  isRunning: false,
  setIsRunning: () => {},
  logo: "", // Placeholder for brand logo URL
  setLogo: () => {}, // Function to update logo
  eventLogo: "", // Placeholder for event logo URL
  setEventLogo: () => {}, // Function to update event logo
});

function App() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [logo, setLogo] = useState(""); // State for logo URL
  const [eventLogo, setEventLogo] = useState(""); // State for event logo URL
  const [timerWindow, setTimerWindow] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning && (time.hours > 0 || time.minutes > 0 || time.seconds > 0)) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds - 1;
          const newMinutes =
            newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
          const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

          return {
            hours: newHours,
            minutes: newMinutes < 0 ? 59 : newMinutes,
            seconds: newSeconds < 0 ? 59 : newSeconds,
          };
        });
      }, 1000);
    } else if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time.hours, time.minutes, time.seconds]);

  useEffect(() => {
    return () => {
      if (timerWindow) {
        timerWindow.close();
      }
    };
  }, [timerWindow]);

  const openTimerWindow = () => {
    const newWindow = window.open("", "Timer Display", "width=800,height=600");
    newWindow.document.body.innerHTML = '<div id="timer-root"></div>';
    setTimerWindow(newWindow);
  };

  return (
    <TimerContext.Provider
      value={{
        time,
        setTime,
        isRunning,
        setIsRunning,
        logo,
        setLogo,
        eventLogo,
        setEventLogo,
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Tech Talk Timer</h1>
        <div className="mb-4">
          <Button onClick={openTimerWindow}>Open Timer Display</Button>
        </div>
        <div className="flex flex-col gap-4">
          <ControlPanel />
          {timerWindow && <TimerDisplay window={timerWindow} />}
        </div>
      </div>
    </TimerContext.Provider>
  );
}

export default App;
