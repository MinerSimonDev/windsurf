"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { detectHalse } from "@/app/utils/detectHalse";

const Map = dynamic(() => import("../../components/MapViewer"), { ssr: false });

export default function AlgorithmPage() {
  const [allPoints, setAllPoints] = useState<{ latitude: number; longitude: number; isHalse?: boolean }[]>([]);
  const [message, setMessage] = useState<string>("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const rawPoints = json.points;
        if (!rawPoints || rawPoints.length < 2) {
          setMessage("⚠️ Nicht genügend Punkte für Analyse gefunden.");
          return;
        }

        const detected = detectHalse(rawPoints);
        const detectedSet = new Set(detected.map((d) => d.index));

        const gps = rawPoints.map((pt: any, i: number) => ({
          latitude: pt.lat,
          longitude: pt.lon,
          isHalse: detectedSet.has(i),
        }));

        setAllPoints(gps);
        setMessage(`${detected.length} mögliche Halsen erkannt.`);
      } catch (err) {
        console.error("Fehler beim Parsen:", err);
        setMessage("❌ Fehler beim Parsen der Datei.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Algorithmus: Halsen erkennen</h1>
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      {message && <p className="text-sm text-gray-700">{message}</p>}
      {allPoints.length > 0 && <Map data={allPoints} />}
    </div>
  );
}