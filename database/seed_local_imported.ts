import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const ROOT_DIR = path.resolve(__dirname, "../");
const JSON_PATH = path.join(ROOT_DIR, "scratch/local_imported_stories.json");

function mapToLocalCdn(url: string | undefined): string {
  if (!url || !url.startsWith("http")) return url || "";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  
  if (url.startsWith("http://localhost:3001")) {
    return url.replace("http://localhost:3001", backendUrl);
  }
  return url;
}

async function main() {
  console.log("Seeding local imported stories...");

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Error: JSON file not found at ${JSON_PATH}. Run the import script first.`);
    process.exit(1);
  }

  const stories = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  console.log(`Loaded ${stories.length} stories from JSON.`);

  for (const s of stories) {
    const coverImageUrl = mapToLocalCdn(s.coverImageUrl);

    const mappedPages = (s.pages || []).map((page: any) => {
      return {
        ...page,
        image: mapToLocalCdn(page.image),
        audioUrl: page.audioUrl ? mapToLocalCdn(page.audioUrl) : undefined,
      };
    });

    await prisma.story.upsert({
      where: { id: s.id },
      update: {
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
      create: {
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

    console.log(`✓ Seeded/Updated story [ID: ${s.id}]: ${s.title}`);
  }

  console.log("Local stories seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
