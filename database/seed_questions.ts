import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the shape of a quiz question
interface QuizQuestion {
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

// Map story IDs to an array of questions
const STORY_QUESTIONS: Record<number, QuizQuestion[]> = {
  // Story 28: Gigi - Chú Hươu Cao Cổ Cao Nhất Thảo Nguyên
  28: [
    {
      question: "Gigi là loài động vật nào?",
      options: [
        { label: "A", text: "Hươu cao cổ" },
        { label: "B", text: "Ngựa" },
        { label: "C", text: "Sư tử" },
        { label: "D", text: "Voi" },
      ],
      correctAnswer: "A",
      explanation: "Gigi là chú hươu cao cổ, được mô tả là cao nhất trên thảo nguyên."
    },
    {
      question: "Trong câu chuyện, Gigi gặp ai đầu tiên?",
      options: [
        { label: "A", text: "Một con sư tử" },
        { label: "B", text: "Một bầy ngựa" },
        { label: "C", text: "Một con chim" },
        { label: "D", text: "Một con báo" },
      ],
      correctAnswer: "C",
      explanation: "Gigi gặp một con chim đưa lời khuyên khi đang đi tìm bạn bè."
    },
    {
      question: "Bài học chính của câu chuyện là gì?",
      options: [
        { label: "A", text: "Sự kiên trì và giúp đỡ lẫn nhau" },
        { label: "B", text: "Giữ im lặng là tốt nhất" },
        { label: "C", text: "Không nên khám phá thế giới" },
        { label: "D", text: "Luôn chạy trốn khi gặp khó khăn" },
      ],
      correctAnswer: "A",
      explanation: "Câu chuyện nhấn mạnh tầm quan trọng của kiên trì và giúp đỡ bạn bè."
    },
  ],
  // Existing questions for story 2 (Nobita)
  2: [
    {
      question: "Doraemon đã lấy bảo bối gì ra để giúp Nobita?",
      options: [
        { label: "A", text: "Chiếc đèn pin thần kỳ" },
        { label: "B", text: "Chiếc kính 'Hệ Quả Tức Thì'" },
        { label: "C", text: "Cỗ máy thời gian" },
        { label: "D", text: "Chiếc mũ bảo hộ" },
      ],
      correctAnswer: "B",
      explanation: "Doraemon lấy ra chiếc kính 'Hệ Quả Tức Thì' để Nobita thấy hậu quả nếu không nghe lời mẹ."
    },
    {
      question: "Chiếc kính thần kỳ giúp Nobita làm gì?",
      options: [
        { label: "A", text: "Bay lên trời" },
        { label: "B", text: "Tàng hình được" },
        { label: "C", text: "Thấy trước hậu quả nếu không nghe lời mẹ" },
        { label: "D", text: "Nói chuyện với động vật" },
      ],
      correctAnswer: "C",
      explanation: "Chiếc kính cho Nobita thấy những gì sẽ xảy ra trong 5 phút tới nếu không nghe lời mẹ."
    },
    {
      question: "Mẹ Nobita dặn cậu không được làm gì trên giường?",
      options: [
        { label: "A", text: "Nhảy lên giường" },
        { label: "B", text: "Dùng kéo để cắt mô hình" },
        { label: "C", text: "Ăn bánh trên giường" },
        { label: "D", text: "Xem tivi trên giường" },
      ],
      correctAnswer: "B",
      explanation: "Mẹ dặn Nobita không dùng kéo để cắt mô hình trên giường vì dễ bị đứt tay hoặc hỏng nệm."
    },
    {
      question: "Bài học quan trọng nhất Nobita học được là gì?",
      options: [
        { label: "A", text: "Nên chơi cùng Doraemon nhiều hơn" },
        { label: "B", text: "Lời mẹ dặn là để cậu tránh rắc rối, không phải cấm đoán" },
        { label: "C", text: "Nên dùng kéo cẩn thận hơn" },
        { label: "D", text: "Nên xem tivi khi trời mưa" },
      ],
      correctAnswer: "B",
      explanation: "Nobita hiểu rằng lời mẹ dặn giúp cậu tránh rắc rối và bảo an toàn."
    },
  ],
  // Example for story 3 (Sam the shark)
  3: [
    {
      question: "Tên của chú cá mập con trong câu chuyện là gì?",
      options: [
        { label: "A", text: "Lu" },
        { label: "B", text: "Sam" },
        { label: "C", text: "Pip" },
        { label: "D", text: "Tilly" },
      ],
      correctAnswer: "B",
      explanation: "Chú cá mập con trong câu chuyện tên là Sam."
    },
    {
      question: "Tại sao thức ăn dưới đại dương trở nên khan hiếm?",
      options: [
        { label: "A", text: "Bị con người đánh bắt hết" },
        { label: "B", text: "Một luồng hải lưu lạnh buốt tràn qua, các đàn cá phải di cư" },
        { label: "C", text: "Sam ăn hết thức ăn" },
        { label: "D", text: "Bị ô nhiễm môi trường" },
      ],
      correctAnswer: "B",
      explanation: "Luồng hải lưu lạnh khiến các đàn cá di cư, thức ăn khan hiếm."
    },
    {
      question: "Ai đã chia sẻ đồ ăn cho Sam khi cậu đói?",
      options: [
        { label: "A", text: "Bố Sam" },
        { label: "B", text: "Mẹ Sam" },
        { label: "C", text: "Bác rùa biển hiền lành" },
        { label: "D", text: "Cá heo" },
      ],
      correctAnswer: "C",
      explanation: "Bác rùa biển hiền lành chia cho Sam một nửa cọng rong biển."
    },
    {
      question: "Bài học Sam rút ra là gì?",
      options: [
        { label: "A", text: "Phải bơi thật xa để tìm thức ăn ngon hơn" },
        { label: "B", text: "Cần luyện tập thêm để bơi nhanh hơn" },
        { label: "C", text: "Hãy trân trọng thức ăn vì không biết ngày mai có còn gì ăn không" },
        { label: "D", text: "Nên kết bạn với nhiều loài động vật khác" },
      ],
      correctAnswer: "C",
      explanation: "Sam học rằng cần trân trọng thức ăn vì có thể không còn vào ngày mai."
    },
  ],
  // Additional stories can be added here following the same structure.
};

async function main() {
  console.log('🚀 Starting question seeding...');
  for (const [storyIdStr, questions] of Object.entries(STORY_QUESTIONS)) {
    const storyId = Number(storyIdStr);
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      console.warn(`⚠️ Story ID ${storyId} not found, skipping.`);
      continue;
    }
    await prisma.story.update({
      where: { id: storyId },
      data: { questions: JSON.stringify(questions) },
    });
    console.log(`✅ Seeded ${questions.length} questions for story ${storyId}: "${story.title}"`);
  }
  console.log('✅ All done.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
