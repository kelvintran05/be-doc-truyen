export interface StoryPage {
  text: string;
  enText?: string;
  keyword?: string;
  image: string; // Emoji or image URL
  audioUrl?: string; // Audio file URL
}

export interface QuizQuestion {
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface Story {
  id: number;
  title: string;
  slug: string;
  category: string;
  age: string;
  duration: string;
  rating: number;
  audio: boolean;
  color: string;
  badgeColor: string;
  image: string;
  coverImageUrl?: string;
  description: string;
  moral: string;
  audioDuration: number;
  author: string;
  pages: StoryPage[];
  questions?: QuizQuestion[];
}

export const STORIES: Story[] = [
  {
    "id": 1,
    "title": "Bé Có Muốn Trở Thành Kĩ Sư Xây Dựng?",
    "slug": "be-an-va-giac-mo-ky-su-xay-dung-mp11k33m",
    "category": "Giáo dục",
    "age": "4-8 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEE2E2",
    "badgeColor": "#EF4444",
    "image": "🏫",
    "coverImageUrl": "http://localhost:3001/cdn/images/story1_cover.png",
    "description": "Một câu chuyện thú vị về bé An, người yêu thích xếp hình và khám phá thế giới của những kỹ sư xây dựng tài ba. Cùng An tìm hiểu xem những \"người khổng lồ\" thầm lặng này đã biến những ý tưởng trên giấy thành những công trình vĩ đại như thế nào nhé!",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Có một cô bé tên là An, An rất thích chơi xếp hình LEGO. Mỗi ngày, An lại xây nên những ngôi nhà, những tòa tháp cao vút bằng những viên gạch đủ màu sắc.",
        "image": "http://localhost:3001/cdn/images/story1_page1.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/baf254f6-6d06-4836-a99c-e1e1a86705cf-page-1-vi.wav",
        "keyword": "A"
      },
      {
        "text": "An còn thích ngắm nhìn những công trình đang mọc lên gần nhà mình nữa. Những chiếc cần cẩu cao vút vươn mình lên trời, và các chú công nhân đội mũ bảo hộ đang làm việc thật hăng say!",
        "image": "http://localhost:3001/cdn/images/story1_page2.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/9f3d3720-c1cb-42df-a063-b33552ba7a40-page-2-vi.wav",
        "keyword": "C"
      },
      {
        "text": "Một ngày nọ, một mảnh đất trống lớn gần nhà An bỗng dưng được rào chắn cẩn thận. Chẳng mấy chốc, những chiếc máy xúc khổng lồ và máy ủi mạnh mẽ bắt đầu xuất hiện, \"ẦM! ẦM!\" cả một góc phố!",
        "image": "http://localhost:3001/cdn/images/story1_page3.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/c633efa8-483e-45a8-8d82-0f5d448e217d-page-3-vi.wav",
        "keyword": "Đ"
      },
      {
        "text": "An tò mò lắm, \"Làm sao mà từ một mảnh đất trống trơn lại có thể biến thành một ngôi trường mới thật đẹp được nhỉ?\" Ai là người đã giúp làm những điều tuyệt vời này?",
        "image": "http://localhost:3001/cdn/images/story1_page4.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/4b71f797-e3b7-42d6-a481-6de29cb344e7-page-4-vi.wav",
        "keyword": "T"
      },
      {
        "text": "À, đó chính là những \"người khổng lồ\" thầm lặng của thành phố, các chú kỹ sư xây dựng đấy! Các chú ấy đội chiếc mũ bảo hộ cứng cáp và cầm trên tay những bản thiết kế chi tiết với vô vàn những con số.",
        "image": "http://localhost:3001/cdn/images/story1_page5.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/a7cda443-c0ad-4a30-89b0-87bb8ce96bfa-page-5-vi.wav",
        "keyword": "K"
      },
      {
        "text": "Các kỹ sư giống như những người thợ ghép hình khổng lồ vậy. Họ tính toán tỉ mỉ từng thanh thép, viên gạch để đảm bảo mọi công trình đều an toàn và bền bỉ với thời gian, thật là tài tình!",
        "image": "http://localhost:3001/cdn/images/story1_page6.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/71df2533-3ba8-4772-834b-2c6d3c353243-page-6-vi.wav",
        "keyword": "T"
      },
      {
        "text": "Trên công trường, các chú kỹ sư làm việc cùng những chiếc cần cẩu cao vút vươn tới mây xanh, máy xúc mạnh mẽ \"roẹt roẹt\" đào đất, và những thiết bị công nghệ hiện đại nữa.",
        "image": "http://localhost:3001/cdn/images/story1_page7.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/0273b508-691f-484f-9d28-00a15a2316e6-page-7-vi.wav",
        "keyword": "M"
      },
      {
        "text": "Các chú ấy phải hiểu rõ về các loại vật liệu, biết cách chúng kết hợp với nhau để chống lại gió bão \"ù ù\" hay những cơn rung chuyển nhẹ của đất. Thật là phức tạp nhưng cũng thật thú vị!",
        "image": "http://localhost:3001/cdn/images/story1_page8.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/39ed93a5-cf06-4b09-b52e-1b606d89c1c2-page-8-vi.wav",
        "keyword": "V"
      },
      {
        "text": "Điều tuyệt vời nhất là được tận mắt chứng kiến một mảnh đất trống trải dần biến thành một công viên xanh mát, một bệnh viện hiện đại, hay một ngôi trường khang trang cho các bạn nhỏ!",
        "image": "http://localhost:3001/cdn/images/story1_page9.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/6a3adc88-a794-4400-bc6d-acd0fb9b414c-page-9-vi.wav",
        "keyword": "X"
      },
      {
        "text": "An nhận ra, kỹ sư xây dựng không chỉ xây nhà, mà còn xây nên những ước mơ! An càng thêm yêu thích việc xếp hình và mơ ước một ngày sẽ trở thành một kỹ sư tài ba, xây nên những thành phố rực rỡ cho tương lai!",
        "image": "http://localhost:3001/cdn/images/story1_page10.png",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f8398b98-87ed-4c5b-b449-4d08b2b615d7/audio/2026-05-11/6245171e-8a7b-46a4-96a9-c5240a6982a7-page-10-vi.wav",
        "keyword": "Ư"
      }
    ]
  },
  {
    "id": 2,
    "title": "Nobita Và Chiếc Kính \"Hệ Quả Tức Thì\"",
    "slug": "nobita-va-chiec-kinh-he-qua-tuc-thi-mouzodcn",
    "category": "Giáo dục, Phiêu lưu",
    "age": "5-9 tuổi",
    "duration": "12 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#ECFDF5",
    "badgeColor": "#10B981",
    "image": "🏫",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/6c1d1d6c-5b6c-49cc-bdda-f0b02e04b4db-page-1.webp",
    "description": "Một câu chuyện thú vị về Nobita và chiếc kính thần kỳ giúp cậu bé nhìn thấy ngay hậu quả của việc không nghe lời mẹ. Qua đó, Nobita học được rằng những lời dặn dò của mẹ luôn xuất phát từ tình yêu thương và sự quan tâm sâu sắc.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 360,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Trên bầu trời Tokyo, nắng vàng rực rỡ chiếu qua ô cửa sổ nhỏ, nhưng trong căn phòng của Nobita thì lại... Ồ, một \"bãi chiến trường\" đích thực!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/6c1d1d6c-5b6c-49cc-bdda-f0b02e04b4db-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/8edb3f29-05d4-4b49-b800-7c0456ec2ea3-page-1-vi.wav",
        "keyword": "Ồ!"
      },
      {
        "text": "Bỗng cánh cửa khẽ \"kẽo kẹt\" mở ra, mẹ Nobi bước vào với chồng quần áo thơm tho trên tay. \"Nobita! Con nhớ dọn dẹp phòng ngay, lát nữa mẹ sẽ lau nhà đó con,\" mẹ nhẹ nhàng nhắc nhở. \"Và tuyệt đối không được dùng kéo để cắt mô hình trên giường nhé, rất dễ bị đứt tay hoặc làm hỏng nệm đấy!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/e584eb10-6198-4737-84c7-87b987c334a4-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/1cb9b2c8-77b5-41dc-993d-a35149833c7b-page-2-vi.wav",
        "keyword": "Kéo."
      },
      {
        "text": "Nobita uể oải đáp \"Dạ dạ, con biết rồi mà mẹ...\" nhưng trong lòng cậu bé lại nghĩ thầm: \"Mẹ lúc nào cũng nói quá lên! Mình dùng kéo bao nhiêu lần rồi có sao đâu chứ?\" Cậu bé nghịch ngợm cầm cây kéo sắc lẹm lên, định cắt cái gì đó.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/6880abf1-83dd-4ed1-8ecc-99371dcba64c-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/8bf6ec56-c1a7-47a7-8573-29d3f9887904-page-3-vi.wav",
        "keyword": "Kéo."
      },
      {
        "text": "Doraemon đang ngồi nhấm nháp chiếc bánh rán ngọt lịm, chú mèo máy thấy Nobita bắt đầu cầm cây kéo lên thì lắc đầu thở dài. \"Ôi, Nobita lại định làm gì đây?\" Doraemon nghĩ. Chú mèo máy liền nhanh tay rút ra một bảo bối trông thật ngầu!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/4025bb21-edd1-4ae5-a48e-50a186ad7296-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/af9f567e-c951-4e53-86f3-bbb7525358b9-page-4-vi.wav",
        "keyword": "Ôi!"
      },
      {
        "text": "Đó là một chiếc kính đặc biệt, với mắt kính màu tím nhạt lấp lánh! \"Nobita! Cậu hãy đeo chiếc kính 'Hệ Quả Tức Thì' này vào,\" Doraemon hào hứng nói. \"Nó sẽ cho cậu thấy những gì sẽ xảy ra chỉ trong 5 phút tới nếu cậu không nghe lời mẹ đó!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/a98490ca-ade2-4bff-9441-0ca173622d38-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/4b6efe2d-27f7-4425-954d-a4bb2303a604-page-5-vi.wav",
        "keyword": "Kính."
      },
      {
        "text": "Nobita tò mò đeo kính vào. Vừa nhìn xuống bàn tay đang cầm kéo, \"Á!\" cậu bé giật mình thốt lên! Một hình bóng mờ ảo của chính cậu hiện ra, tay đang chảy máu \"tóe loe\" và tấm nệm mới tinh thì rách nát! Sợ quá, Nobita vội vàng cất kéo vào ngăn kéo ngay lập tức!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/dca14dff-0948-492d-a3ff-8899b1dcd2ec-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/3b8a39b7-5411-4f44-a10f-42530837af45-page-6-vi.wav",
        "keyword": "Á!"
      },
      {
        "text": "Sau đó, Nobita quyết định ra sân bóng chơi với các bạn. Trước khi đi, mẹ lại dặn dò: \"Con đi chơi thì nhớ đội mũ vào nhé, trời nắng gắt dễ bị say nắng lắm!\" Mẹ còn nói thêm: \"Và đừng đi tắt qua khu vườn nhà ông Kaminari nhé, ông ấy vừa trồng hoa mới đấy con!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/86e2f13f-68a1-4c0c-822a-74881a17bdf6-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/a3a80377-6c91-4f92-897f-279a8967086f-page-7-vi.wav",
        "keyword": "Mũ."
      },
      {
        "text": "Nobita đeo kính vào và thử thách lời mẹ dặn. Cậu bé định không đội mũ, nhưng qua chiếc kính, cậu thấy mình chỉ đi được mười bước là mặt đã đỏ gay, hoa mắt chóng mặt và \"RẦM!\" ngã lăn ra đường! Sợ hãi, Nobita quay lại lấy mũ đội ngay.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/66e6edd2-46f2-4669-a29f-2a51ac247ea6-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/c529a4f5-b3e3-4af5-8a23-026de608993a-page-8-vi.wav",
        "keyword": "RẦM!"
      },
      {
        "text": "Đến đoạn đường tắt qua vườn ông Kaminari, Nobita lại nhìn qua kính. Cậu thấy mình nhảy qua hàng rào, \"RỘP RỘP!\" giẫm nát cả luống hoa hồng quý của ông! Ông Kaminari tức giận cầm chổi \"PHỤT PHỤT!\" đuổi theo mắng cho một trận, còn mẹ thì phải đến xin lỗi và đền bù rất nhiều tiền! Nobita toát mồ hôi hột: \"Hóa ra lời mẹ dặn không phải là để cấm đoán, mà là để mình không gặp rắc rối!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/9c7196bb-a1cc-40ca-9755-86c4b210b405-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/62679148-5fa6-493f-a511-ba48a261994b-page-9-vi.wav",
        "keyword": "RỘP!"
      },
      {
        "text": "Buổi chiều, mây đen kéo đến \"ù ù\", báo hiệu một cơn mưa lớn. Mẹ dặn Nobita: \"Con ở nhà trông nhà, nhớ đóng hết cửa sổ và đừng bật tivi khi có sấm sét nhé, tivi sẽ bị cháy đó con!\" Nhưng đúng lúc đó, Chaien và Xeko chạy đến rủ Nobita xem một chương trình siêu nhân cực hay sắp chiếu! Nobita phân vân lắm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/d97e80c6-2f75-4c69-8e40-3d899db0b3cd-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/f8ce7273-a1f8-45dc-b14a-9328bc6ce8ea-page-10-vi.wav",
        "keyword": "Mưa."
      },
      {
        "text": "Cậu bé lại nhìn qua chiếc kính thần kỳ. Cậu thấy cảnh tivi nổ tung \"ĐÙNG!\" một cái vì sét đánh trúng cột thu lôi, khói đen mịt mù bốc lên! Nhưng quan trọng hơn, cậu còn thấy hình ảnh mẹ đang hớt hải chạy dưới mưa từ siêu thị về, vừa chạy vừa lo lắng lẩm bẩm: \"Không biết Nobita có sợ sấm sét không? Phải về nhanh với con thôi!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/0382ce98-8491-4a01-abb0-4d0f1bf689e4-page-11.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/e92bd004-11f4-4c4d-ac8a-9f9bbabcb8ca-page-11-vi.wav",
        "keyword": "ĐÙNG!"
      },
      {
        "text": "Nobita không xem tivi nữa. Cậu đóng chặt các cửa sổ, dọn dẹp phòng khách thật sạch sẽ. Khi mẹ về đến nhà, người ướt sũng nhưng thấy nhà cửa gọn gàng, an toàn, mẹ mỉm cười hạnh phúc: \"Nobita của mẹ ngoan quá, mẹ có mua bánh flan cho con đây!\" Doraemon tiến đến thu lại chiếc kính: \"Cậu thấy chưa Nobita? Khi cậu nghe lời mẹ, không chỉ cậu an toàn mà mẹ cũng sẽ bớt lo lắng và hạnh phúc hơn nhiều.\" Nobita gãi đầu cười: \"Tớ hiểu rồi! Lời của mẹ thực ra chính là một loại 'siêu năng lực' giúp tớ tránh khỏi mọi xui xẻo đó!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/images/2026-05-07/35ab794d-79e6-4454-8b7c-5a0e5f95f909-page-12.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f5e50c91-f795-4ea8-9817-780c793a0d9d/audio/2026-05-07/8b2fc81f-11fa-4ad9-9c2d-7d1128099a53-page-12-vi.wav",
        "keyword": "Vâng!"
      }
    ]
  },
  {
    "id": 3,
    "title": "Cá Mập Nhỏ Học Cách Trân Trọng Thức Ăn",
    "slug": "ca-map-nho-hoc-cach-tran-trong-thuc-an-mpbz119s",
    "category": "family",
    "age": "3-7 tuổi",
    "duration": "8 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEF3C7",
    "badgeColor": "#F59E0B",
    "image": "🦈",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-1.webp",
    "description": "Cá mập con Sam vô cùng kén ăn và hay lãng phí thức ăn. Một ngày, đại dương khan hiếm thức ăn, Sam phải học bài học về sự trân trọng đồ ăn.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 240,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Dưới đại dương bao la, có một chú cá mập con tên là Sam. Sam sống cùng bố mẹ trong một hang đá xinh đẹp. Bố mẹ Sam yêu thương chú vô cùng, luôn chuẩn bị những bữa ăn ngon lành cho con mình.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-1-vi.wav",
        "keyword": "Sam"
      },
      {
        "text": "Mỗi bữa tối, mẹ Sam đều chuẩn bị thật nhiều món ngon. Có tôm, có cá, có mực tươi — đầy ắp một đĩa lớn. Thế nhưng, Sam chỉ cắn mỗi món một miếng rồi bỏ thừa lại. \"Con không thích ăn món này nữa đâu!\" — chú phụng phịu nói rồi bơi đi chơi. Đĩa thức ăn ngon lành bị bỏ lại đầy đầy.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-2-vi.wav",
        "keyword": "đĩa"
      },
      {
        "text": "Bố mẹ Sam nhẹ nhàng khuyên bảo: \"Con ơi, đồ ăn rất quý giá đấy. Có biết bao bạn cá khác đói lắm mà không có gì ăn. Con đừng lãng phí như thế!\" Nhưng Sam chẳng thèm nghe, chú ta chỉ nghĩ bụng rằng đói thì bơi ra biển kiếm món khác ngon hơn vậy.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-3-vi.wav",
        "keyword": "lời khuyên"
      },
      {
        "text": "Một ngày nọ, một luồng hải lưu lạnh buốt giá tràn qua đại dương. Các đàn cá nhỏ phải di cư đi nơi khác hết — bơi đi để tìm nơi ấm áp hơn. Thức ăn dưới đáy biển bỗng trở nên khan hiếm vô cùng. Không còn tôm, không còn mực, chẳng còn gì ngon lành nữa. Mọi thứ trở nên trống trải và lạnh lẽo.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-4-vi.wav",
        "keyword": "lạnh"
      },
      {
        "text": "Đến bữa tối, mẹ Sam chỉ kiếm được một chú cá nhỏ duy nhất. Mẹ đặt đĩa thứa ăn trước mặt Sam với đôi mắt buồn bã. \"Mẹ xin lỗi con, hôm nay mẹ chỉ tìm được có thế này thôi con ơi.\" Nhìn đĩa thức ăn ít ỏi, Sam nhăn mặt: \"Ít quá! Con không chịu ăn đâu!\" rồi bỏ bát bát bơi ra biển xa tìm món ngon hơn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-5-vi.wav",
        "keyword": "đói"
      },
      {
        "text": "Sam bơi thật xa, bơi mãi bơi mãi. Bụng Sam bắt đầu réo lên \"ọc ọc\" đói meo. Xung quanh chú chỉ toàn rác biển và những rặng san hô xám xịt, chẳng có gì ăn được. Sam cố gắng tìm kiếm khắp nơi nhưng đâu đâu cũng trống rỗng. Lần đầu tiên trong đời, chú cá mập nhỏ biết thế nào là đói lả, biết thế nào là thèm một miếng ăn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-6-vi.wav",
        "keyword": "đói"
      },
      {
        "text": "Tình cờ, Sam gặp bác rùa biển hiền lành đang cặm cụi nhặt nhạnh từng cọng rong biển. Bác rùa thấy Sam liền mỉm cười hiền từ và chia cho Sam một nửa cọng rong. \"Cháu ăn đi, thời gian này có đồ ăn là hạnh phúc lắm rồi!\" Lần đầu tiên biết thế nào là đói lả, Sam ngậm ngùi ăn cọng rong biển vốn chẳng vừa miệng chút nào. Ăn xong, nước mắt Sam chảy dài — chú nhớ đến những mâm cơm đầy ắp mà mình từng lãng phí.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-7-vi.wav",
        "keyword": "hạnh phúc"
      },
      {
        "text": "Sam vội vã bơi thật nhanh về nhà và ôm chầm lấy bố mẹ. \"Con xin lỗi bố mẹ, con sẽ ngoan ngoãn ăn hết và trân trọng thức ăn!\" Từ đó trở đi, cá mập Sam luôn ăn ngoan ngoãn, ăn hết sạch thức ăn trên đĩa. Chú không bao giờ bỏ thừa một chút nào nữa. Và đó là bài học Sam nhớ mãi trong suốt cuộc đời — hãy trân trọng thức ăn vì biết đâu ngày mai chẳng còn gì để ăn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/audio/page-8-vi.wav",
        "keyword": "học"
      }
    ]
  },
  {
    "id": 4,
    "title": "Chuyến Du Hành Ngang Ngược",
    "slug": "chuyen-du-hanh-ngang-nguoc-monooq50",
    "category": "adventure",
    "age": "5-10 tuổi",
    "duration": "5 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#EFF6FF",
    "badgeColor": "#3B82F6",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/2b56f6a2-ac1d-4647-bc09-e5b214aefacb-page-1.webp",
    "description": "Bình và An là hai chú cua nhỏ sống trong kẽ đá. Một ngày nọ, họ quyết định thực hiện một chuyến du hành đầy bất ngờ để khám phá thế giới rộng lớn ngoài kia.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 150,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Trong một kẽ đá chật hẹp dưới chân ghềnh, anh em nhà cua đang bàn bạc. Cua Nhỏ An hào hứng chỉ tay về phía chân trời: 'Anh Bình ơi, đi xem mặt trời mọc đi!'. Cua Lớn Bình gãi đầu lo lắng nhưng cũng tặc lưỡi đồng ý. Thể là, hai anh em bắt đầu hành trình bò ngang qua những rạn san hô sắc nhọn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/2b56f6a2-ac1d-4647-bc09-e5b214aefacb-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/audio/2026-05-02/163edea7-50a9-444b-b302-9d882251c8df-page-1-vi.wav",
        "keyword": "C"
      },
      {
        "text": "Trên đường đi, họ gặp một đàn ốc mượn hồn đang lỉnh kỉnh vác nhà di cư. Bình thở dài: 'Đi du lịch mà vác theo cái nhà nặng thế kia thì khổ quá!'. Nhưng An mỉm cười đáp: 'Nhưng nhờ cái nhà đó mà họ không sợ sóng đánh đâu anh ạ. Ai cũng có cách để cảm thấy an toàn mà!'.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/0a58f2df-3e9e-4236-87ae-82467edcd264-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/audio/2026-05-02/8560266b-5f6f-47be-9532-a579a49d6dfa-page-2-vi.wav",
        "keyword": "O"
      },
      {
        "text": "Gặp bác Rùa Già đang sưởi nắng, Bình than phiền rằng chẳng thấy gì ngoài cát và nước. Bác rùa cười hiền hậu: 'Các cháu thử dừng lại và ngước mắt nhìn lên xem!'. Lần đầu tiên, hai chú cua rướn mắt lên cao. Ôi! Ánh nắng xuyên qua nước như những dải lụa vàng lấp lánh, đẹp đến kỳ ảo!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/a8376839-6ff1-49a3-acf3-7dad05257370-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/audio/2026-05-02/5365800e-19a5-4ebf-93bd-c93c91a81e16-page-3-vi.wav",
        "keyword": "R"
      },
      {
        "text": "Bất ngờ, thủy triều rút nhanh làm bãi cát khô nóng. Bình hoảng sợ đào hang trốn, nhưng An đã kịp nhìn thấy một vũng nước nhỏ dưới bóng cây bàng. Họ cùng nhau bò đến đó và thấy một cậu bé đang nhặt rác để cứu các bạn sinh vật biển. 'Thì ra thế giới vẫn luôn có những điều tử tế!', An thì thầm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/1807305c-b059-4151-bf07-8bffb6959fc5-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/audio/2026-05-02/e0417dfe-b2ba-4152-bb02-fda3913a98df-page-4-vi.wav",
        "keyword": "N"
      },
      {
        "text": "Khi sóng lớn đưa họ trở về kẽ đá cũ, Bình và An đã không còn như trước. Bình không còn sợ hãi những điều mới lạ, còn An hiểu rằng khám phá chính là cảm nhận sâu sắc hơn. Thế giới này rộng lớn hay nhỏ bé, tất cả đều nằm ở đôi mắt và trái tim của chúng ta. Chuyến đi thật tuyệt vời!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/images/2026-05-02/cd2514c0-ad88-4a6f-b1bd-a2fd5ced522d-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/eee904cc-5da7-4f03-9549-c65bd3f285c9/audio/2026-05-02/186ee65c-0acf-4089-8a02-815c58eac1d4-page-5-vi.wav",
        "keyword": "V"
      }
    ]
  },
  {
    "id": 5,
    "title": "Vick, cậu bé tự chọn cách mình lớn lên",
    "slug": "vick-cau-be-tu-chon-cach-minh-lon-len-mpglqhl7",
    "category": "learning",
    "age": "3-8 tuổi",
    "duration": "8 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#F5F3FF",
    "badgeColor": "#8B5CF6",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-1.webp",
    "description": "Câu chuyện cảm động về cậu bé Vick sinh non, nhỏ bé yếu ớt nhưng kiên cường vượt qua thử thách. Vick chọn cách tỏa sáng bằng tri thức thay vì sức mạnh thể chất, trở thành tấm gương về nghị lực và sự nỗ lực.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 240,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Một đêm trong bệnh viện, cậu bé tí hon tên Vick chào đời. Cậu bé sinh non, nhỏ xíu và yếu ớt vô cùng. Vick phải nằm trong một chiếc lồng kính ấm áp, thở những nhịp thở rất khẽ khàng. Bác sĩ lo lắng nhìn cậu bé nhỏ xíu ấy.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-1-vi.wav",
        "keyword": "Vick"
      },
      {
        "text": "Những ngày đầu tiên, Vick nằm trong chiếc lồng kính trong suốt. Bác sĩ nói rằng hành trình lớn lên của cậu bé sẽ gặp rất nhiều khó khăn. Thế nhưng, Vick không hề cô đơn. Ba mẹ và ông bà thay phiên nhau đứng bên lồng kính, gửi đến cậu những lời thì thầm yêu thương. Họ trao cho Vick những cái ôm ấm áp nhất.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-2-vi.wav",
        "keyword": "Gia đình"
      },
      {
        "text": "Tình yêu thương kỳ diệu đã tiếp thêm sức mạnh cho Vick. Cậu bé kiên cường vượt qua giai đoạn ngặt nghèo nhất. Những nhịp thở của Vick dần đều đặn hơn. Và rồi một ngày, bác sĩ mỉm cười và nói rằng Vick đã đủ khỏe để được về nhà. Gia đình Vick reo hò sung sướng!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-3-vi.wav",
        "keyword": "Mạnh mẽ"
      },
      {
        "text": "Vick lớn lên nhưng vẫn nhỏ con hơn các bạn cùng trang lứa. Cậu bé không thể chạy nhảy hay đá bóng thật nhanh như những đứa trẻ khác. Mỗi khi nhìn các bạn chơi đùa ngoài sân, Vick cảm thấy có chút buồn. Nhưng rồi cậu bé nhận ra mình có thể chọn một con đường khác.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-4-vi.wav",
        "keyword": "Nhỏ bé"
      },
      {
        "text": "Thay vì buồn bã, Vick chọn cho mình một con đường tuyệt vời khác: chinh phục thế giới bằng tri thức! Hằng ngày, cậu bé vô cùng chăm chỉ học hành. Vick luôn say mê đọc sách và tự mình tìm lời giải cho những bài toán khó. Cậu nhận ra rằng tri thức là sức mạnh vô cùng to lớn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-5-vi.wav",
        "keyword": "Sách"
      },
      {
        "text": "Vick ngồi bên cửa sổ, ánh nắng vàng ấm áp chiếu lên cuốn sách trên tay. Cậu bé mỉm cười tự tin, hiểu ra một điều kỳ diệu: vóc dáng có thể nhỏ bé, nhưng trí tuệ và ước mơ của mình thì có thể lớn rộng đến vô cùng. Không có gì có thể ngăn cản một người có ước mơ lớn!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-6-vi.wav",
        "keyword": "Ước mơ"
      },
      {
        "text": "Nhờ sự nỗ lực không ngừng nghỉ, Vick luôn đạt kết quả học tập xuất sắc. Cậu bé ngoan ngoãn và lễ phép với mọi người. Mỗi khi nhìn Vick tự tin đứng trên bục nhận giải thưởng, ba mẹ và ông bà trào dâng niềm tự hào khôn xiết. Họ rất cảm động khi thấy cậu bé nhỏ xíu ngày nào giờ đã tỏa sáng rực rỡ!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-7-vi.wav",
        "keyword": "Giải thưởng"
      },
      {
        "text": "Câu chuyện của Vick nhắc nhở chúng ta rằng, cuộc sống có thể cho ta những thử thách ngay từ khi mới sinh ra. Chúng ta không thể chọn cách mình bắt đầu, nhưng hoàn toàn có thể tự chọn cách mình lớn lên và tỏa sáng theo cách riêng của mình. Vick đã chứng minh rằng, với tình yêu thương và nghị lực, không gì là không thể!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/images/page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e99c89b5-8480-425c-bf93-769444ad62a3/audio/page-8-vi.wav",
        "keyword": "Tỏa sáng"
      }
    ]
  },
  {
    "id": 6,
    "title": "Trò Chơi Trốn Tìm Của Lu",
    "slug": "tro-choi-tron-tim-cua-lu-mono2zi0",
    "category": "animals",
    "age": "3-5 tuổi",
    "duration": "6 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FFF1F2",
    "badgeColor": "#F43F5E",
    "image": "🙈",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/665a1f06-c900-4507-9336-eb8ab6386543-page-1.webp",
    "description": "Cùng Lu, chú cá mập Megalodon khổng lồ nhưng hiền lành, tham gia trò chơi trốn tìm vui nhộn dưới đại dương! Lu sẽ học cách yêu bản thân mình qua trò chơi này.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 180,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Dưới rạn san hô Cầu Vồng rực rỡ, bạn cá mập Megalodon tên là Lu đang chuẩn bị chơi trốn tìm cùng các bạn nhỏ Pip và Tilly. Ùm... Lu to lớn quá, không biết cậu ấy sẽ trốn ở đâu nhỉ?",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/665a1f06-c900-4507-9336-eb8ab6386543-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/c396ed9f-64df-4f7f-ad8c-9c557489d67d-page-1-vi.wav",
        "keyword": "L"
      },
      {
        "text": "Lu nhìn thấy một rặng san hô nhỏ xíu. Cậu ấy cố gắng thu mình lại để trốn đằng sau, nhưng ôi không, cái vây lưng nhọn hoắt cứ nhô lên cao tít!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/71360f5b-51c0-4ec7-98d7-32c32af591cd-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/a8b0ed83-edb9-45d2-a067-9ec37b2ca345-page-2-vi.wav",
        "keyword": "V"
      },
      {
        "text": "Lu lại tìm thấy một hòn đá to. Cậu ấy rón rén bò ra sau, nhưng cái đuôi dài ngoằng lại thò ra ngoài. Pip và Tilly cười khúc khích: \"Thấy Lu rồi nhé!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/74ddf1b4-1deb-46e4-b285-d8ace8af3dd0-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/d614f249-f361-40ef-bbe3-1dbba26822e8-page-3-vi.wav",
        "keyword": "Đ"
      },
      {
        "text": "Lu thở dài buồn bã. \"Mình to quá, chẳng trốn vào đâu được cả.\" Các bạn cá nhỏ vây quanh an ủi Lu. Đừng buồn mà Lu ơi, to lớn cũng có cái hay đấy chứ!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/485e6003-5cfc-4a30-958d-220abff5e9e5-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/1025c0f2-9599-4fe4-9e07-b1955fd2d00e-page-4-vi.wav",
        "keyword": "B"
      },
      {
        "text": "Bỗng nhiên, Lu nảy ra một ý tưởng tuyệt vời! Cậu ấy mở rộng đôi vây to lớn của mình và hô to: \"Các bạn ơi, tớ sẽ làm chỗ trốn cho mọi người nhé!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/62b4838a-9b66-44ab-9874-2dc5a1dd03c5-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/ca247b12-dc50-4107-94a6-0ae6ae38cbfe-page-5-vi.wav",
        "keyword": "Ý"
      },
      {
        "text": "Thế là Pip, Tilly và các bạn cá nhỏ thi nhau nấp dưới bóng râm của Lu. Mọi người cùng cười đùa vui vẻ. Lu rất hạnh phúc vì sự to lớn của mình đã mang lại niềm vui cho cả nhóm!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/images/2026-05-02/92893025-fc74-4003-8b93-537051c6035f-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e8a98afa-9b62-41f2-adab-89d0982aa6b6/audio/2026-05-02/db95caaf-7b95-4870-ae0a-7b2be933b1f5-page-6-vi.wav",
        "keyword": "V"
      }
    ]
  },
  {
    "id": 7,
    "title": "Tạm Biệt Mẫu Giáo, Chào Lớp Một!",
    "slug": "tam-biet-mau-giao-chao-lop-mot-mowpdi6i",
    "category": "Tình bạn",
    "age": "4-6 tuổi",
    "duration": "6 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEE2E2",
    "badgeColor": "#EF4444",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/4614a11e-16f0-4efb-8cac-a7c63b54d864-page-1.webp",
    "description": "Tí và Kevin là đôi bạn thân thiết nhất ở trường mẫu giáo. Khi mùa hè đến và lễ tốt nghiệp diễn ra, Tí rất buồn vì phải chia xa Kevin. Mẹ đã giúp Tí hiểu rằng chia ly là một phần của cuộc sống, và những tình bạn đẹp sẽ luôn ở trong tim, đồng thời mở ra cánh cửa đến những điều kỳ thú mới ở trường tiểu học.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 180,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Ở trường mẫu giáo, Tí và Kevin là hai người bạn thân thiết. Hai cậu bé lúc nào cũng dính lấy nhau như hình với bóng, tiếng cười giòn tan vang khắp nơi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/4614a11e-16f0-4efb-8cac-a7c63b54d864-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/eaadfa70-ab05-49ea-826b-758ce03abd64-page-1-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Mỗi giờ ra chơi, 'Vút!' một tiếng, Tí và Kevin lại cùng nhau chạy thật nhanh ra sân cỏ, hăng say đá bóng. Khi mệt, hai bạn lại ngồi cạnh nhau, say sưa lật mở những cuốn sách tranh đầy màu sắc. Tí chia cho Kevin miếng bánh ngon, Kevin lại nhường Tí món đồ chơi mình yêu thích.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/ce49d95a-8169-445a-befe-0e476652ab0d-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/7e5a9249-a923-442a-a455-1985dfc937cc-page-2-vi.wav",
        "keyword": "Chơi"
      },
      {
        "text": "Nhưng rồi, mùa hè rực rỡ cũng đến, mang theo ngày lễ tốt nghiệp. 'Ôi không!' Tí buồn lắm, đôi mắt bạn rơm rớm nước vì biết mình sẽ không còn được gặp Kevin mỗi ngày nữa. Một nỗi buồn thật lớn bao trùm lấy Tí.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/a77e32dd-fa9a-4bf6-b768-8ed4154c4c32-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/46a02485-8962-404f-be77-2136776ea520-page-3-vi.wav",
        "keyword": "Buồn"
      },
      {
        "text": "Thấy Tí sụt sùi, mẹ nhẹ nhàng ngồi xuống bên cạnh và ôm bạn vào lòng thật chặt. Mẹ vỗ về: 'Tí ơi, trong cuộc đời chúng ta sẽ có nhiều cuộc chia ly như thế này con ạ, nhưng đó không phải là kết thúc'. Giọng mẹ thật ấm áp và dịu dàng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/56674eff-2e76-49e0-82d5-3607edf65d87-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/498cf694-dbb6-4961-93da-28778cf938e9-page-4-vi.wav",
        "keyword": "Mẹ"
      },
      {
        "text": "Mẹ mỉm cười nói: 'Con và Kevin vẫn có thể hẹn nhau đi công viên vào cuối tuần mà!'. Hơn nữa, khi lên tiểu học, một cánh cửa mới sẽ 'KÉT!' mở ra với biết bao điều kỳ thú. Ở đó, Tí sẽ gặp thêm nhiều người bạn mới, những người sẽ cùng con viết tiếp những kỷ niệm đẹp!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/c5598ae2-e3b7-4d34-b9fb-e44ad2e1a6f6-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/8e11959f-2936-43d6-95a4-c4c58106f9d8-page-5-vi.wav",
        "keyword": "Vui"
      },
      {
        "text": "Nghe mẹ nói, Tí dần lau khô nước mắt và cảm thấy nhẹ lòng hơn rất nhiều. Bạn hiểu rằng tình bạn với Kevin sẽ mãi nằm trong tim, và những ngày đi học sắp tới vẫn sẽ đầy ắp tiếng cười. Tí mỉm cười thật tươi, sẵn sàng chằng vai ba lô để tự tin bước vào ngôi trường mới.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/images/2026-05-08/32b33cf9-50d4-404b-a912-b290a48deeb8-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e826a6d1-59f2-4335-80e4-c21df5b890f5/audio/2026-05-08/1bd71d22-1107-4775-aa8d-eb01a8b0c7f3-page-6-vi.wav",
        "keyword": "Cười"
      }
    ]
  },
  {
    "id": 8,
    "title": "Sự Tích Hồ Gươm",
    "slug": "su-tich-ho-guom-mp81f3k9",
    "category": "Lịch sử",
    "age": "4-10 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#ECFDF5",
    "badgeColor": "#10B981",
    "image": "📚",
    "coverImageUrl": "http://localhost:3001/cdn/images/story8_cover.png",
    "description": "Câu chuyện kể về thanh gươm thần mà Long Quân cho nghĩa quân Lam Sơn mượn để đánh đuổi giặc Minh, và sau đó được Rùa Vàng trả lại cho Long Vương, từ đó hồ Tả Vọng được đổi tên thành Hồ Hoàn Kiếm.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Ngày xưa, vào thời giặc Minh sang xâm lược nước ta, chúng tàn ác làm càn khiến nhân dân vô cùng cực khổ. Lúc bấy giờ, nghĩa quân Lam Sơn do chủ tướng Lê Lợi lãnh đạo đã nổi dậy, nhưng ban đầu thế lực còn non yếu lắm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-1-vi.wav",
        "keyword": "Giặc"
      },
      {
        "text": "Đức Long Quân ở thủy cung thấy cảnh lầm than của dân tộc Việt Nam thì vô cùng xót xa. Ngài bèn quyết định cho nghĩa quân mượn một thanh gươm thần để đánh đuổi quân thù, giành lại độc lập cho đất nước.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-2-vi.wav",
        "keyword": "Gươm"
      },
      {
        "text": "Ở vùng Thanh Hóa, có một người đánh cá tên là Lê Thận. Một ngày nọ, ông quăng lưới ba lần liền kéo lên một thanh sắt nặng trịch, nhìn kỹ thì ra đó là một lưỡi gươm báu sáng loáng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-3-vi.wav",
        "keyword": "Lưới"
      },
      {
        "text": "Ít lâu sau, chủ tướng Lê Lợi bị giặc đuổi, phải chạy vào rừng sâu. Bỗng nhiên, ông tình cờ thấy một chuôi gươm nạm ngọc phát sáng rực rỡ trên ngọn cây đa cổ thụ.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-4-vi.wav",
        "keyword": "Rừng"
      },
      {
        "text": "Khi đem chuôi gươm quý giá ấy về tra vào lưỡi gươm ở nhà Lê Thận, cả hai vừa khít một cách kỳ diệu. Trên thân gươm bỗng sáng rực hai chữ 'Thuận Thiên' như lời khẳng định ý trời.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-5-vi.wav",
        "keyword": "Gươm"
      },
      {
        "text": "Từ khi có gươm thần, nhuệ khí của nghĩa quân tăng lên gấp bội phần. Đi đến đâu, nghĩa quân Lam Sơn cũng thắng trận giòn giã đến đó, quét sạch bóng quân thù xâm lược khỏi bờ cõi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-6-vi.wav",
        "keyword": "Thắng"
      },
      {
        "text": "Đất nước trở lại thanh bình, Lê Lợi lên ngôi vua, được gọi là Lê Thái Tổ. Một năm sau ngày hòa bình, vua ngự thuyền rồng dạo chơi trên hồ Tả Vọng ở kinh thành Thăng Long, lòng vui phơi phới.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-7-vi.wav",
        "keyword": "Vua"
      },
      {
        "text": "Bỗng nhiên, một con Rùa Vàng lớn từ dưới làn nước xanh biếc nhô đầu lên. Chú Rùa bơi về phía thuyền rồng, đứng nổi trên mặt nước và cất tiếng nói rõ ràng: 'Xin bệ hạ hoàn gươm lại cho Long Vương!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-8-vi.wav",
        "keyword": "Rùa"
      },
      {
        "text": "Vua Lê Lợi hiểu ra ý trời, liền rút thanh gươm quý đeo bên mình ra khỏi vỏ. Thanh gươm thần bỗng rời khỏi tay nhà vua, bay loang loáng về phía Rùa Vàng. Rùa Vàng nhanh như cắt há miệng ngậm lấy thanh gươm rồi từ từ lặn xuống làn nước xanh ngắt.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-9-vi.wav",
        "keyword": "Bay"
      },
      {
        "text": "Ánh hào quang của gươm thần còn tỏa sáng dưới mặt nước một lúc lâu sau khi Rùa Vàng biến mất. Để ghi nhớ sự kiện thiêng liêng ấy, vua Lê Lợi đã đổi tên hồ Tả Vọng thành hồ Hoàn Kiếm, nghĩa là 'hồ trả gươm'.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/images/page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e5b08a24-d8c6-4d0d-ad3a-cf213509936d/audio/page-10-vi.wav",
        "keyword": "Hồ"
      }
    ]
  },
  {
    "id": 9,
    "title": "Giấc Mơ Đồ Chơi Của Cô Bé Ry",
    "slug": "giac-mo-o-choi-cua-ry-mpf7be5n",
    "category": "fantasy",
    "age": "4-7 tuổi",
    "duration": "6 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEF3C7",
    "badgeColor": "#F59E0B",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-1.webp",
    "description": "Ry là một cô bé thông minh rất thích đồ chơi tư duy. Trong giấc mơ, cô gặp Doraemon và được một bảo bối thần kỳ nhưng phải đánh đổi bằng đồ ăn và vật dụng trong nhà. Qua bài học, Ry hiểu rằng đồ ăn và vật dụng thiết yếu quan trọng hơn đồ chơi.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 180,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Ry là một cô bé rất thông minh. Bé mê đồ chơi tư duy đến nỗi ngày nào cũng kéo mẹ đi cửa hàng. \"Mẹ ơi! Mẹ mua cho con bộ xếp hình mới đi!\" Ry reo lên vui vẻ, đôi mắt long lanh nhìn kệ đồ chơi đầy màu sắc. Bé muốn ôm trọn cả cửa hàng về nhà.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-1-vi.wav",
        "keyword": "Ry"
      },
      {
        "text": "\"Con ơi, mẹ biết con thích lắm rồi.\" Mẹ nhẹ nhàng ôm Ry vào lòng. \"Nhưng chúng ta phải để dành tiền mua những thứ cần thiết khác nữa con nhé.\" Mẹ mỉm cười dịu dàng, hy vọng Ry sẽ hiểu. Nhưng Ry xị mặt ra, môi bĩu má, đôi mắt ướt long. \"Không! Con muốn mua hết! Con muốn tất cả!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-2-vi.wav",
        "keyword": "Mẹ"
      },
      {
        "text": "Đêm đó, Ry ngủ thiếp đi trong tiếc nuối. Trong giấc mơ kỳ lạ, cô bé bước vào một thế giới đầy màu sắc. Bỗng nhiên, một chú mèo máy xanh xuất hiện với nụ cười ấm áp. \"Chào Ry! Tớ là Doraemon đây!\" Ry reo lên sung sướng. \"Doraemon ơi! Tớ muốn một kho đồ chơi tư duy khổng lồ!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-3-vi.wav",
        "keyword": "Doraemon"
      },
      {
        "text": "Doraemon mỉm cười và rút ra từ chiếc túi thần kỳ một món bảo bối lấp lánh. \"Đây là một bảo bối đặc biệt. Nó sẽ biến ra ngay món đồ chơi cậu ước, nhưng...\" Doraemon dặn dò cẩn thận, đôi mắt nghiêm nghị nhìn Ry. \"Một món đồ ăn hoặc đồ dùng trong nhà cậu sẽ biến mất đấy!\" Ry gật đầu liên tục, mắt sáng rực lên vì phấn khích. \"Tớ hiểu rồi! Tớ đồng ý!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-4-vi.wav",
        "keyword": "Bảo bối"
      },
      {
        "text": "Ry ước một cái là bộ xếp hình xuất hiện ngay trước mắt. Rồi bộ đồ chơi trí tuệ, bảng chữ cái ma thuật, hộp que tính rực rỡ... Đồ chơi xuất hiện ngập tràn xung quanh! Nhưng khi Ry ôm đồ chơi chạy về nhà, bé giật mình thảng thốt. Căn nhà trống trơn! Tivi biến mất, bàn ghế không còn, quần áo bay đi đâu. Ry chạy vào bếp, tủ lạnh trống rỗng, chẳng còn một mẩu bánh mì. Bụng Ry reo lên \"oanh oách\". \"Oa... oa... Con không cần nhiều đồ chơi nữa đâu! Con muốn nhà mình như cũ!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-5-vi.wav",
        "keyword": "Trống trơn"
      },
      {
        "text": "Ry bừng tỉnh giấc, mồ hôi nhễ nhại. Mẹ đang lo lắng ngồi bên giường, nhẹ nhàng lau trán cho bé. Nhìn thấy gian bếp đầy đồ ăn, chiếc tivi đang bật, và vòng tay ấm áp của mẹ, Ry òa khóc và ôm chầm lấy mẹ. \"Mẹ ơi, con hiểu rồi!\" Ry thì thầm nhoà nước mắt. \"Từ nay con sẽ không đòi mua nhiều đồ chơi lãng phí nữa đâu ạ! Đồ ăn, nhà cửa và những thứ khác còn quan trọng hơn nhiều!\" Mẹ mỉm cười ôm Ry thật chặt, mắt rưng rưng hạnh phúc.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/images/page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e2822e65-a92c-48cd-a43f-dd73ccaf63c6/audio/page-6-vi.wav",
        "keyword": "Hiểu"
      }
    ]
  },
  {
    "id": 10,
    "title": "Trận Bóng Trên Sân Cỏ Xanh",
    "slug": "tran-bong-tren-san-co-xanh-monolfou",
    "category": "animals",
    "age": "3-8 tuổi",
    "duration": "7 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#EFF6FF",
    "badgeColor": "#3B82F6",
    "image": "⚽",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/dbecde23-404b-4471-a10b-bd701e14dfef-page-1.webp",
    "description": "Câu chuyện về tình anh em và tinh thần đồng đội của hai chú chuột khi cùng nhau chơi bóng đá.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 210,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Ở một ngôi nhà nhỏ dưới gốc cây sồi, có hai anh em nhà chuột sống rất hòa thuận. Đó là anh Chuột Nâu nhanh nhẹn và em Chuột Xám đáng yêu.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/dbecde23-404b-4471-a10b-bd701e14dfef-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/65ab744f-08a0-461e-a385-35ab0b6ee02c-page-1-vi.wav",
        "keyword": "C"
      },
      {
        "text": "Một buổi sáng nắng vàng, Chuột Nâu thức dậy và tìm thấy một quả bóng đỏ tròn xoe dưới gầm giường. Anh gọi em dậy để cùng đi đá bóng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/44bcfe14-35d4-4375-a87e-36a9cf63464e-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/ae2a17e0-5169-45da-9081-6811050846a8-page-2-vi.wav",
        "keyword": "B"
      },
      {
        "text": "Hai anh em mang giày vải tí hon và mặc áo đấu oai vệ. Họ nắm tay nhau chạy ra sân cỏ xanh mướt, nơi những giọt sương lấp lánh như kim cương.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/54aaa9cf-3b31-48fe-beb9-3c78d74d779f-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/ce12d6c6-2ae6-49f6-85aa-26c57a386297-page-3-vi.wav",
        "keyword": "G"
      },
      {
        "text": "Quả bóng đỏ lăn tròn trên cỏ. Chuột Nâu dẫn bóng rất khéo, nhưng khi Chuột Xám sút thật mạnh, quả bóng bỗng bay mất vào bụi hoa hồng gai!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/7e03a6fa-7238-4eff-8fcf-e63ce57e46f1-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/ee3d7a4a-0cbb-4906-a343-183331df4167-page-4-vi.wav",
        "keyword": "S"
      },
      {
        "text": "Chuột Xám sắp khóc, nhưng anh Nâu đã an ủi em. Cả hai cùng nhau hợp sức đẩy cành hoa hồng sang một bên để cứu quả bóng. Một, hai, ba... cố lên!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/f4957ef1-f5ec-4d91-8845-5d887f718178-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/8da44aae-8c08-4029-8425-60d45f6b286d-page-5-vi.wav",
        "keyword": "Đ"
      },
      {
        "text": "Chuột Xám chạy thật nhanh và sút... VÀO! Quả bóng bay thẳng vào khung thành lá khô. Chị Chim Sẻ và bạn Sóc đều reo hò cổ vũ nhiệt tình.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/4536d089-fb03-4034-af98-c01269c3cdb6-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/3258c019-504a-4cae-98a2-e176c38e07ea-page-6-vi.wav",
        "keyword": "V"
      },
      {
        "text": "Khi về nhà, mẹ đã chuẩn bị sẵn sữa và bánh quy thơm lừng. Hai anh em hiểu rằng khi yêu thương và giúp đỡ nhau, trò chơi nào cũng thật hạnh phúc.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/images/2026-05-02/96eab81b-df52-4b3c-abac-25451cca57c0-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/e04124c2-419b-4cca-9990-fc5e79e279d6/audio/2026-05-02/12115a9d-b56b-417c-9007-67da1c8f067d-page-7-vi.wav",
        "keyword": "Y"
      }
    ]
  },
  {
    "id": 11,
    "title": "The Great Shell Swap",
    "slug": "the-great-shell-swap-mok5no3g",
    "category": "Adventure",
    "age": "3-5 tuổi",
    "duration": "6 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#F5F3FF",
    "badgeColor": "#8B5CF6",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/47afeeb6-55fb-4c42-9b31-b717846e4d0a-page-1.webp",
    "description": "Big Brother Crab and Little Brother Crab find a shiny can, but both want it! They learn to communicate their fears and discover that sharing makes them safer and happier together.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 180,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Once upon a time, deep in the sparkling ocean, lived two cheerful crabs: Big Brother Crab and Little Brother Crab. They loved to scuttle along the sandy bottom, always searching for new, exciting things!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/47afeeb6-55fb-4c42-9b31-b717846e4d0a-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/ebe07136-f70d-4d9a-a6d1-54c6c31dddd6-page-1.mp3",
        "keyword": "Two happy crabs."
      },
      {
        "text": "One sunny morning, they both spotted something truly amazing! *GASP!* A super shiny, silver soda can, half-buried in the sand! It looked like the perfect new home!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/63b01e8b-ab7c-4db1-ac10-10ea7333e61c-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/b958154f-f704-4172-a3f6-d175f2897ac2-page-2.mp3",
        "keyword": "A shiny, new can."
      },
      {
        "text": "\"Mine!\" snapped Big Brother, wiggling his claws. \"No, mine!\" squeaked Little Brother, puffing out his chest. They started to snap their claws, ready for a little crabby disagreement! *SNAP-SNAP!*",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/d1e92eb8-bb1b-4219-8077-6a4c873cd8fa-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/cd2926d2-911b-4929-9a11-d5d3c2e14278-page-3.mp3",
        "keyword": "Both want the can."
      },
      {
        "text": "But Big Brother stopped. He looked at Little Brother and asked, \"Little Brother, why do you want this can so much?\" Little Brother looked down, a tiny bit shy. \"I... I'm scared of the big fish that swims by at night,\" he whispered.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/074aba00-74a9-4b6b-a95f-a627660f4f8a-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/9367e8a4-ebc2-4653-8e67-ac9f76ed4164-page-4.mp3",
        "keyword": "\"Why do you want it?\""
      },
      {
        "text": "Big Brother's eyes widened! \"Aha! This can is big enough for both of us!\" he exclaimed. \"If we clean out the sand inside, we can make it a super cozy fort!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/aca81188-ec60-4b0d-8085-7b8884f7c6e4-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/bff7fbca-f622-4503-80ec-a5d20be004fc-page-5.mp3",
        "keyword": "Can for two."
      },
      {
        "text": "So, they worked together, pushing out all the sand! *PUSH-PUSH!* They shared their shiny new fort, taking turns keeping watch. They learned that sharing made them not just happier, but much, much safer too! And they lived happily ever after, two brave crabs in their sparkling can fort!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/images/2026-04-29/ea2a6a23-7f90-48bb-8561-d993d0817dc0-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d9e530f8-83af-4156-aa35-e3bcdc9fe78c/audio/2026-04-29/cc0fddf5-f4f6-4c7a-99e9-64fb49151ea5-page-6.mp3",
        "keyword": "Safer together."
      }
    ]
  },
  {
    "id": 12,
    "title": "Chú Chuột Tic-tac Ham Ăn Vụng",
    "slug": "chu-chuot-tic-tac-ham-an-vung-mom77a6b",
    "category": "learning",
    "age": "3-5 tuổi",
    "duration": "5 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FFF1F2",
    "badgeColor": "#F43F5E",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/9ba8d79f-ddf5-4ff4-910c-acd461ef1204-page-1.webp",
    "description": "Tic-tac là chú chuột ham ăn vụng. Cậu lẻn vào bếp ăn trộm bánh ngọt, nhưng cuối cùng bị đau bụng và phải nhờ mẹ giúp đỡ. Tic-tac học được bài học quan trọng: thành thật và chờ đợi tốt hơn là ăn trộm.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 150,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Đây là Tic-tac! Một chú chuột nhỏ xinh. Tic-tac mặc một chiếc nơ xanh nhỏ xinh. Cậu rất thông minh và nhanh nhẹn. Nhưng… Tic-tac có một thói quen không tốt. Cậu thích ăn vụng! Cậu không bao giờ hỏi trước khi ăn đâu.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/9ba8d79f-ddf5-4ff4-910c-acd461ef1204-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/audio/2026-05-01/21a895cb-9118-47c9-b7eb-f24fda08916a-page-1-vi.wav",
        "keyword": "C"
      },
      {
        "text": "Một buổi chiều, mẹ Tic-tac nướng một chiếc bánh ngọt thơm phức! Bánh có mùi vani và socola. Tic-tac ngửi thấy mùi bánh. Ôi! Cậu thèm quá! 'Mẹ ơi, con muốn ăn bánh!' 'Con phải chờ đến bữa tối, con yêu,' mẹ mỉm cười. Nhưng Tic-tac không muốn chờ...",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/84c78a3d-4619-4f68-b895-31882b870708-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/audio/2026-05-01/fe111dcc-52f9-4d71-af96-042262bd9232-page-2-vi.wav",
        "keyword": "B"
      },
      {
        "text": "Đêm đến, khi mọi người đang ngủ, Tic-tac lén lút bước xuống bếp. Bếp tối om và lạnh lẽo. Tiếng tích tắc của đồng hồ nghe rõ ràng. Tic-tac nhảy lên bàn và nhìn thấy chiếc bánh! Cậu bắt đầu gặm... một miếng... hai miếng... ba miếng... Hmm! Ngon quá! 'Ơrimp! Ơrimp!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/1dd83b23-d80a-4592-ad27-2bbf80691d70-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/audio/2026-05-01/2b33f8bd-7a14-49f4-a877-fb12ccd8eb2e-page-3-vi.wav",
        "keyword": "Đ"
      },
      {
        "text": "Bụng Tic-tac bắt đầu kêu ục ục... 'Oái! Oái!' Cậu ăn quá nhiều! Đau bụng quá! Tic-tac cố chạy về phòng nhưng bị vấp ngã. Rầm! Tiếng động lớn đánh thức mẹ. Mẹ bật đèn lên và thấy Tic-tac đang nằm trên sàn bếp, ôm bụng khóc. 'Tic-tac! Con đã làm gì vậy?' mẹ hỏi lo lắng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/f474694c-227f-4d62-9d55-c579c2c16f84-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/audio/2026-05-01/39589a5c-4be5-44bc-aa28-66ee2f3f743e-page-4-vi.wav",
        "keyword": "Ục"
      },
      {
        "text": "Tic-tac khóc nhiều và thú nhận: 'Con xin lỗi mẹ... Con không nên ăn trộm bánh. Con đã ăn vụng và bị đau bụng. Con sẽ không làm như vậy nữa.' Mẹ ôm Tic-tac thật chặt. 'Mẹ biết con thích bánh. Nhưng lần sau, con hãy hỏi mẹ trước nhé. Đồ ăn ngon sẽ chờ con đấy.' Tic-tac mỉm cười và cảm thấy ấm áp trong lòng. Cậu đã học được bài học quan trọng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/images/2026-05-01/b94ee68e-17b2-4898-9a53-af405216e7ea-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d373ee8b-f053-4be0-bfb8-08dbf240aecc/audio/2026-05-01/090fee35-2432-4df3-b143-3a55c1571335-page-5-vi.wav",
        "keyword": "Xin lỗi"
      }
    ]
  },
  {
    "id": 13,
    "title": "Vịt Con Không Xấu Xí",
    "slug": "vit-con-khong-xau-xi-moqr3b83",
    "category": "Truyện cổ tích",
    "age": "4-6 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEE2E2",
    "badgeColor": "#EF4444",
    "image": "🦆",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/d0821f85-1992-496c-b87b-c3b01f92bebc-page-1.webp",
    "description": "Một câu chuyện ấm áp về chú vịt con có vẻ ngoài khác biệt nhưng luôn tự tin và kiên trì rèn luyện, để rồi khám phá ra vẻ đẹp lộng lẫy của chính mình. Câu chuyện dạy các bé về lòng tự trọng, sự nỗ lực và chấp nhận sự khác biệt.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Ngày xửa ngày xưa, trong một ổ rơm ấm áp, mẹ vịt hiền lành đang ấp ủ một ổ trứng tròn trịa. Mỗi quả trứng đều được mẹ nâng niu, mong chờ từng ngày những chú vịt con bé bỏng chào đời. Mẹ vịt kiên nhẫn chờ đợi, trái tim tràn đầy tình yêu thương.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/d0821f85-1992-496c-b87b-c3b01f92bebc-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/94d174d1-5954-45fa-a1d5-c0cb72f3e709-page-1-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Và rồi, TÁCH! TÁCH! Từng quả trứng nứt vỏ, những chú vịt con xinh xắn lần lượt chui ra. Ôi chao, bộ lông của chúng vàng óng như tơ, mềm mại và đáng yêu vô cùng! Chúng kêu 'Quàng! Quàng!' líu lo, chạy quanh mẹ thật vui.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/702975b8-b685-469e-b5dd-9d2fb1a7bd68-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/4c1eecb4-d70c-45d9-abda-d2caf3b7e119-page-2-vi.wav",
        "keyword": "Tách"
      },
      {
        "text": "Thế nhưng, quả trứng cuối cùng lại rất lớn và mất nhiều thời gian hơn để nở. CUỐP! Một chú vịt con to lớn với bộ lông màu xám xịt, khác hẳn các anh chị em, chậm rãi bước ra! Chú có vẻ ngoài thật đặc biệt, to hơn và lông màu khác biệt.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/1b51a9f4-f183-4a1a-a75c-3ea83a6ffb49-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/6147b510-f7ff-41fd-ab2f-86225685ec45-page-3-vi.wav",
        "keyword": "Xám"
      },
      {
        "text": "Các anh chị vịt con nhìn chú vịt xám rồi xì xào: 'Ôi chao, sao em ấy lại to thế nhỉ? Lông cũng chẳng vàng óng như chúng ta!' Chúng không muốn chơi cùng chú, cứ thế lảng tránh, để chú vịt xám một mình.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/9771eea6-1db4-4a70-a1b4-e4ba1ee964bf-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/a9870bc6-943d-41ed-878c-e71963e8fe36-page-4-vi.wav",
        "keyword": "To"
      },
      {
        "text": "Không chỉ có các anh chị, mà các loài vật khác trong vườn cũng túm tụm lại. 'Kìa, nhìn chú vịt xám kìa! Thật là lạ lùng!', chúng cười khúc khích, trêu chọc vì vẻ ngoài khác biệt của chú. Vịt xám cảm thấy hơi cô đơn, nhưng chú vẫn mỉm cười.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/9f3d7f2e-d345-4709-819a-340f5093d8be-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/d50cd5fe-fbfe-415d-81bb-f6809ec2aa41-page-5-vi.wav",
        "keyword": "Lạ"
      },
      {
        "text": "Dù bị xa lánh và trêu chọc, chú vịt xám không hề buồn bã! Chú nhìn mình trong vũng nước và tự nhủ: 'Mình khác biệt nhưng mình vẫn là mình, và mình sẽ nỗ lực để trở nên thật giỏi giang!' Chú nở một nụ cười thật tươi, tràn đầy niềm tin.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/20e50b2f-2294-4f3d-9da6-44333f2470c0-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/54318a94-443d-42de-8069-eb656543c8bd-page-6-vi.wav",
        "keyword": "Cười"
      },
      {
        "text": "Mỗi sáng sớm tinh mơ, khi mọi người còn đang say ngủ, chú vịt xám đã lạch bạch ra sông. Chú chăm chỉ tập bơi, sải cánh thật mạnh mẽ để đôi tay thêm săn chắc và dẻo dai. Chú còn học cách tự tìm thức ăn và còn giúp đỡ những bạn nhỏ khác trong khu vườn nữa!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/a32d4f9d-8ea2-4985-a1d4-4a607fa34450-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/dd669675-4d49-45e3-8eb5-a12a2ea3ec89-page-7-vi.wav",
        "keyword": "Bơi"
      },
      {
        "text": "Dù trời nắng chang chang hay mưa phùn lất phất, chú vịt xám vẫn luôn mỉm cười và yêu quý bản thân mình. Mùa đông lạnh giá đến, chú không hề ngại ngùng mà vẫn kiên trì rèn luyện đôi cánh mỗi ngày. Chú tin rằng chỉ cần cố gắng, mình sẽ tốt hơn từng chút một.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/88937f93-8aaa-4f5d-a960-2eb14635ef14-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/3c66d389-8972-44c5-bcdf-95cf062fb090-page-8-vi.wav",
        "keyword": "Tin"
      },
      {
        "text": "Và rồi, một điều kỳ diệu đã xảy ra! Những sợi lông xám cũ kỹ của chú vịt dần rụng đi, thay vào đó là một lớp lông trắng muốt, tinh khôi. Cái cổ của chú vươn cao, thanh thoát và vô cùng duyên dáng, đẹp đẽ biết bao!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/b893a2e0-9959-4ee6-b9d3-8cde51ed4f92-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/148b60a1-39ac-481e-bb50-caeed258d9f7-page-9-vi.wav",
        "keyword": "Đẹp"
      },
      {
        "text": "Một buổi sáng mùa xuân trong lành, chú vịt con soi mình xuống dòng nước trong xanh. Chú ngỡ ngàng nhận ra mình đã trở thành một chú THIÊN NGA lộng lẫy, kiêu sa! Hạnh phúc tràn ngập, chú sải cánh bay cao giữa trời xanh, kiêu hãnh vì những nỗ lực của chính mình. Vẻ đẹp này chính là phần thưởng cho lòng kiên trì và sự tự tin của chú!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/images/2026-05-04/c26d7b05-658c-4488-a8ed-7032f79ba185-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/d0bed247-6f96-499f-af44-5265763db282/audio/2026-05-04/600968d0-fc1d-4281-b07e-f05362980a0b-page-10-vi.wav",
        "keyword": "Bay"
      }
    ]
  },
  {
    "id": 14,
    "title": "Sự Thật Thú Vị Về Loài Nhện",
    "slug": "su-that-thu-vi-loai-nhen-moqt4cgx",
    "category": "Động vật",
    "age": "4-6 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#ECFDF5",
    "badgeColor": "#10B981",
    "image": "🕷️",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/faa4cbd8-755c-4fb5-a37c-87b56aa5a857-page-1.webp",
    "description": "Cùng bé khám phá 10 sự thật bất ngờ và kỳ diệu về những người bạn nhện tí hon. Từ những đôi chân nhanh nhẹn đến sợi tơ siêu chắc, bé sẽ thấy nhện thật đáng yêu và hữu ích!",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Xin chào các bạn nhỏ! Hôm nay, chúng mình sẽ cùng khám phá thế giới của những người bạn nhện bé xíu mà thật đáng yêu nhé! Các bạn biết không vì nhện có tận tám cái chân dài ngoẵng, nên nhện không phải là côn trùng, các bạn côn trùng chỉ có sáu chân thôi đó!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/faa4cbd8-755c-4fb5-a37c-87b56aa5a857-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/10847cd0-f9b9-4c79-98dc-ed7a85bbc40f-page-1-vi.wav",
        "keyword": "Nhện"
      },
      {
        "text": "Nhện là những nghệ sĩ dệt tơ tài ba! Từ trong bụng mình, nhện tạo ra những sợi tơ óng ánh, mỏng manh nhưng lại siêu siêu chắc khỏe. Sợi tơ này còn bền hơn cả dây thép luôn đó, thật kỳ diệu phải không nào?",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/62110ba1-6613-49a7-8750-9e7f25875af7-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/4fb13d78-470b-4a3e-a196-3f3657653b07-page-2-vi.wav",
        "keyword": "Tơ"
      },
      {
        "text": "Bạn có biết không, đa số các bạn nhện có tận tám con mắt tròn xoe lấp lánh để nhìn xung quanh đấy! Dù có nhiều mắt nhưng nhện lại giỏi dùng những cái chân dài để cảm nhận những rung động nhỏ xíu trên mạng nhện. Rung rinh... rung rinh... nhện biết ngay có gì đó đang đến gần!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/6980917f-0478-4887-85d3-8ca312d43603-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/c546b57e-2c27-44b9-a444-98855a8699c4-page-3-vi.wav",
        "keyword": "Mắt"
      },
      {
        "text": "Máu của chúng mình có màu đỏ thật đẹp, nhưng máu của bạn nhện lại có màu xanh lá cây hoặc xanh dương nhạt cơ! Thật là một điều bí mật nho nhỏ của thiên nhiên mà nhện đã cất giấu. Một dòng máu màu xanh biếc thật đặc biệt, đúng không?",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/0be0d0bc-18bc-4c6c-9578-7ed5b2d08e9c-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/052d8510-778d-4607-b060-5f98fa1163f4-page-4-vi.wav",
        "keyword": "Máu"
      },
      {
        "text": "Nhện không có răng để nhai kẹo hay cơm như chúng mình đâu. Khi đói bụng, nhện biến thức ăn thành dạng lỏng, giống như một ly sinh tố thơm ngon. Sau đó, nhện chỉ cần dùng miệng để \"hút\" một hơi là no bụng rồi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/86f68e5b-5685-42ca-b504-35d746845a66-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/a56dfbeb-9287-4874-98b7-8de2b7dcbef2-page-5-vi.wav",
        "keyword": "Răng"
      },
      {
        "text": "Những bạn nhện tí hon còn có một phép thuật diệu kỳ: phóng tơ lên trời để gió cuốn đi xa tít tắp! Nhờ sợi tơ ấy, nhện có thể bay qua những cánh đồng xanh mướt và những dòng sông lấp lánh. Giống như đang đi khinh khí cầu tí hon vậy, thật là thích thú!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/bd10d42e-17b0-49ef-9e8e-57ba71955dd1-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/2956f731-f842-4ea5-8a53-cf06ccb53e95-page-6-vi.wav",
        "keyword": "Bay"
      },
      {
        "text": "Bé có biết không, nhện sống ở khắp mọi nơi trên thế giới này, từ khu vườn nhỏ xinh đến những khu rừng rậm rạp! Bạn ấy rất dễ thích nghi và chỉ có một nơi quá lạnh lẽo là không có nhện thôi. Đó là vùng Nam Cực băng giá!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/d9fd2bb7-1304-4c60-b4df-f01e0e3a4158-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/aab9ae8b-80fc-4271-ba05-e3cbdc0c0199-page-7-vi.wav",
        "keyword": "Sống"
      },
      {
        "text": "Mạng nhện không chỉ là ngôi nhà ấm áp mà còn là một cái bẫy siêu thông minh của bạn nhện nữa đó! Những sợi tơ dính dính giúp nhện bắt những bạn ruồi, muỗi ham chơi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/fde8f132-759b-459c-a495-1bc17c147710-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/7c2b6fc3-597d-428e-a564-b95c46744cfe-page-8-vi.wav",
        "keyword": "Bẫy"
      },
      {
        "text": "Thật ngạc nhiên, có một bạn nhện còn là thợ lặn tài ba nữa cơ, đó là nhện chuông nước! Bạn ấy xây nhà dưới nước và mang theo một quả bóng không khí để thở, giống như bình oxy của thợ lặn vậy. Nhờ thế, bạn ấy có thể tung tăng dưới lòng suối mát rượi để tìm thức ăn!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/f739abaa-d62a-4d32-bbf1-6ad8cfa0ce92-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/9c420ac2-a540-46b4-b917-ab533a523882-page-9-vi.wav",
        "keyword": "Lặn"
      },
      {
        "text": "Và điều cuối cùng, nhện chính là những người bạn tốt bụng của các bác nông dân đấy! Nhện giúp bảo vệ rau củ và trái cây ngon bằng cách ăn những con sâu làm hư hại cây trồng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/images/2026-05-04/14a968ee-f1c1-47a1-a8a0-68167867b757-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/cdc3c6cd-1a53-44d7-8ea9-ef31a5f1156d/audio/2026-05-04/ba7fd1f1-2479-4e8e-bdcb-d71372ab09d5-page-10-vi.wav",
        "keyword": "Giúp"
      }
    ]
  },
  {
    "id": 15,
    "title": "Nhật Thực Là Gì Bé Nhỉ?",
    "slug": "nhat-thuc-la-gi-be-nhi-mpc6t1ed",
    "category": "learning",
    "age": "4-7 tuổi",
    "duration": "5 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEF3C7",
    "badgeColor": "#F59E0B",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-1.webp",
    "description": "Ba người bạn thân trên bầu trời — Anh Mặt Trời, Chị Mặt Trăng và Bạn Trái Đất — khám phá hiện tượng nhật thực qua trò chơi trốn tìm độc đáo.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 150,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Trên bầu trời xanh thẳm, có ba người bạn thân sống cùng nhau từ thuở hồng hoang. Anh Mặt Trời tỏa sáng rực rỡ, Chị Mặt Trăng xinh đẹp dịu dàng, và Bạn Trái Đất hiền lành, tốt bụng. Họ yêu quý nhau như anh em một nhà!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/audio/page-1-vi.wav",
        "keyword": "Bầu trời"
      },
      {
        "text": "Hằng ngày, Anh Mặt Trời vui vẻ chiếu những tia nắng ấm áp xuống cho Bạn Trái Đất. Những cánh đồng xanh tươi đón ánh sáng, những chú chim hót ca, và các bạn nhỏ đều cười vui vì có ánh mặt trời. Còn Chị Mặt Trăng thì thích bơi vòng quanh, xoay tròn như một vũ công.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/audio/page-2-vi.wav",
        "keyword": "Ánh sáng"
      },
      {
        "text": "Một ngày đẹp trời, ba người bạn tình cờ xếp thành một đường thẳng. Chị Mặt Trăng bơi vào chính giữa che mất anh Mặt Trời! \"Trời ơi, Mặt Trời đi đâu rồi?\" Bạn Trái Đất ngạc nhiên la lên!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/audio/page-3-vi.wav",
        "keyword": "Đường thẳng"
      },
      {
        "text": "Bùm! Bầu trời bỗng tối sầm lại giữa ban ngày! Chiếc bóng khổng lồ của Chị Mặt Trăng che khuất hoàn toàn ánh sáng Mặt Trời. Các chú chim ngơ ngác nhìn lên trời, tưởng trời đã tối nên rủ nhau đi ngủ. Những chú chim ngủ dưới gốc cây, còn hoa lá thì e ngại đón ánh sáng yếu ớt. Đó là lúc hiện tượng nhật thực xảy ra!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/audio/page-4-vi.wav",
        "keyword": "Bóng tối"
      },
      {
        "text": "Nhưng Chị Mặt Trăng không đứng yên lâu đâu! Chỉ một lát sau, chị ấy bơi đi chỗ khác, kết thúc trò chơi trốn tìm ngộ nghĩnh. Anh Mặt Trời lại ló ra với nụ cười rạng rỡ, chiếu sáng khắp nơi như bình thường. Các chú chim tỉnh dậy, ngạc nhiên hỏi: \"Trời lại sáng rồi sao?\" Người ta gọi trò chơi trốn tìm kỳ diệu này là NHẬT THỰC!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c987365a-d799-4f77-abcb-ed2911627f12/audio/page-5-vi.wav",
        "keyword": "Ánh sáng trở lại"
      }
    ]
  },
  {
    "id": 16,
    "title": "Xe Múc Max Và Bài Học \"Giờ Nào Việc Đó\"",
    "slug": "chu-xe-muc-max-va-bai-hoc-gio-nao-viec-o-mpgimr1i",
    "category": "learning",
    "age": "3-6 tuổi",
    "duration": "6 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#EFF6FF",
    "badgeColor": "#3B82F6",
    "image": "🚜",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-1.webp",
    "description": "Chú xe múc nhỏ màu vàng tên Max được giao nhiệm vụ đào hồ bơi cho công viên, nhưng bị phân tâm bởi bãi bùn bong bóng xà phòng và quên mất việc phải làm. Câu chuyện dạy trẻ bài học về quản lý thời gian: làm việc trước, chơi sau.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 180,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Sáng hôm đó tại công trường Công viên Thiếu nhi, bác Cần Cẩu trưởng công trường gọi xe múc Max lại và dặn dò: \"Cháu nhớ đào xong hồ bơi trước khi mặt trời lặn để bác Xe Bồn đến đổ nước nhé!\" Max hăm hở gật đầu lia lịa, nổ máy Vroom! Vroom! đầy tự tin và hứa sẽ hoàn thành thật nhanh.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-1-vi.wav",
        "keyword": "Cần cẩu"
      },
      {
        "text": "Max chạy thật nhanh về phía khu vực đào hồ. Nhưng trên đường đi, chú bỗng nhìn thấy một bãi bùn bong bóng xà phòng siêu to và lấp lánh do trận mưa đêm qua để lại. Những quả bong bóng đủ màu sắc lấp lánh như kim cương! Max thích thú quá đỗi, tự nhủ: \"Mình chỉ chơi xúc bùn tạo bong bóng đúng 5 phút thôi, rồi sẽ đi làm ngay!\"",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-2-vi.wav",
        "keyword": "Bong bóng"
      },
      {
        "text": "Max lao vào bãi bùn ngay lập tức, hạ gàu múc xuống rồi hất mạnh lên trời. \"Ôooo!\" hàng nghìn bong bóng bay lên cao, đủ màu xanh, đỏ, vàng, tím lấp lánh như đám pháo hoa. Max reo lên \"Tuyệt quá!\" rồi lại hất tiếp. Chú tự hứa \"Nốt một lần nữa thôi\" nhưng rồi 5 phút biến thành cả buổi chiều. Max quên mất lời dặn của bác Cần Cẩu, quên luôn cả nhiệm vụ quan trọng!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-3-vi.wav",
        "keyword": "Chơi"
      },
      {
        "text": "Khi tiếng chuông báo hiệu hết giờ vang lên và mặt trời lặn xuống, Max mới giật mình hoảng hốt chạy về công trường. Ôi không! Hồ bơi vẫn chưa được đào một gàu đất nào! Bác Xe Bồn chở nước đã lùi bánh vào vị trí sẵn sàng xả nước. Dòng nước bắt đầu chảy lênh láng, suýt ngập cả công trường! Tiếng báo động vang lên khắp nơi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-4-vi.wav",
        "keyword": "Nước"
      },
      {
        "text": "Bác Xe Ủi và anh Xe Lu dù đã mệt rã rời sau một ngày làm việc vẫn phải vội vã chạy ra ứng cứu. Họ thức đến khuya, làm việc cật lực dưới ánh đèn pin để dọn dẹp. Nhìn mọi người vất vả vì mình, Max hối hận vô cùng. Những giọt nước mắt hối lỗi lăn dài trên má chú xe múc nhỏ màu vàng. Max cúi gằm chiếc gàu xuống đất, tự hứa sẽ không bao giờ như vậy nữa.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-5-vi.wav",
        "keyword": "Hối hận"
      },
      {
        "text": "Sáng hôm sau, khi công trường đã an toàn trở lại, bác Cần Cẩu nhẹ nhàng bảo Max: \"Chơi đùa không xấu, nhưng giờ nào thì việc đó cháu ạ! Nếu hôm qua cháu tập trung làm xong việc trước, thì cuối ngày cháu đã có thể tha hồ vui chơi mà không làm ảnh hưởng đến ai.\" Max gật đầu lia lịa, từ đó về sau luôn tự giác làm việc chăm chỉ trước. Mỗi khi thấy đồ chơi hấp dẫn, Max đều tự nhủ: \"Phải làm xong việc trước đã, rồi mình sẽ chơi thật vui sau!\" Và Max vừa trở thành thợ giỏi, vừa có những giờ chơi trọn vẹn và hạnh phúc.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/images/page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/c7734d47-389d-4194-bde5-4b0a6089d966/audio/page-6-vi.wav",
        "keyword": "Giờ nào việc đó"
      }
    ]
  },
  {
    "id": 17,
    "title": "Hungry Caterpillar: Thử Thách Vận Động",
    "slug": "hungry-caterpillar-thu-thach-van-ong-mou8xjym",
    "category": "Educational",
    "age": "3-6 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#F5F3FF",
    "badgeColor": "#8B5CF6",
    "image": "🐛",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/99de69c2-610d-428e-a9eb-83b1daa3a742-page-1.webp",
    "description": "Câu chuyện về chú sâu bướm Hungry Caterpillar lười biếng, chỉ thích ăn và ngủ. Cho đến khi cái bụng đau nhức đã khiến chú nhận ra tầm quan trọng của việc vận động. Liệu chú sâu có thể biến thành một chú bướm khỏe mạnh và xinh đẹp không?",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Dưới ánh trăng dịu mát, một quả trứng nhỏ xíu nằm ngoan trên chiếc lá xanh. Nhưng kìa, quả trứng không nằm im đâu, nó cứ lăn qua lăn lại vì chú sâu bên trong vẫn còn đang 'ngủ nướng' đấy! Chú sâu lười biếng của chúng ta chưa muốn thức dậy chút nào cả.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/99de69c2-610d-428e-a9eb-83b1daa3a742-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/02425753-a3a7-4aad-ae1e-57a3f5735750-page-1-vi.wav",
        "keyword": "Ờ"
      },
      {
        "text": "Sáng Chủ nhật rực rỡ, chú sâu bướm bé nhỏ cuối cùng cũng chui ra khỏi vỏ trứng. 'Ưỡn... à... oải...' chú ngáp một cái thật dài, rồi chẳng thèm bò đi tìm lá non mà lại tìm ngay một bóng râm mát mẻ để nằm nghỉ tiếp. 'Mới chui ra đã thấy mệt rồi!' chú nghĩ thầm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/78ef3987-8d4a-422b-b790-d3050fc73f72-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/98878cd2-ca65-401d-b2b0-a917f058f387-page-2-vi.wav",
        "keyword": "À"
      },
      {
        "text": "Thứ Hai đến rồi! 'Rột rột rột!' Hungry Caterpillar chén hết một quả táo đỏ tươi ngon lành. Cái bụng chú bắt đầu nhô lên một chút xíu. Chú định bụng sẽ tập thể dục, nhưng rồi lại nghĩ: 'Thôi, nằm ngủ một tí chắc không sao đâu nhỉ?' và thế là chú lại lim dim mắt.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/c3bc3b05-6032-48aa-95a0-d079d610b6be-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/2ffd2a70-9915-4a5f-80b6-7c80ea6d44de-page-3-vi.wav",
        "keyword": "Ơ"
      },
      {
        "text": "Vào Thứ Ba, 'Ngon quá là ngon!' Hungry Caterpillar ăn liền hai quả lê vàng ươm, ngọt lịm. Bụng chú giờ nặng trịch, tròn xoe như một quả bóng vậy. Bạn Cào Cào vui vẻ 'Ting ting!' nhảy dây rủ rê: 'Nhảy cùng tớ đi!'. Nhưng chú sâu chỉ lắc đầu: 'Ôi, bụng tớ nặng quá, không nhảy nổi đâu!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/eb70d64a-ba8c-4c63-b68f-bdcae9541401-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/91262878-8c70-4241-80f0-a4734c9f895b-page-4-vi.wav",
        "keyword": "Ô"
      },
      {
        "text": "Thứ Tư, chú sâu của chúng ta lại 'Rộp rộp rộp!' ăn hết ba quả mận tím mọng nước. Chú thấy bạn Kiến tí hon đang hì hụi vác thức ăn về tổ, bò nhanh thoăn thoắt. Hungry Caterpillar thử bò theo, nhưng chỉ được một đoạn ngắn thôi là chú đã 'Hù... hù... hù...' thở hổn hển rồi: 'Đợi tớ với, tớ hết hơi rồi!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/f9894c62-5218-49fb-bfa9-240c1801dae6-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/4ccf45aa-1c72-4299-aecf-2b27bbf0b2e9-page-5-vi.wav",
        "keyword": "Ư"
      },
      {
        "text": "Thứ Năm, sau khi chén sạch bốn quả dâu tây đỏ mọng, Hungry Caterpillar béo ú đến nỗi bụng chú chạm hẳn xuống đất. Chú nhìn xuống, hốt hoảng kêu lên: 'Ôi không, chân của tớ đâu mất rồi? Bụng tớ to quá, che hết cả chân rồi!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/1f80e5e6-e1c9-4cd4-a9d2-83fb12fb0d18-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/919e69b5-b2bc-4f1b-b34d-c772a7c199a1-page-6-vi.wav",
        "keyword": "Ồ"
      },
      {
        "text": "Vào Thứ Bảy, chú sâu của chúng ta có một bữa tiệc khổng lồ với kem, xúc xích và bánh ngọt! 'Ối! Ui da! Đau quá!' Chú ôm bụng lăn qua lăn lại, mặt mày xanh xao. Chú không thể bò, không thể lăn, chỉ có thể nằm im một chỗ vì cái bụng đau nhức.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/f0d1aebb-77c6-48c5-b8c0-d6f3659979d1-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/19e8dd92-13f5-49b4-9e31-c98437379a5a-page-7-vi.wav",
        "keyword": "Ai"
      },
      {
        "text": "Chủ Nhật, chú sâu ăn một chiếc lá xanh tươi, và kì diệu thay, chú thấy khỏe hơn hẳn! 'Mình phải thay đổi thôi!' chú tự nhủ. 'Mình phải tập thể dục chăm chỉ để hóa thành một chú bướm xinh đẹp, khỏe mạnh!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/48c03d1a-527c-42ae-899a-7c1b063f4e3b-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/e91c8939-fc4e-48ad-bf83-f72c22b27a28-page-8-vi.wav",
        "keyword": "Ờ"
      },
      {
        "text": "Thế là, 'Một, hai! Một, hai!' Hungry Caterpillar bắt đầu khóa huấn luyện 'Sâu lực sĩ' của mình! Chú bò lên bò xuống gân lá, tập nâng những hạt sương long lanh, rồi vươn vai thật cao, duỗi thẳng người. Chú quyết tâm lắm!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/f85f41c3-f1be-4450-ad60-70dc7b990a23-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/64e12ee9-fd93-4a7e-8c44-48a12e16dfb6-page-9-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Nhờ chăm chỉ vận động mỗi ngày, chú sâu đã xây được một cái kén thật chắc chắn và ấm áp. Và nhìn xem! 'Vút! Vút!' Hungry Caterpillar giờ đã biến thành một chú bướm khỏe mạnh, với đôi cánh rực rỡ, bay lượn tự do, cao vút đến tận những đám mây xanh thẳm!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/images/2026-05-06/41c03b50-214b-4836-822a-3abfc4a5cb44-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/be783ed2-d121-4b16-abae-868816406f96/audio/2026-05-06/7cc8e72e-2436-4a6b-8f63-98b118c18774-page-10-vi.wav",
        "keyword": "Ơ"
      }
    ]
  },
  {
    "id": 18,
    "title": "Ăn Vạ Là Vô Ích",
    "slug": "chu-ca-he-mi-khong-an-va-nua-mp55uip7",
    "category": "Giáo dục",
    "age": "4-10 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FFF1F2",
    "badgeColor": "#F43F5E",
    "image": "🏫",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/8477d40e-4695-4517-9c71-0638a2754ceb-page-1.webp",
    "description": "Mi là một chú cá hề dễ thương nhưng lại có tật xấu là rất thích ăn vạ. Một ngày nọ, khi gặp nguy hiểm, Mi nhận ra rằng ăn vạ không giúp giải quyết vấn đề mà còn khiến mọi chuyện tệ hơn. Câu chuyện về hành trình Mi học cách bình tĩnh đối mặt với khó khăn.",
    "moral": "Bé ơi nhớ rằng, ăn vạ không giúp giải quyết vấn đề mà còn khiến mọi chuyện tệ hơn. Thay vào đó, chúng ta hãy học cách bình tĩnh đối mặt với khó khăn con nhé.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Dưới rặng san hô lấp lánh, có một chú cá hề nhỏ tên là Mi. Mi rất dễ thương với những sọc cam trắng tinh nghịch, nhưng chú lại có một tật xấu: cực kỳ thích ăn vạ! Mỗi khi không vừa ý, chú liền nằm ườn ra bãi cát, quẫy đuôi đành đạch và khóc lóc om sòm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/8477d40e-4695-4517-9c71-0638a2754ceb-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/06b07e66-179e-40f4-8b36-86968db636a5-page-1-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Mẹ cá hề luôn nhẹ nhàng bảo chú: “Mi ơi, ăn vạ không khiến con có được điều mình muốn, cũng chẳng giải quyết được vấn đề gì đâu.” Thế nhưng Mi chẳng thèm nghe, chú luôn nghĩ cứ khóc thật to là mọi người sẽ phải chiều theo ý mình.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/5cd4b5fa-2f94-4ed0-a7cc-714f41c50d71-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/d05ff6b1-a83c-4d43-a1f5-be5ee3da3c7e-page-2-vi.wav",
        "keyword": "Ơ"
      },
      {
        "text": "Một buổi sáng nắng đẹp, Mi tự ý bơi ra xa khỏi rặng san hô an toàn để đuổi theo một đàn bướm biển sặc sỡ. Chúng lượn lờ, bay bổng như những cánh hoa biết bơi, khiến Mi thích thú vô cùng. Chú mải mê rong chơi, quên mất lời mẹ dặn phải ở gần nhà.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/9c79822d-9b47-4337-9f8b-4d9f74af0d61-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/cb5a247b-4b16-46e9-b209-e6a364703c6c-page-3-vi.wav",
        "keyword": "Ô"
      },
      {
        "text": "Ôi không! Mải mê đuổi theo những cánh bướm, chú không may bị mắc kẹt chiếc đuôi nhỏ vào một khe đá hẹp. Cái đuôi xinh xắn bị kẹp chặt, đau điếng và chú không thể nhúc nhích được nữa. Mi cảm thấy sợ hãi và khó chịu vô cùng.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/49b1b958-0989-4b15-93bd-5e35e2db7fed-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/fd02bd4e-c20c-4e94-ae6b-3638ecefe1cb-page-4-vi.wav",
        "keyword": "Ui"
      },
      {
        "text": "Thay vì bình tĩnh tìm cách rút đuôi ra, Mi liền giở thói quen cũ. Chú bắt đầu khóc lóc và ăn vạ một mình, giãy giụa và hét lớn: “Con không chịu đâu! Đá hư quá, thả con ra mau!”. Tiếng khóc của Mi vang vọng khắp đáy biển.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/f520444d-28bc-46cc-aade-a9cd5d08739e-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/d9d3fd97-1170-4824-b08b-c2bab2b49a4b-page-5-vi.wav",
        "keyword": "Á"
      },
      {
        "text": "Tuy nhiên, tảng đá vẫn đứng im lìm, không hề nhúc nhích trước những giọt nước mắt hay sự giận dỗi của chú. Tiếng khóc lớn của Mi không làm hòn đá lùi lại, mà ngược lại, nó thu hút một con cá chình hung dữ gần đó. Nghe thấy tiếng động, con cá chình liền lao ra khỏi hang, nhe hàm răng nhọn hoắt.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/72c5c22d-37ea-4987-8dd9-ebf71263745d-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/e269d1c5-b76a-474e-a739-710bc1f0c8ec-page-6-vi.wav",
        "keyword": "Ù"
      },
      {
        "text": "Con cá chình ghê rợn đang lao thẳng về phía chú cá hề nhỏ! Quá hoảng sợ, Mi sực nhớ lại lời mẹ dặn: ăn vạ hoàn toàn vô ích trong mọi hoàn cảnh, phải tự cứu lấy mình thôi. Chú lập tức nín bặt, nén cái đau ở đuôi và dùng hết sự bình tĩnh để quan sát kỹ khe đá.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/52945ed9-5ca8-4afd-8333-90c7ff022dc7-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/089f59ba-5146-4704-b3eb-c7c0068eda32-page-7-vi.wav",
        "keyword": "Ơi"
      },
      {
        "text": "Mi hít một hơi thật sâu, rồi khéo léo nghiêng người. Chú thu nhỏ vây lại, cẩn thận lách từng chút một. “Xoẹt!” Cái đuôi nhỏ cuối cùng cũng được rút ra khỏi khe đá hẹp.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/ac6970a1-db53-48e3-943a-03b7bf5ea209-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/365cd9cb-3b92-47e2-878a-42cebb157740-page-8-vi.wav",
        "keyword": "Ư"
      },
      {
        "text": "Ngay khi vừa thoát khỏi bẫy, Mi liền lao vút vào một bụi hải quỳ gần đó ẩn nấp. Chú bơi thật nhanh, ngay trước khi cá chình kịp đớp tới, và ẩn mình an toàn giữa những xúc tu mềm mại. Tim Mi vẫn đập thình thịch vì sợ hãi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/0df12131-595e-476f-ba78-73277a0295eb-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/91655684-c6ab-4dc7-9f7b-ffa5520f636a-page-9-vi.wav",
        "keyword": "Ê"
      },
      {
        "text": "Khi đã bơi về nhà an toàn trong vòng tay ấm áp của mẹ, Mi vẫn còn run rẩy nhưng đã hiểu ra một bài học lớn. Chú ôm chầm lấy mẹ và thút thít: “Mẹ ơi, con hiểu rồi ạ. Con ăn vạ với tảng đá nhưng nó chẳng thèm nghe, suýt nữa con còn bị cá chình bắt mất.” Từ đó về sau, chú cá hề Mi không bao giờ khóc lóc ăn vạ nữa mà luôn bình tĩnh suy nghĩ để tìm cách giải quyết mọi khó khăn.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/images/2026-05-14/051adf5b-f7c3-4e54-86c9-5c75e8a3cd62-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b7c2d196-8707-461e-89f5-47cb46c31212/audio/2026-05-14/1c78eb17-2e96-4b75-9cae-a013d6a456b4-page-10-vi.wav",
        "keyword": "Ôi"
      }
    ]
  },
  {
    "id": 19,
    "title": "Cha Rất Yêu Con",
    "slug": "tinh-yeu-vi-ai-cua-cha-motrmb4i",
    "category": "Truyện thiếu nhi",
    "age": "4-6 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#FEE2E2",
    "badgeColor": "#EF4444",
    "image": "📚",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/7ece5397-33b7-44a9-ae95-82dd7073ad6a-page-1.webp",
    "description": "Trong khu rừng đại ngàn, Sư tử con Leo luôn nghĩ cha mình nghiêm khắc và không yêu thương chú. Nhưng khi lạc đàn và gặp nguy hiểm, Sư tử cha đã xuất hiện, dũng cảm chiến đấu để bảo vệ con, giúp Leo nhận ra tình yêu bao la và ấm áp của cha mình.",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Trong một khu rừng đại ngàn xanh thẳm, có một chú Sư tử con tên là Leo. Leo rất yêu rừng nhưng đôi khi lại thấy sợ Sư tử cha mạnh mẽ của mình.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/7ece5397-33b7-44a9-ae95-82dd7073ad6a-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/34ab6fbe-0a65-404b-91aa-7fc4a7ec7074-page-1-vi.wav",
        "keyword": "L"
      },
      {
        "text": "Sư tử cha luôn có ánh mắt nghiêm nghị, giọng nói trầm ấm nhưng dứt khoát. Leo cứ nghĩ cha không yêu mình nhiều vì cha ít khi cười và hay nhắc nhở chú.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/dda659f3-6cde-4735-84fc-dfcf41a58f14-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/624f7a8e-8ffc-44fd-8ec2-f8ca5b8afab1-page-2-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Mỗi buổi sáng, khi Sư tử cha đi săn, Leo thường chơi đùa cùng các bạn. Chú luôn cố gắng không làm gì sai để cha không phải nghiêm khắc.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/f88df792-8e71-4cc5-98df-ea2657728e5d-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/d60ec31e-ba15-4a05-9ac2-c78bbbc14742-page-3-vi.wav",
        "keyword": "S"
      },
      {
        "text": "Một ngày nọ, mải mê đuổi theo một chú bướm đủ màu sắc, Leo chạy thật xa, xa khỏi bầy đàn. Chú không hề hay biết mình đã đi lạc vào một nơi lạ lẫm.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/bd7f82b1-317d-45dd-8641-22a27d1ee829-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/1ff09f55-912d-4967-a4b9-48f6df97e33b-page-4-vi.wav",
        "keyword": "B"
      },
      {
        "text": "Bỗng dưng, một đàn linh cẩu đói bụng xuất hiện, vây quanh Leo. Tiếng cười khẩy ghê rợn của chúng khiến chú Sư tử con run rẩy vì sợ hãi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/903b19ad-2777-4b96-8ee0-7cdc4ad79335-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/802f798e-a420-461e-b12e-03a92c104252-page-5-vi.wav",
        "keyword": "Đ"
      },
      {
        "text": "Leo cố gắng chạy thật nhanh, nhưng bầy linh cẩu cứ bám sát, nhe nanh vuốt sắc nhọn. Tim chú đập thình thịch, chú gọi 'Cha ơi! Cứu con với!'",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/4010873b-2ad3-4310-9d66-3111b401f9c3-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/52e7297a-3fdf-44d7-a092-7f56ace425da-page-6-vi.wav",
        "keyword": "C"
      },
      {
        "text": "Đúng lúc ấy, một tiếng gầm vang dội, mạnh mẽ làm rung chuyển cả khu rừng! RẦMM! Sư tử cha xuất hiện, vươn mình che chắn cho Leo.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/93fc6b76-c89c-4c02-8c16-8ba4667d5867-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/5c2823fa-7d41-41d7-a489-13080389b6ff-page-7-vi.wav",
        "keyword": "G"
      },
      {
        "text": "Cha dũng mãnh lao vào trận chiến, dùng sức mạnh phi thường để đẩy lùi từng con linh cẩu hung dữ. Cha không màng vết thương, chỉ muốn bảo vệ đứa con nhỏ bé.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/07361047-daa6-4f31-b036-095855087b34-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/b159ec4a-17e4-416a-987e-18b2a1189a4d-page-8-vi.wav",
        "keyword": "M"
      },
      {
        "text": "Cuối cùng, bầy linh cẩu sợ hãi bỏ chạy tán loạn. Sư tử cha tiến lại gần, ánh mắt nghiêm nghị thường ngày giờ đây tràn đầy sự che chở và dịu dàng đến lạ.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/30a7caf1-837e-4fa9-acf7-9acfc7149470-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/f07e1a43-0a5a-4bb7-82f9-fa6aaba32cea-page-9-vi.wav",
        "keyword": "T"
      },
      {
        "text": "Leo xúc động nghẹn ngào, chú lao vào lòng cha và ôm thật chặt. Chú hiểu rằng tình yêu của cha luôn nồng ấm và vĩ đại theo cách riêng của nó, chú là đứa trẻ hạnh phúc nhất thế gian!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/images/2026-05-06/270afe97-fa84-43f5-a68d-270ac672077e-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b772a482-38ec-4d9b-8ace-bc50b21eca8d/audio/2026-05-06/1728c6cb-31cb-4368-b427-22ce7bcf29dd-page-10-vi.wav",
        "keyword": "H"
      }
    ]
  },
  {
    "id": 20,
    "title": "Giấc Mơ Robot Của Nobita",
    "slug": "giac-mo-robot-cua-nobita-mowzu7iz",
    "category": "Truyện hài hước",
    "age": "5-9 tuổi",
    "duration": "10 phút",
    "rating": 4.8,
    "audio": true,
    "color": "#ECFDF5",
    "badgeColor": "#10B981",
    "image": "🤖",
    "coverImageUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/26068234-85e3-4ff4-896b-5a7f470d5f8c-page-1.webp",
    "description": "Nobita thức trắng đêm để hoàn thành mô hình robot khổng lồ, mơ mộng về chiến thắng trước Suneo. Nhưng khi đến trường, cơn buồn ngủ ập đến khiến cậu biến tiết học Toán thành một trận chiến robot đầy hài hước và bất ngờ!",
    "moral": "Hãy luôn học hỏi và trân trọng những bài học quý giá từ cuộc sống.",
    "audioDuration": 300,
    "author": "BéĐọc",
    "pages": [
      {
        "text": "Đêm khuya thanh vắng, chỉ có tiếng “tách… tách… xoẹt!” vang lên đều đặn. Nobita, với đôi mắt sáng rực, đang miệt mài lắp ráp mô hình robot khổng lồ của mình, mặc cho Doraemon đã ngáy khò khò từ lâu.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/26068234-85e3-4ff4-896b-5a7f470d5f8c-page-1.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/8b17eb21-0614-48e9-9f82-e0a5e84332f1-page-1-vi.wav",
        "keyword": "A"
      },
      {
        "text": "Đồng hồ điểm ba giờ sáng, cuối cùng, chú robot cũng hoàn thành! Nobita mỉm cười đắc ý, tưởng tượng ra cảnh Suneo sẽ há hốc mồm kinh ngạc vào ngày mai. Cậu bé chìm vào giấc ngủ với nụ cười mãn nguyện trên môi.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/6f4fbd27-097e-4c21-a7b2-636cf71ae5d5-page-2.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/802b05ec-8fe6-483a-afd9-06fa111899bd-page-2-vi.wav",
        "keyword": "Ơ"
      },
      {
        "text": "Sáng hôm sau, tiếng chuông báo thức “reng… reng… reng!” inh ỏi nhưng Nobita vẫn nằm im thin thít. Doraemon lo lắng, đành phải dùng đến “Tay đấm báo thức” đặc biệt của mình. “BÙM!” một tiếng, Nobita giật bắn mình bật dậy!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/4e03baf3-2229-4dd4-94a5-2ca8132c352a-page-3.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/97a59e6c-3688-4533-aa08-726b8497df4f-page-3-vi.wav",
        "keyword": "O"
      },
      {
        "text": "Với đôi mắt lờ đờ như hai hòn bi ve sắp lăn ra ngoài, Nobita lảo đảo bước đến trường. Cậu cứ ngỡ mình đang đi trên mây, mỗi bước chân đều nặng trĩu như đeo chì.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/bad85552-bff4-4f20-95c6-97e1db7a56f2-page-4.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/bf0a9389-a4be-4c50-b076-f5d949d37ed3-page-4-vi.wav",
        "keyword": "I"
      },
      {
        "text": "Trong tiết Toán của thầy giáo, Nobita cố gắng mở to mắt, nhưng cơn buồn ngủ vẫn cứ kéo đến. Cậu bắt đầu lắc lư, đầu gật gù như gà mổ thóc, dần dần chìm vào một giấc mơ kỳ lạ.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/0476e510-58cc-4168-b903-57934e36a514-page-5.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/40ab3db0-961c-424d-84c6-bb611c9ff1d4-page-5-vi.wav",
        "keyword": "U"
      },
      {
        "text": "Trong mơ, Nobita đang điều khiển chú robot khổng lồ của mình, dũng mãnh chiến đấu với những con quái vật xấu xí. “Tiến lên! Tấn công!” cậu bé hét lớn trong đầu, điều khiển robot tung những cú đấm thép.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/b03daa53-6795-425c-8dce-10d8a8c25f26-page-6.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/14a1a8c8-3726-48e7-9aa7-30edead209b3-page-6-vi.wav",
        "keyword": "E"
      },
      {
        "text": "Nhưng ở ngoài đời thực, cảnh tượng lại thật khó đỡ! Nobita đang múa may quay cuồng với chiếc thước kẻ và compa, tưởng tượng chúng là vũ khí của robot. Cả lớp nhìn cậu với ánh mắt khó hiểu.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/d3080f2d-8038-4da2-8e1a-bce772916d9e-page-7.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/47a4e4c7-98e9-4663-bfcd-12cd3728436d-page-7-vi.wav",
        "keyword": "Y"
      },
      {
        "text": "“Nobita, lên bảng giải bài này!” Thầy giáo gọi to, tiếng thước gõ “cộc cộc” xuống bàn. Nobita giật mình, nhưng trong cơn mơ màng, cậu lại tưởng chiếc bảng đen là màn hình điều khiển robot khổng lồ!",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/2166e4cf-0e65-4867-bceb-570fef79f906-page-8.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/dbfbd1db-a115-4c52-8bfd-8cb0cf70fede-page-8-vi.wav",
        "keyword": "H"
      },
      {
        "text": "Thay vì viết công thức Toán, Nobita say sưa vẽ chằng chịt những sơ đồ lắp ráp robot, những mũi tên chỉ dẫn tấn công lên bảng. Cả lớp im phắc, ngơ ngác nhìn cậu bạn 'biểu diễn'.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/6674a5f3-fa98-4e23-87e6-1e3263a37586-page-9.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/9670d186-bd27-4ad3-9892-139ba4f07286-page-9-vi.wav",
        "keyword": "M"
      },
      {
        "text": "“CỐC!” Thầy giáo gõ thước vào đầu Nobita, khiến cậu bé bừng tỉnh. Nobita ngơ ngác nhìn xung quanh, nhận ra mình đang đứng trên bục giảng với một đống hình vẽ bậy. Cậu bị phạt đứng ngoài hành lang, miệng vẫn lẩm bẩm: “Chờ đấy Suneo, robot của tớ... khò... khò...” Doraemon đứng từ xa nhìn bạn, chỉ biết thở dài.",
        "image": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/images/2026-05-08/c9bd8b47-a8de-45be-8bc6-8c3b25695ac1-page-10.webp",
        "audioUrl": "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/b39c2948-0461-4703-8363-c6ad2b15653c/audio/2026-05-08/527a007c-8676-415b-a8c3-39abee4c4b1d-page-10-vi.wav",
        "keyword": "N"
      }
    ]
  }
];
