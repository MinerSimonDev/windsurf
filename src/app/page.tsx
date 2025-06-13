import fs from "fs";
import path from "path";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RouteMeta {
  file: string;
  date?: string;
  country?: string;
  village?: string;
}

export default async function HomePage() {
  const dataDir = path.join(process.cwd(), "src/app/data");
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));

  const routes: RouteMeta[] = files.map((file) => {
    try {
      const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
      const json = JSON.parse(raw);
      return {
        file,
        date: json.date,
        country: json.country,
        village: json.village,
      };
    } catch {
      return { file };
    }
  });

  return (
    <main className="min-h-screen bg-white px-8 py-12 max-w-5xl mx-auto flex flex-col">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 select-none">
          Windsurf Sessions
        </h1>
        <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Übersicht deiner gespeicherten Windsurfing-Routen. Klicke auf eine Karte, um die Details und Analyse zu sehen.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {routes.map((rt) => (
          <Link key={rt.file} href={`/algorithm?file=${encodeURIComponent(rt.file)}`} passHref>
            <Card
              className="cursor-pointer p-6 flex flex-col justify-center rounded-xl border border-gray-200 shadow-sm
                hover:shadow-md transition-shadow duration-300 ease-in-out
                bg-white text-gray-900"
            >
              {rt.date && (
                <p className="text-lg font-semibold leading-tight">
                  📅 {new Date(rt.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
              <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                {rt.village && <p>🏘️ {rt.village}</p>}
                {rt.country && <p>🌍 {rt.country}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
