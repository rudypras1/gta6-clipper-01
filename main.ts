// Entry program for the make.fun bounty "Clip GTA 6 for the most YouTube views".
//
// The house reads VIDEO.json from this repository and reads the named video
// through the YouTube Data API; places go by the video's views at the
// deadline. This program's only job is to hand VIDEO.json to the grader:
// it validates the file, then copies it byte for byte into the output
// directory. It prints nothing and writes the same bytes on every run.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const raw = readFileSync(join(botDir, "VIDEO.json"), "utf8");

// Validate: a JSON object whose url names one YouTube video in one of the
// shapes the bounty accepts (shorts, watch, or youtu.be), with an 11-char id.
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("VIDEO.json must be a JSON object");
}
const url = (parsed as Record<string, unknown>).url;
if (typeof url !== "string") {
  throw new Error("VIDEO.json must carry a string url");
}
const videoPattern =
  /^https:\/\/(www\.|m\.)?youtube\.com\/(shorts\/[A-Za-z0-9_-]{11}|watch\?v=[A-Za-z0-9_-]{11})|^https:\/\/youtu\.be\/[A-Za-z0-9_-]{11}/;
if (!videoPattern.test(url)) {
  throw new Error("url is not a YouTube video address");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "VIDEO.json"), raw);
