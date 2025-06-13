"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Upload, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto h-full">
        {!gpsData.length ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight">GPS Route Viewer</h1>
            <Card className="w-full">
              <div className="p-6">
                <Label htmlFor="file-upload" className="text-sm text-gray-700">
                  JSON-Datei auswählen
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="application/json"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
                {message && (
                  <p className="text-sm text-gray-600 mt-4 border-t pt-4">{message}</p>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="w-full h-[calc(100vh-80px)] flex flex-col overflow-hidden p-0">
            {/* Topbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
              <div className="flex items-center text-sm text-gray-800">
                <MapPin size={18} className="text-blue-500" />
                <span>{gpsData.length} Punkte geladen</span>
              </div>
              <div className="flex items-center">
                <Label htmlFor="file-upload" className="sr-only">Datei ändern</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Datei ändern
                </Button>
              </div>
            </div>

            {/* Map ohne Abstand */}
            <div className="flex-grow w-full">
              <Map data={gpsData} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
