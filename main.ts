// Entry program for the gta6-meme-x-01 bounty on make.fun.
//
// The entry itself is a public post on X. This repository carries a
// pointer to that post (POST.json) and a copy of the meme image
// (meme.png). When run, the program checks that the pointer really
// names an X post, then delivers both files to the output directory
// for the grader.
//
// Both directories come from the environment, with sandbox defaults:
//   MAKEFUN_BOT_DIR     folder holding POST.json and meme.png (/bot)
//   MAKEFUN_OUTPUT_DIR  folder that receives the copies       (/output)

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function die(message: string): never {
  console.error(`gta6-meme-x: ${message}`);
  process.exit(1);
}

// Read POST.json and pull the post's handle and numeric id out of its
// URL, rejecting anything that is not an https link to a status page
// on x.com or twitter.com (a www. or mobile. prefix is acceptable).
function readPostRef(): { handle: string; postId: string } {
  const postPath = join(botDir, "POST.json");
  if (!existsSync(postPath)) {
    die(`POST.json not found in ${botDir}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(readFileSync(postPath, "utf8"));
  } catch {
    die("POST.json could not be parsed as JSON");
  }

  const url =
    data !== null && typeof data === "object"
      ? (data as { url?: unknown }).url
      : undefined;
  if (typeof url !== "string" || url.trim() === "") {
    die('POST.json does not contain a "url" string');
  }

  const match =
    /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)\/?$/.exec(
      url.trim(),
    );
  if (!match) {
    die(
      `"${url}" is not an X post address ` +
        "(expected https://x.com/<handle>/status/<numeric id>)",
    );
  }
  return { handle: match[1], postId: match[2] };
}

const post = readPostRef();

const memePath = join(botDir, "meme.png");
if (!existsSync(memePath)) {
  die(`meme.png not found in ${botDir}`);
}

// Guard against a renamed or corrupt image being handed over: every
// real PNG file starts with this fixed 8-byte signature.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const memeBytes = readFileSync(memePath);
const looksPng =
  memeBytes.length >= PNG_SIGNATURE.length &&
  PNG_SIGNATURE.every((byte, index) => memeBytes[index] === byte);
if (!looksPng) {
  die("meme.png is not a valid PNG file (bad PNG signature)");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
copyFileSync(memePath, join(outputDir, "meme.png"));

console.log(
  `gta6-meme-x: copied POST.json (post ${post.postId} by @${post.handle}) into ${outputDir}`,
);
console.log(
  `gta6-meme-x: copied meme.png (${memeBytes.length} bytes) into ${outputDir}`,
);
