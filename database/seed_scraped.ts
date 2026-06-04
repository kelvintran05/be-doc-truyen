import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const SCRAPED_JSON_PATH = path.resolve(__dirname, "../scratch/scraped_stories.json");

async function main() {
  console.log("Starting DB seeding for scraped stories...");

  if (!fs.existsSync(SCRAPED_JSON_PATH)) {
    console.error(`Error: Scraped stories file not found at ${SCRAPED_JSON_PATH}`);
    console.error("Please run the scraper script first: python3 scratch/scrape_stories.py");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(SCRAPED_JSON_PATH, "utf8");
  const scrapedStories = JSON.parse(fileContent);

  console.log(`Loaded ${scrapedStories.length} scraped stories.`);

  for (const s of scrapedStories) {
    // Check if a story with the same slug already exists
    const existing = await prisma.story.findUnique({
      where: { slug: s.slug },
    });

    const storyData = {
      title: s.title,
      category: s.category,
      age: s.age,
      duration: s.duration,
      rating: s.rating || 4.8,
      audio: s.audio,
      color: s.color,
      badgeColor: s.badgeColor,
      image: s.image,
      coverImageUrl: s.coverImageUrl,
      description: s.description,
      moral: s.moral,
      audioDuration: s.audioDuration || (s.pages.length * 15),
      author: s.author || "Runruneando",
      pages: JSON.stringify(s.pages),
    };

    if (existing) {
      // Update existing story
      await prisma.story.update({
        where: { slug: s.slug },
        data: storyData,
      });
      console.log(`✓ Updated existing story: "${s.title}" (slug: ${s.slug})`);
    } else {
      // Create new story
      await prisma.story.create({
        data: {
          id: s.id, // Keep the assigned ID
          slug: s.slug,
          ...storyData,
        },
      });
      console.log(`✓ Created new story: "${s.title}" (ID: ${s.id}, slug: ${s.slug})`);
    }
  }

  console.log("Scraped stories database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
