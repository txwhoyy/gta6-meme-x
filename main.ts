// Entry program for the gta6-meme-x-01 make.fun bounty.
//
// The entry itself is a public post on X; this repository only points at it.
// When the grader runs this program it expects POST.json to be handed over,
// so that is what happens here: read POST.json from the bot directory, check
// that it really names an X post, then place a copy in the output directory.
//
// Both locations can be overridden, which is how the local test run works:
//   MAKEFUN_BOT_DIR     directory holding POST.json   (default: /bot)
//   MAKEFUN_OUTPUT_DIR  directory receiving the copy  (default: /output)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postFileName = "POST.json";

// The hosts an X post address may live on; a "www." or "mobile." prefix on
// either of them is fine and is stripped before the comparison.
const postHosts = ["x.com", "twitter.com"];

function fail(reason: string): never {
  console.error(`meme-x entry: ${reason}`);
  process.exit(1);
}

function readPostFile(path: string): string {
  if (!existsSync(path)) {
    fail(`no POST.json found at ${path}`);
  }
  try {
    return readFileSync(path, "utf8");
  } catch (err) {
    fail(`could not read ${path}: ${(err as Error).message}`);
  }
}

interface PostRef {
  url: string;
  handle: string;
  id: string;
}

// Parse the address properly instead of pattern-matching the raw string:
// the URL parser rejects malformed input on its own, and checking the host
// and the path segments one by one keeps odd look-alike addresses out.
function postUrlFrom(raw: string): PostRef {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    fail("POST.json is not valid JSON");
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    fail('POST.json must be a JSON object carrying a "url" field');
  }
  const url = (data as { url?: unknown }).url;
  if (typeof url !== "string" || url.length === 0) {
    fail('POST.json does not carry a string "url"');
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(`"${url}" cannot be parsed as a URL at all`);
  }
  const host = parsed.hostname.replace(/^(www\.|mobile\.)/, "");
  if (parsed.protocol !== "https:" || !postHosts.includes(host)) {
    fail(`"${url}" is not an https address on x.com or twitter.com`);
  }
  const segments = parsed.pathname.split("/").filter((part) => part !== "");
  const [handle, kind, id] = segments;
  if (
    segments.length !== 3 ||
    kind !== "status" ||
    !/^[A-Za-z0-9_]+$/.test(handle) ||
    !/^\d+$/.test(id)
  ) {
    fail(
      `"${url}" is not an X post address ` +
        "(expected https://x.com/<handle>/status/<numeric id>)",
    );
  }
  return { url, handle, id };
}

const sourcePath = join(botDir, postFileName);
const raw = readPostFile(sourcePath);
const post = postUrlFrom(raw);

mkdirSync(outputDir, { recursive: true });
const targetPath = join(outputDir, postFileName);
writeFileSync(targetPath, raw);
console.log(
  `meme-x entry: copied POST.json (post ${post.id} by @${post.handle}) to ${targetPath}`,
);
