import path from "path";
import fs from "fs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get("file");
  if (!file) {
    return new Response("Dateiname fehlt", { status: 400 });
  }

  const dataDir = path.join(process.cwd(), "src/app/data");
  const filePath = path.join(dataDir, file);

  if (!fs.existsSync(filePath)) {
    return new Response("Datei nicht gefunden", { status: 404 });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return new Response(content, {
    headers: { "Content-Type": "application/json" },
  });
}
