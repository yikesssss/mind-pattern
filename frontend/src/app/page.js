"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;
    setLoading(true);

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);

    try {
      const res = await axios.post("/api/analyze", { text: input });
      setMessages((prev) => [...prev, { text: res.data.response, sender: "ai" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "Failed to get a response.", sender: "ai" }]);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Mindpattern: a thought reframer</h1>

      {/* Chat Container */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 space-y-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 max-w-xs rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black mr-auto"
              }`}
            dangerouslySetInnerHTML={{
              __html: msg.text
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **bold** to <b>bold</b>
                .replace(/\*(.*?)\*/g, "<i>$1</i>"), // Convert *italic* to <i>italic</i>
            }}
          />
        ))}
      </div>

      {/* Input & Button */}
      <div className="flex mt-4 w-full max-w-lg">
        <textarea
          className="flex-1 p-2 border rounded-md"
          rows="2"
          placeholder="Enter your thought..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Send"}
        </button>
      </div>
    </div>
  );
}
