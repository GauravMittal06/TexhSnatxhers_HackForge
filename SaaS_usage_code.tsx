import React, { useState } from "react";

type Service = {
  name: string;
};

type Response = "Yes" | "Rarely" | "Not at all";

export default function SaaSCheckinApp() {
  const [page, setPage] = useState<"welcome" | "survey" | "analysis">(
    "welcome"
  );

  const [services] = useState<Service[]>([
    { name: "Notion" },
    { name: "Figma" },
    { name: "Slack" },
  ]);

  const [responses, setResponses] = useState<Record<string, Response | null>>(
    Object.fromEntries(services.map((s) => [s.name, null]))
  );

  const [history, setHistory] = useState<Record<string, Response[]>>(
    Object.fromEntries(services.map((s) => [s.name, []]))
  );

  const [cancelService, setCancelService] = useState<string | null>(null);

  const handleSubmit = () => {
    const updatedHistory = { ...history };
    services.forEach((s) => {
      if (responses[s.name]) {
        updatedHistory[s.name] = [
          ...updatedHistory[s.name],
          responses[s.name] as Response,
        ];
      }
    });
    setHistory(updatedHistory);

    // ✅ Reset responses so buttons don’t stay blue
    setResponses(Object.fromEntries(services.map((s) => [s.name, null])));

    setPage("analysis");
  };

  const calculateUsage = (answers: Response[]) => {
    const yesCount = answers.filter((a) => a === "Yes").length;
    const rarelyCount = answers.filter((a) => a === "Rarely").length;
    const noCount = answers.filter((a) => a === "Not at all").length;
    const total = answers.length || 1;

    const score = (yesCount * 2 + rarelyCount * 1) / (total * 2);

    return {
      score,
      label:
        score < 0.3
          ? "Recommended to Cancel"
          : score < 0.7
          ? "Moderate Usage"
          : "Keep It",
    };
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Welcome Page */}
      {page === "welcome" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold">Smart SaaS Tracker</h1>
          <p className="text-gray-600">
            Track your tools. Save money. Cancel what you don’t use.
          </p>
          <button
            onClick={() => setPage("survey")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Let’s Dive In
          </button>
        </div>
      )}

      {/* Survey Page */}
      {page === "survey" && (
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-xl font-bold mb-2">SaaS Usage Check-in</h2>
          {services.map((s) => (
            <div key={s.name} className="space-y-2">
              <p className="text-gray-700">Do you use {s.name} regularly?</p>
              <div className="flex space-x-2">
                {(["Yes", "Rarely", "Not at all"] as Response[]).map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      setResponses((prev) => ({ ...prev, [s.name]: r }))
                    }
                    className={`flex-1 p-2 rounded-lg shadow ${
                      responses[s.name] === r
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white w-full py-2 rounded-lg"
          >
            Submit Check-in
          </button>
        </div>
      )}

      {/* Analysis Page */}
      {page === "analysis" && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-2">Usage Stats</h2>
          {services.map((s) => {
            const { score, label } = calculateUsage(history[s.name]);
            const percentage = Math.round(score * 100);
            const color =
              percentage < 30
                ? "bg-red-500"
                : percentage < 70
                ? "bg-yellow-400"
                : "bg-green-500";
            return (
              <div
                key={s.name}
                className="bg-white p-3 rounded-lg shadow space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{s.name}</span>
                  <button
                    onClick={() => setCancelService(s.name)}
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
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            );
          })}
          <button
            onClick={() => setPage("survey")}
            className="bg-blue-600 text-white w-full py-2 rounded-lg"
          >
            Take Another Check-in
          </button>
          <button
            onClick={() => setPage("welcome")}
            className="bg-gray-600 text-white w-full py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Cancel Page */}
      {cancelService && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 w-80">
            <h2 className="text-xl font-bold">Cancel {cancelService}?</h2>
            <p className="text-gray-600">
              You can stop recurring payments for {cancelService}. Do you want
              to proceed?
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => {
                  alert(`${cancelService} cancelled (demo).`);
                  setCancelService(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setCancelService(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

