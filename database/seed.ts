import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const ROOT_DIR = path.resolve(__dirname, "../");
const STORIES_TS_PATH = path.join(ROOT_DIR, "frontend/src/lib/stories.ts");

function parseStories() {
  console.log(`Reading stories file: ${STORIES_TS_PATH}`);
  const content = fs.readFileSync(STORIES_TS_PATH, "utf8");

  // Locate the array start
  const arrayStart = content.indexOf("export const STORIES: Story[] =");
  if (arrayStart === -1) {
    throw new Error("Could not find start of STORIES array");
  }

  const equalIndex = content.indexOf("=", arrayStart);
  if (equalIndex === -1) {
    throw new Error("Could not find '=' in STORIES definition");
  }

  const startIndex = content.indexOf("[", equalIndex);
  if (startIndex === -1) {
    throw new Error("Could not find '[' after '='");
  }

  let jsonStr = content.slice(startIndex).trim();
  if (jsonStr.endsWith(";")) {
    jsonStr = jsonStr.slice(0, -1);
  }

  return JSON.parse(jsonStr);
}

function mapToLocalCdn(url: string | undefined, type: "images" | "audio"): string {
  if (!url || !url.startsWith("http")) return url || "";
  
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  
  // If it's already a local CDN url, rewrite local port to the actual BACKEND_URL
  if (url.startsWith("http://localhost:3001")) {
    return url.replace("http://localhost:3001", backendUrl);
  }
  if (url.startsWith(backendUrl)) {
    return url;
  }
  
  // Generate unique filename matching download_assets.py logic
  let filename = "";
  const idx = url.indexOf("stories/");
  if (idx !== -1) {
    const pathPart = url.substring(idx);
    filename = pathPart.replace(/\//g, "_").replace(/:/g, "_").replace(/\?/g, "_").replace(/&/g, "_");
  } else {
    filename = url.substring(url.lastIndexOf("/") + 1);
  }
  
  return `${backendUrl}/cdn/${type}/${filename}`;
}

async function main() {
  console.log("Seeding database...");

  const rawStories = parseStories();
  console.log(`Loaded ${rawStories.length} raw stories.`);

  // Clear existing stories
  await prisma.story.deleteMany();
  console.log("Cleared existing stories.");

  for (const s of rawStories) {
    // Map cover image
    const coverImageUrl = mapToLocalCdn(s.coverImageUrl, "images");

    // Map pages
    const mappedPages = (s.pages || []).map((page: any) => {
      return {
        ...page,
        image: mapToLocalCdn(page.image, "images"),
        audioUrl: page.audioUrl ? mapToLocalCdn(page.audioUrl, "audio") : undefined,
      };
    });

    await prisma.story.create({
      data: {
        id: s.id,
        title: s.title,
        slug: s.slug,
        category: s.category,
        age: s.age,
        duration: s.duration,
        rating: s.rating,
        audio: s.audio,
        color: s.color,
        badgeColor: s.badgeColor,
        image: s.image,
        coverImageUrl: coverImageUrl,
        description: s.description,
        moral: s.moral,
        audioDuration: s.audioDuration,
        author: s.author,
        pages: JSON.stringify(mappedPages),
      },
    });

    console.log(`✓ Seeded story: ${s.title}`);
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
