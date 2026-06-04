import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const JSON_PATH = path.resolve(__dirname, "../scratch/english_lessons_full.json");

// Map lesson ID to Unit classification
function getUnitInfo(lessonId: number, index: number, courseLevel: string) {
  if (courseLevel === "LV1") {
    // Unit 1: My Body & Senses
    if ([101, 105, 106, 139, 144, 145].includes(lessonId)) {
      return {
        title: "Unit 1: My Body & Senses",
        description: "Học các từ vựng về bộ phận cơ thể, khuôn mặt, các giác quan và chuyển động cơ bản của bé.",
        order: 1
      };
    }
    // Unit 2: Animals & Nature
    if ([111, 116, 118, 121, 125, 127, 142, 149, 152, 167].includes(lessonId)) {
      return {
        title: "Unit 2: Animals & Nature",
        description: "Gặp gỡ các loài động vật ngộ nghĩnh tại sở thú, khủng long thời tiền sử và thiên nhiên xung quanh bé.",
        order: 2
      };
    }
    // Unit 3: Colors, Shapes & Sizes
    if ([102, 112, 153, 154, 157, 163, 166].includes(lessonId)) {
      return {
        title: "Unit 3: Colors, Shapes & Sizes",
        description: "Làm quen với màu sắc rực rỡ, các hình học cơ bản và khái niệm to nhỏ, nổi chìm thú vị.",
        order: 3
      };
    }
    // Unit 4: Food & Kitchen Fun
    if ([103, 140, 156, 165].includes(lessonId)) {
      return {
        title: "Unit 4: Food & Kitchen Fun",
        description: "Khám phá các món ăn thơm ngon, kem ngọt ngào, bắp rang bơ và các phép lịch sự trên bàn ăn.",
        order: 4
      };
    }
    // Unit 5: Daily Routines & School
    if ([120, 123, 137, 147, 158, 160].includes(lessonId)) {
      return {
        title: "Unit 5: Daily Routines & School",
        description: "Tìm hiểu thói quen hàng ngày, các khoảng thời gian trong ngày, lớp học vui vẻ và các nghề nghiệp quanh bé.",
        order: 5
      };
    }
    // Unit 6: Seasons, Weather & Festivals
    if ([104, 108, 115, 122, 129, 131, 132, 133, 135, 148, 155, 161, 162, 164].includes(lessonId)) {
      return {
        title: "Unit 6: Seasons, Weather & Festivals",
        description: "Khám phá các mùa trong năm, thời tiết nắng mưa, tuyết rơi và các lễ hội Giáng sinh ngập tràn niềm vui.",
        order: 6
      };
    }
    // Unit 7: Feelings & Kindness
    if ([107, 109, 130, 136, 143].includes(lessonId)) {
      return {
        title: "Unit 7: Feelings & Kindness",
        description: "Học cách nhận biết, diễn tả cảm xúc vui buồn và học cách sẻ chia, giúp đỡ bạn bè xung quanh.",
        order: 7
      };
    }
    // Unit 8: Sports, Games & Adventures
    return {
      title: "Unit 8: Sports, Games & Adventures",
      description: "Các trò chơi vận động sôi nổi, tiệc hóa trang đầy màu sắc và những chuyến phiêu lưu kỳ thú.",
      order: 8
    };
  } else {
    // Dynamic grouping for other levels
    const unitIndex = Math.floor(index / 8) + 1;
    return {
      title: `Unit ${unitIndex}: Adventure Theme ${unitIndex}`,
      description: `Khám phá các câu chuyện lý thú và rèn luyện kỹ năng tiếng Anh ở chặng thứ ${unitIndex}.`,
      order: unitIndex
    };
  }
}

async function main() {
  console.log("Starting Course seeding...");

  const scratchDir = path.resolve(__dirname, "../scratch");
  if (!fs.existsSync(scratchDir)) {
    console.error(`Error: Scratch folder not found.`);
    process.exit(1);
  }

  // Find all english_lessons_*.json files
  const files = fs.readdirSync(scratchDir).filter(
    (f) => (f.startsWith("english_lessons_") || f === "english_lessons_full.json") && f.endsWith(".json")
  );

  if (files.length === 0) {
    console.error("Error: No english_lessons_*.json files found.");
    process.exit(1);
  }

  // 1. Delete existing course data to ensure a clean run
  console.log("Cleaning existing Course, Unit, Lesson data...");
  await prisma.lessonPage.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.course.deleteMany({});
  console.log("✓ Database cleaned.");

  for (const filename of files) {
    const filePath = path.join(scratchDir, filename);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const extractedLessons = JSON.parse(rawData);
    
    // Determine level and course metadata from filename
    let level = "LV1";
    let slug = "english-for-kids-lv1";
    let title = "English for Kids - Level 1";

    if (filename.includes("lv2")) {
      level = "LV2";
      slug = "english-for-kids-lv2";
      title = "English for Kids - Level 2";
    } else if (filename.includes("lv3")) {
      level = "LV3";
      slug = "english-for-kids-lv3";
      title = "English for Kids - Level 3";
    } else {
      // Extract from name if pattern is english_lessons_lvX.json
      const match = filename.match(/english_lessons_lv(\d+)\.json/i);
      if (match) {
        const num = match[1];
        level = `LV${num}`;
        slug = `english-for-kids-lv${num}`;
        title = `English for Kids - Level ${num}`;
      }
    }

    console.log(`\n==========================================`);
    console.log(`SEEDING COURSE: ${title} (${level}) from ${filename}`);
    console.log(`==========================================`);

    if (extractedLessons.length === 0) {
      console.log("No lessons to seed for this course.");
      continue;
    }

    const firstLessonSlug = extractedLessons[0].slug;
    const coverImage = `http://localhost:3001/cdn/courses/${level.toLowerCase()}/${firstLessonSlug}/cover.png`;

    // 2. Create the Course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description: `Học tiếng Anh sinh động qua truyện tranh tương tác cùng giọng đọc chuẩn Mỹ và trò chơi vui nhộn thuộc trình độ ${level}.`,
        coverImage,
        level
      }
    });
    console.log(`✓ Created Course: ${course.title} (ID: ${course.id})`);

    // Cache created units to avoid duplicates
    const unitMap = new Map<string, any>();

    for (let idx = 0; idx < extractedLessons.length; idx++) {
      const item = extractedLessons[idx];
      const unitInfo = getUnitInfo(item.id, idx, level);
      
      let unit = unitMap.get(unitInfo.title);
      if (!unit) {
        unit = await prisma.unit.create({
          data: {
            title: unitInfo.title,
            description: unitInfo.description,
            courseId: course.id
          }
        });
        unitMap.set(unitInfo.title, unit);
        console.log(`  ✓ Created Unit: ${unit.title}`);
      }

      // 3. Create Lesson (type: STORY)
      const storyLesson = await prisma.lesson.create({
        data: {
          title: item.title,
          type: "STORY",
          points: 10,
          unitId: unit.id
        }
      });
      console.log(`    ✓ Created STORY Lesson: ${storyLesson.title}`);

      // Create pages for STORY lesson
      for (const p of item.pages) {
        await prisma.lessonPage.create({
          data: {
            pageNumber: p.pageNumber,
            imageUrl: p.image,
            textContent: p.textContent,
            audioUrl: p.audioUrl,
            lessonId: storyLesson.id
          }
        });
      }
      console.log(`      ✓ Added ${item.pages.length} pages to STORY Lesson`);

      // 4. Create Lesson (type: VOCABULARY)
      await prisma.lesson.create({
        data: {
          title: `${item.title} - Vocabulary`,
          type: "VOCABULARY",
          points: 5,
          unitId: unit.id
        }
      });
      console.log(`    ✓ Created VOCABULARY Lesson`);

      // 5. Create Lesson (type: GAME)
      await prisma.lesson.create({
        data: {
          title: `${item.title} - Fun Quiz`,
          type: "GAME",
          points: 15,
          unitId: unit.id
        }
      });
      console.log(`    ✓ Created GAME Lesson`);
    }
  }

  console.log("\nAll courses seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
