import React, { useState } from "react";

type Subscription = {
  name: string;
  renewalDate: string;
  usageScore: number; // 0-100
};

export default function RenewingSoon() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { name: "Netflix", renewalDate: "2025-09-10", usageScore: 80 },
    { name: "Spotify", renewalDate: "2025-09-12", usageScore: 30 },
    { name: "Adobe Creative Cloud", renewalDate: "2025-09-15", usageScore: 60 },
  ]);

  const handleCancel = (name: string) => {
    alert(`You are about to cancel ${name}. Redirecting to cancellation page...`);
    // Here you can implement navigation to cancellation page
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🔔 Subscriptions Renewing Soon</h1>

      <div className="w-full max-w-2xl space-y-4">
        {subscriptions.map((sub) => {
          const color =
            sub.usageScore < 40
              ? "bg-red-500"
              : sub.usageScore < 70
              ? "bg-yellow-400"
              : "bg-green-500";

          return (
            <div
              key={sub.name}
              className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{sub.name}</span>
                <button
                  onClick={() => handleCancel(sub.name)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Renewal: {sub.renewalDate}</span>
                <span>Usage Score: {sub.usageScore}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${color} h-3 rounded-full`}
                  style={{ width: `${sub.usageScore}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-700">
                {sub.usageScore < 40
                  ? "Low engagement — consider cancelling!"
                  : sub.usageScore < 70
                  ? "Moderate usage — keep an eye on it."
                  : "Active usage — good to continue."}
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>💡 Tip: Check usage trends before renewal</span>
                <span>🔔 Enable reminder for next renewal</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
