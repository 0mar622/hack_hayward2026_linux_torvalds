import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("networking");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript: text, mode }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Conversation Assistant</h1>

      <textarea
        placeholder="Paste conversation..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%" }}
      />

      <br /><br />

      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="networking">Networking</option>
        <option value="interview">Interview</option>
        <option value="pitch">Pitch</option>
      </select>

      <button onClick={analyze} style={{ marginLeft: 10 }}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>

          {mode === "networking" && (
            <>
              <p><b>Name:</b> {result.name}</p>
              <p><b>Summary:</b> {result.summary}</p>
              <p><b>Opportunity:</b> {result.opportunity}</p>
              <p><b>Follow-up:</b> {result.follow_up}</p>
              <p><b>Timing:</b> {result.follow_up_timing}</p>
            </>
          )}

          {mode === "interview" && (
            <>
              <p><b>Summary:</b> {result.summary}</p>
            </>
          )}

          {mode === "pitch" && (
            <>
              <p><b>Summary:</b> {result.summary}</p>

              <p><b>Investor Feedback:</b></p>
              <ul>
                {result.investor_feedback?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <p><b>Action Items:</b></p>
              <ul>
                {result.action_items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <p><b>Clarity:</b> {result.speech_feedback?.clarity}</p>
          <p><b>Confidence:</b> {result.speech_feedback?.confidence}</p>
        </div>
      )}
    </div>
  );
}