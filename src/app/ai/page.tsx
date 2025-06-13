"use client";

import { useState } from "react";
import { detectHalse } from "../utils/detectHalse";

export default function AIPage() {
  const [results, setResults] = useState<any[]>([]);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target?.result as string);
      const detected = detectHalse(json);
      setResults(detected);
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Halsen-Erkennung (AI)</h1>
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      <ul>
        {results.map((r, i) => (
          <li key={i}>Halse bei Index {r.index} (Kurswechsel: {r.delta}°)</li>
        ))}
      </ul>
    </div>
  );
}