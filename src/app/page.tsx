"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("../components/MapViewer"), { ssr: false });

export default function HomePage() {
  const [gpsData, setGpsData] = useState<{ latitude: number; longitude: number }[]>([]);
  const [message, setMessage] = useState<string>("");

  function extractPointsFromJson(obj: any): { latitude: number; longitude: number }[] {
    const rawPoints = obj.points;
    if (Array.isArray(rawPoints)) {
      return rawPoints
        .filter((pt) => pt.lat && pt.lon)
        .map((pt) => ({
          latitude: pt.lat,
          longitude: pt.lon,
        }));
    }
    return [];
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const points = extractPointsFromJson(json);
        if (points.length > 0) {
          setGpsData(points);
          setMessage(`${points.length} Punkte erfolgreich geladen.`);
        } else {
          setGpsData([]);
          setMessage("⚠️ Keine GPS-Punkte gefunden.");
        }
      } catch (err) {
        console.error("Fehler beim Parsen der Datei:", err);
        setMessage("❌ Ungültige JSON-Datei.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">GPS Route Viewer</h1>
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      {message && <p className="text-sm text-gray-700">{message}</p>}
      {gpsData.length > 0 && <Map data={gpsData} />}
    </div>
  );
}
