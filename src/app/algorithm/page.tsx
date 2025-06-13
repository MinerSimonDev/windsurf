"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { detectHalse } from "@/app/utils/detectHalse";
import { MapPin, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Map = dynamic(() => import("../../components/MapViewer"), { ssr: false });

export default function AlgorithmPage() {
  const searchParams = useSearchParams();
  const file = searchParams.get("file");

  const [allPoints, setAllPoints] = useState<
    { latitude: number; longitude: number; isHalse?: boolean }[]
  >([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!file) {
      setMessage("⚠️ Keine Datei ausgewählt.");
      return;
    }
    // Lade JSON von API
    fetch(`/api/loadRoute?file=${encodeURIComponent(file)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Datei konnte nicht geladen werden");
        return res.json();
      })
      .then((json) => {
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
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Fehler beim Laden der Datei.");
      });
  }, [file]);

  if (!file)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Keine Datei ausgewählt.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto h-full flex flex-col">
        {/* Zurück Button */}
        <div className="mb-4">
          <Link href="/" passHref>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Zurück zur Hauptseite
            </Button>
          </Link>
        </div>

        {!allPoints.length ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight">
              Algorithmus: Halsen erkennen
            </h1>
            {message && (
              <p className="text-sm text-gray-600 mt-4 border-t pt-4">{message}</p>
            )}
          </div>
        ) : (
          <Card className="w-full flex-grow flex flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <MapPin size={18} className="text-blue-500" />
                <span>{allPoints.length} Punkte geladen</span>
                {message && <span className="text-red-500 ml-4">{message}</span>}
              </div>
            </div>

            <div className="flex-grow w-full">
              <Map data={allPoints} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
