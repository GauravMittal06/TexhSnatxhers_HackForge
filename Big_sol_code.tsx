import React, { useState } from "react";

type Service = {
  name: string;
  count: number;
};

export default function App() {
  const [screen, setScreen] = useState<
    "dashboard" | "survey" | "summary" | "scale" | "cancel"
  >("dashboard");

  const [services, setServices] = useState<Service[]>([
    { name: "Netflix", count: 0 },
    { name: "Prime Video", count: 0 },
    { name: "Disney+ Hotstar", count: 0 },
  ]);

  // Pool of shows grouped by service
  const showPool: Record<string, string[]> = {
    Netflix: ["Stranger Things", "Wednesday", "Money Heist", "The Witcher"],
    "Prime Video": ["The Boys", "Jack Ryan", "Reacher", "Invincible"],
    "Disney+ Hotstar": ["Loki", "Andor", "The Mandalorian", "Hawkeye"],
  };

  const [selected, setSelected] = useState<string | null>(null);
  const [cancelService, setCancelService] = useState<string | null>(null);
  const [currentSurveyShows, setCurrentSurveyShows] = useState<
    { service: string; title: string }[]
  >([]);

  // Function to refresh new shows for survey
  const refreshSurvey = () => {
    const picks = Object.entries(showPool).map(([service, titles]) => {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      return { service, title: randomTitle };
    });
    setCurrentSurveyShows(picks);
    setSelected(null); // reset previous selection
  };

  const handleSubmitSurvey = () => {
    if (selected) {
      setServices(prev =>
        prev.map(s =>
          s.name === selected ? { ...s, count: s.count + 1 } : s
        )
      );
      setSelected(null);
      setScreen("summary");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Dashboard */}
      {screen === "dashboard" && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-2">Your Subscriptions</h2>
          <ul className="space-y-2">
            {services.map(s => (
              <li
                key={s.name}
                className="flex justify-between bg-white p-3 rounded-lg shadow"
              >
                <span>{s.name}</span>
                <span className="text-sm text-gray-500">Active</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              refreshSurvey();
              setScreen("survey");
            }}
            className="bg-green-600 text-white w-full py-2 rounded-lg mt-4"
          >
            Take Streaming Survey
          </button>
          <button
            onClick={() => setScreen("scale")}
            className="bg-purple-600 text-white w-full py-2 rounded-lg mt-2"
          >
            View Usage Scale
          </button>
        </div>
      )}

      {/* Survey */}
      {screen === "survey" && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-2">Streaming Survey</h2>
          <p className="text-gray-600">What did you watch recently?</p>
          <div className="space-y-2">
            {currentSurveyShows.map(option => (
              <button
                key={option.service}
                onClick={() => setSelected(option.service)}
                className={`w-full p-3 rounded-lg ${
                  selected === option.service
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                } shadow`}
              >
                {option.title}
              </button>
            ))}
          </div>
          <button
            disabled={!selected}
            onClick={handleSubmitSurvey}
            className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4 disabled:bg-gray-400"
          >
            Submit Survey
          </button>
        </div>
      )}

      {/* Summary */}
      {screen === "summary" && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-2">Usage Summary</h2>
          <ul className="space-y-2">
            {services
              .sort((a, b) => b.count - a.count)
              .map(s => (
                <li
                  key={s.name}
                  className="flex justify-between bg-white p-3 rounded-lg shadow"
                >
                  <span>{s.name}</span>
                  <span className="text-sm text-gray-600">
                    {s.count} votes
                  </span>
                </li>
              ))}
          </ul>
          <p className="text-gray-700 text-sm">
            📢 If a service stays low after 3 months, we’ll suggest cancelling it.
          </p>
          <button
            onClick={() => setScreen("dashboard")}
            className="bg-green-600 text-white w-full py-2 rounded-lg mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Usage Scale */}
      {screen === "scale" && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-2">Usage Scale</h2>
          {services.map(s => {
            const percentage = Math.min(s.count * 20, 100); // demo scale
            const color =
              percentage < 40
                ? "bg-red-500"
                : percentage < 70
                ? "bg-yellow-400"
                : "bg-green-500";
            return (
              <div
                key={s.name}
                className="bg-white p-3 rounded-lg shadow space-y-2"
              >
                <div className="flex justify-between">
                  <span>{s.name}</span>
                  <button
                    onClick={() => {
                      setCancelService(s.name);
                      setScreen("cancel");
                    }}
                    className="text-red-600 underline text-sm"
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${color} h-3 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {percentage < 40
                    ? "Recommended to Cancel"
                    : percentage < 70
                    ? "Moderate Usage"
                    : "Keep It"}
                </p>
              </div>
            );
          })}
          <button
            onClick={() => setScreen("dashboard")}
            className="bg-gray-600 text-white w-full py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Cancel Page */}
      {screen === "cancel" && cancelService && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-xl font-bold">Cancel {cancelService}?</h2>
          <p className="text-gray-600">
            You can stop recurring payments for {cancelService}.  
            Do you want to proceed?
          </p>
          <button
            onClick={() => setScreen("dashboard")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Confirm Cancel
          </button>
          <button
            onClick={() => setScreen("scale")}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
