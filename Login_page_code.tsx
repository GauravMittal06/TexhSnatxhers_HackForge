import React, { useState } from "react";

export default function LoginPermissions() {
  const [screen, setScreen] = useState<"login" | "permissions">("login");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState({
    sms: false,
    notifications: false,
    transactions: false,
  });

  const handleToggle = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allConsentsGiven = Object.values(permissions).every(Boolean);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* Login Screen */}
      {screen === "login" && (
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-gray-600 text-center">Log in to manage your subscriptions</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => email && setScreen("permissions")}
            disabled={!email}
            className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4 disabled:bg-gray-400"
          >
            Continue
          </button>
        </div>
      )}

      {/* Permissions Screen */}
      {screen === "permissions" && (
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-6">
          <h2 className="text-xl font-bold text-center">Permissions Required</h2>
          <p className="text-gray-600 text-sm text-center">
            To give you the best experience, we need access to the following:
          </p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">📩 SMS Access</span>
              <button
                onClick={() => handleToggle("sms")}
                className={`px-4 py-1 rounded-full ${
                  permissions.sms ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {permissions.sms ? "Allowed" : "Deny"}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">🔔 Notification Tracking</span>
              <button
                onClick={() => handleToggle("notifications")}
                className={`px-4 py-1 rounded-full ${
                  permissions.notifications ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {permissions.notifications ? "Allowed" : "Deny"}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">💳 Transaction Monitoring</span>
              <button
                onClick={() => handleToggle("transactions")}
                className={`px-4 py-1 rounded-full ${
                  permissions.transactions ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                {permissions.transactions ? "Allowed" : "Deny"}
              </button>
            </div>
          </div>

          <a
            href="https://www.figma.com/make/ED167J2G5enqs5e1mhxnKs/MAIN-PAGE?node-id=0-1&t=9jQPADrllJubKiUl-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              disabled={!allConsentsGiven}
              className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4 disabled:bg-gray-400"
            >
              Continue
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
