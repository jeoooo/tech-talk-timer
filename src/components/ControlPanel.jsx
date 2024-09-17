import { useContext, useState } from "react";
import { TimerContext } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  AlertCircleIcon,
  XCircleIcon,
} from "lucide-react";

function ControlPanel() {
  const { time, setTime, isRunning, setIsRunning, setLogo, setEventLogo } =
    useContext(TimerContext);
  const [error, setError] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [eventLogoPreview, setEventLogoPreview] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleTimeChange = (unit, value) => {
    setTime((prevTime) => ({
      ...prevTime,
      [unit]: parseInt(value, 10) || 0,
    }));
  };

  const handleStartStop = () => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setError(true);
    } else {
      setError(false);
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setError(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setLogo(fileURL);
      setLogoPreview(fileURL);
    }
  };

  const handleEventLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setEventLogo(fileURL);
      setEventLogoPreview(fileURL);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleRemoveEventLogo = () => {
    setEventLogo(null);
    setEventLogoPreview(null);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Timer Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {["hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} className="flex flex-col">
              <Label htmlFor={`${unit}-input`} className="mb-1 capitalize">
                {unit}
              </Label>
              <Input
                id={`${unit}-input`}
                type="number"
                min="0"
                max={unit === "hours" ? "23" : "59"}
                value={time[unit]}
                onChange={(e) => handleTimeChange(unit, e.target.value)}
                disabled={isRunning}
                className="w-full text-center"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircleIcon className="mr-2 h-5 w-5" />
            <span>Time must be set before starting the timer!</span>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          <Button
            onClick={handleStartStop}
            variant={isRunning ? "destructive" : "default"}
            className="w-32 h-12 text-lg font-semibold"
          >
            {isRunning ? (
              <>
                <PauseIcon className="mr-2 h-5 w-5" /> Pause
              </>
            ) : (
              <>
                <PlayIcon className="mr-2 h-5 w-5" /> Start
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-32 h-12 text-lg font-semibold"
          >
            <RotateCcwIcon className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>

        <div className="text-2xl font-bold text-center" aria-live="polite">
          {`${time.hours.toString().padStart(2, "0")}:${time.minutes
            .toString()
            .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
        </div>
      </CardContent>

      {/* Custom Accordion for Advanced Settings */}
      <div>
        <button
          onClick={toggleAccordion}
          className="w-full text-left py-2 px-4 font-bold text-lg bg-gray-100 hover:bg-gray-200 rounded-t-md"
        >
          Advanced Settings {isAccordionOpen ? "▲" : "▼"}
        </button>
        {isAccordionOpen && (
          <div className="p-4 border-t border-gray-300 bg-gray-50 rounded-b-md">
            <div className="mb-4">
              <Label htmlFor="event-logo" className="mb-2">
                Event Logo / Branding
              </Label>
              <Input
                type="file"
                id="event-logo"
                accept="image/*"
                onChange={handleEventLogoChange}
              />
            </div>
            {eventLogoPreview && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={eventLogoPreview}
                  alt="Event Logo"
                  className="h-24 w-24 object-cover rounded-md"
                />
                <Button
                  onClick={handleRemoveEventLogo}
                  variant="outline"
                  className="mt-4"
                >
                  <XCircleIcon className="mr-2 h-5 w-5" /> Remove Event Logo
                </Button>
              </div>
            )}
            <div className="mb-4 mt-6">
              <Label htmlFor="org-logo" className="mb-2">
                Organization Logo
              </Label>
              <Input
                type="file"
                id="org-logo"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            {logoPreview && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={logoPreview}
                  alt="Organization Logo"
                  className="h-24 w-24 object-cover rounded-md"
                />
                <Button
                  onClick={handleRemoveLogo}
                  variant="outline"
                  className="mt-4"
                >
                  <XCircleIcon className="mr-2 h-5 w-5" /> Remove Logo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default ControlPanel;
