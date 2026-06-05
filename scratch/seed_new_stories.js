const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const JSON_PATH = path.join(__dirname, "new_stories.json");

async function main() {
  console.log("Seeding new stories...");

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Error: JSON file not found at ${JSON_PATH}. Run the python script first.`);
    process.exit(1);
  }

  const stories = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  console.log(`Loaded ${stories.length} stories from JSON.`);

  // Auto-generate IDs starting from the max existing ID + 1
  const existingStories = await prisma.story.findMany({ select: { id: true } });
  let maxId = 0;
  if (existingStories.length > 0) {
    maxId = Math.max(...existingStories.map(s => s.id));
  }

  for (const s of stories) {
    maxId++;
    const newId = maxId;
    
    // Check if slug already exists
    const existing = await prisma.story.findFirst({
        where: { slug: s.slug }
    });
    
    if (existing) {
        console.log(`Updating existing story: ${s.title} (ID: ${existing.id})`);
        await prisma.story.update({
            where: { id: existing.id },
            data: {
                title: s.title,
                category: s.category,
                age: s.age,
                duration: s.duration,
                rating: s.rating,
                audio: s.audio,
                color: s.color,
                badgeColor: s.badgeColor,
                image: s.image,
                coverImageUrl: s.coverImageUrl,
                description: s.description,
                moral: s.moral,
                author: s.author,
                audioDuration: s.pages.length * 15,
                pages: JSON.stringify(s.pages),
                // Note: Questions are saved as a related model, but we don't have schema access directly here.
                // We'll just insert the Story first. If you need Quiz DB schema, please update this block.
            }
        });
    } else {
        console.log(`Creating new story: ${s.title} (ID: ${newId})`);
        await prisma.story.create({
            data: {
                id: newId,
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
                coverImageUrl: s.coverImageUrl,
                description: s.description,
                moral: s.moral,
                author: s.author,
                audioDuration: s.pages.length * 15,
                pages: JSON.stringify(s.pages),
            }
        });
    }
  }

  console.log("New stories seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
