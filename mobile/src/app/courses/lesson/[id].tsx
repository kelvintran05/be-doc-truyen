import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Image, ActivityIndicator, Dimensions, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLessonDetail } from "../../../features/courses/courses.hooks";
import { ArrowLeft, Volume2, ArrowRight, CheckCircle2, Award, RefreshCw, Star, Languages, HelpCircle } from "lucide-react-native";
import { Audio } from "expo-av";
import { PremiumCard } from "../../../components/PremiumCard";

const { width } = Dimensions.get("window");

// Mock vocab data for L101 - L103 to guarantee a premium experience
const VOCAB_DATA: Record<number, Array<{ word: string; ipa: string; definition: string; vietnamese: string; example: string }>> = {
  101: [
    { word: "Body", ipa: "/ˈbɑː.di/", definition: "The physical structure of a person", vietnamese: "Cơ thể", example: "This is my body!" },
    { word: "Legs", ipa: "/leɡz/", definition: "The limbs used for walking and running", vietnamese: "Đôi chân", example: "See my legs? I can run." },
    { word: "Hand", ipa: "/hænd/", definition: "The part of the arm below the wrist", vietnamese: "Bàn tay", example: "See my hand? I can wave." },
    { word: "Think", ipa: "/θɪŋk/", definition: "To use your mind to consider things", vietnamese: "Suy nghĩ", example: "See my head? I can think." },
    { word: "Carry", ipa: "/ˈkær.i/", definition: "To support and move something from one place to another", vietnamese: "Mang, xách", example: "I can carry my bag." }
  ],
  102: [
    { word: "Float", ipa: "/floʊt/", definition: "To stay on top of a liquid without sinking", vietnamese: "Nổi", example: "The toy duck floats." },
    { word: "Sink", ipa: "/sɪŋk/", definition: "To go down below the surface of a liquid", vietnamese: "Chìm", example: "My shoe sinks." },
    { word: "Duck", ipa: "/dʌk/", definition: "A common water bird", vietnamese: "Con vịt", example: "Look at the yellow duck!" },
    { word: "Shoe", ipa: "/ʃuː/", definition: "A covering for the foot", vietnamese: "Chiếc giày", example: "The leather shoe is heavy." }
  ]
};

// Mock quiz data for L101 - L103
const QUIZ_DATA: Record<number, Array<{ question: string; options: string[]; answerIndex: number; hint: string }>> = {
  101: [
    { question: "What can I do with my legs?", options: ["I can think.", "I can run.", "I can wave."], answerIndex: 1, hint: "Check page 1" },
    { question: "What can I do with my head?", options: ["I can think.", "I can kick.", "I can throw."], answerIndex: 0, hint: "Check page 2" },
    { question: "What can I do with my arm?", options: ["I can look up.", "I can run.", "I can throw."], answerIndex: 2, hint: "Check page 2" }
  ],
  102: [
    { question: "What does the toy duck do?", options: ["It sinks.", "It floats.", "It runs."], answerIndex: 1, hint: "Check page 1" },
    { question: "What does the shoe do in water?", options: ["It sinks.", "It floats.", "It flies."], answerIndex: 0, hint: "Check page 1" }
  ]
};

export default function LessonPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = parseInt(id || "", 10);
  const { data: lesson, isLoading, error } = useLessonDetail(lessonId);

  // STORY state
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // VOCABULARY state
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // GAME state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameResults, setShowGameResults] = useState(false);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Autoplay sound when page changes in STORY mode
  useEffect(() => {
    if (lesson?.type === "STORY" && lesson.pages && lesson.pages[currentPageIndex]) {
      const page = lesson.pages[currentPageIndex];
      if (page.audioUrl) {
        playPageAudio(page.audioUrl);
      }
    }
  }, [currentPageIndex, lesson]);

  async function playPageAudio(url: string) {
    try {
      setIsPlayingAudio(true);
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlayingAudio(false);
        }
      });
    } catch (err) {
      console.warn("Failed to play page audio:", err);
      setIsPlayingAudio(false);
    }
  }

  // Handle Flip Card Animation
  const handleFlipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"]
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"]
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  // Vocab navigation
  const nextVocab = () => {
    const vocabs = VOCAB_DATA[lessonId] || VOCAB_DATA[101];
    if (vocabIndex < vocabs.length - 1) {
      setIsFlipped(false);
      flipAnimation.setValue(0);
      setVocabIndex(vocabIndex + 1);
    } else {
      router.back();
    }
  };

  // Game/Quiz submission
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    const correctIdx = quizzes[quizIndex].answerIndex;
    setIsAnswered(true);
    if (selectedOption === correctIdx) {
      setScore(score + 1);
    }
  };

  const nextQuiz = () => {
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowGameResults(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowGameResults(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE]">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-violet-600 mt-5 font-black text-lg text-center px-6 leading-8 font-quicksand">
          ✨ Đang mở rương bài học...
        </Text>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE] p-6">
        <Text className="text-red-500 text-lg font-black text-center font-quicksand">
          Không tải được bài học này. Vui lòng thử lại sau!
        </Text>
        <Pressable 
          onPress={() => router.back()}
          className="mt-6 bg-violet-600 py-3 px-6 rounded-2xl border-b-4 border-violet-850"
        >
          <Text className="text-white font-black font-quicksand">Quay Lại</Text>
        </Pressable>
      </View>
    );
  }

  // RENDER STORY TYPE
  if (lesson.type === "STORY") {
    const pages = lesson.pages || [];
    const activePage = pages[currentPageIndex];

    return (
      <View className="flex-1 bg-[#FAF8F5] pt-14 flex-col justify-between">
        {/* Top Header */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className="bg-white p-3 rounded-full border-2 border-slate-100 shadow-sm active:scale-90"
          >
            <ArrowLeft color="#1E293B" size={20} />
          </Pressable>
          <Text className="text-sm font-black text-slate-500 font-fredoka flex-1 text-center mr-8">
            Trang {currentPageIndex + 1} / {pages.length}
          </Text>
        </View>

        {/* Main Content Area */}
        {activePage && (
          <View className="flex-1 px-6 justify-center items-center mt-4">
            <PremiumCard 
              glowColor="#FDA4AF"
              className="border-violet-100/50 p-3 bg-white rounded-[32px] w-full items-center shadow-lg"
            >
              {/* Cover/Illustrator Image */}
              <Image
                source={{ uri: activePage.imageUrl }}
                className="w-full h-56 rounded-2xl border border-slate-50 mb-6"
                resizeMode="contain"
              />

              {/* Text content panel */}
              <View className="px-4 py-3 bg-violet-50/50 rounded-2xl border border-violet-100 w-full min-h-[90px] justify-center">
                <Text className="text-slate-800 text-center font-black text-lg font-quicksand leading-7">
                  {activePage.textContent}
                </Text>
              </View>
            </PremiumCard>
          </View>
        )}

        {/* Footer controls */}
        <View className="px-6 pb-10 pt-4 flex-row justify-between items-center bg-white/50 border-t border-slate-100">
          <Pressable
            disabled={currentPageIndex === 0}
            onPress={() => setCurrentPageIndex(currentPageIndex - 1)}
            className={`py-3.5 px-6 rounded-2xl border-b-4 flex-row items-center ${currentPageIndex === 0 ? 'bg-slate-100 border-slate-200 opacity-50' : 'bg-white border-slate-200 active:scale-95'}`}
          >
            <Text className={`font-black text-sm font-quicksand ${currentPageIndex === 0 ? 'text-slate-400' : 'text-slate-700'}`}>Quay Lại</Text>
          </Pressable>

          {/* Audio Button */}
          {activePage?.audioUrl && (
            <Pressable
              onPress={() => playPageAudio(activePage.audioUrl)}
              className={`p-4.5 rounded-full border-b-4 items-center justify-center active:scale-90 ${isPlayingAudio ? 'bg-rose-500 border-rose-750' : 'bg-[#8B5CF6] border-violet-850'}`}
            >
              <Volume2 color="#FFFFFF" size={24} />
            </Pressable>
          )}

          {/* Next Page / Finish */}
          {currentPageIndex < pages.length - 1 ? (
            <Pressable
              onPress={() => setCurrentPageIndex(currentPageIndex + 1)}
              className="bg-violet-600 py-3.5 px-6 rounded-2xl border-b-4 border-violet-850 flex-row items-center active:scale-95"
            >
              <Text className="text-white font-black text-sm font-quicksand mr-1">Tiếp Theo</Text>
              <ArrowRight color="#FFFFFF" size={16} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.back()}
              className="bg-emerald-600 py-3.5 px-6 rounded-2xl border-b-4 border-emerald-850 flex-row items-center active:scale-95"
            >
              <Text className="text-white font-black text-sm font-quicksand mr-1">Hoàn Thành 🎉</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // RENDER VOCABULARY TYPE
  if (lesson.type === "VOCABULARY") {
    const vocabs = VOCAB_DATA[lessonId] || VOCAB_DATA[101];
    const currentVocab = vocabs[vocabIndex];

    return (
      <View className="flex-1 bg-[#FAF8F5] pt-14 flex-col justify-between">
        {/* Header */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className="bg-white p-3 rounded-full border-2 border-slate-100 shadow-sm active:scale-90"
          >
            <ArrowLeft color="#1E293B" size={20} />
          </Pressable>
          <Text className="text-sm font-black text-slate-500 font-fredoka flex-1 text-center mr-8">
            Thẻ {vocabIndex + 1} / {vocabs.length}
          </Text>
        </View>

        {/* Flashcard Area */}
        <View className="flex-1 justify-center items-center px-6">
          <Pressable onPress={handleFlipCard} className="w-full h-80 relative">
            {/* Front Card */}
            <Animated.View 
              style={[frontAnimatedStyle]}
              className={`absolute w-full h-full bg-white border-2 border-emerald-100 rounded-[32px] p-6 shadow-lg justify-center items-center backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}
            >
              <Languages color="#10B981" size={40} className="mb-4" />
              <Text className="text-slate-400 text-xs font-black uppercase tracking-wider font-quicksand">
                Nhấp vào thẻ để dịch nghĩa 🇻🇳
              </Text>
              <Text className="text-5xl font-black text-slate-800 font-fredoka mt-2">
                {currentVocab.word}
              </Text>
              <Text className="text-slate-500 text-base font-bold italic mt-2 font-quicksand">
                {currentVocab.ipa}
              </Text>
              <Text className="text-slate-400 text-sm font-bold text-center mt-6 px-4 font-quicksand leading-5">
                "{currentVocab.definition}"
              </Text>
            </Animated.View>

            {/* Back Card */}
            <Animated.View 
              style={[backAnimatedStyle]}
              className={`absolute w-full h-full bg-emerald-50 border-2 border-emerald-250 rounded-[32px] p-6 shadow-lg justify-center items-center backface-hidden ${!isFlipped ? 'pointer-events-none' : ''}`}
            >
              <Languages color="#047857" size={40} className="mb-4" />
              <Text className="text-emerald-700 text-xs font-black uppercase tracking-wider font-quicksand">
                Nghĩa Việt Ngữ
              </Text>
              <Text className="text-4xl font-black text-emerald-950 font-fredoka mt-2">
                {currentVocab.vietnamese}
              </Text>
              
              <View className="bg-white px-4 py-3 rounded-2xl border border-emerald-150 mt-6 w-full">
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest font-quicksand">
                  Ví dụ / Example:
                </Text>
                <Text className="text-slate-800 font-black text-sm mt-1 font-quicksand leading-5">
                  {currentVocab.example}
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="px-6 pb-12 pt-4 items-center">
          <Pressable
            onPress={nextVocab}
            className="bg-emerald-600 py-4 px-10 rounded-2xl border-b-4 border-emerald-850 flex-row items-center active:scale-95"
          >
            <Text className="text-white font-black text-base font-quicksand mr-2">
              {vocabIndex < vocabs.length - 1 ? "Từ Tiếp Theo" : "Hoàn Thành 🎉"}
            </Text>
            <ArrowRight color="#FFFFFF" size={18} />
          </Pressable>
        </View>
      </View>
    );
  }

  // RENDER GAME/QUIZ TYPE
  if (lesson.type === "GAME") {
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    const currentQuiz = quizzes[quizIndex];

    if (showGameResults) {
      return (
        <View className="flex-1 bg-[#FAF8F5] pt-14 justify-between px-6">
          <View />
          <View className="items-center">
            <View className="w-24 h-24 bg-amber-100 rounded-full border-2 border-amber-300 justify-center items-center mb-6 shadow-sm">
              <Award color="#D97706" size={50} fill="#F59E0B" />
            </View>
            <Text className="text-3xl font-black text-slate-850 font-fredoka text-center leading-8">
              Bé Học Xong Rồi!
            </Text>
            <Text className="text-slate-500 font-bold text-base text-center mt-2 font-quicksand leading-5 px-6">
              Bé đã xuất sắc đạt được {score} / {quizzes.length} điểm chính xác!
            </Text>

            {/* Stars reward block */}
            <View className="bg-amber-50 border border-amber-200 px-6 py-4 rounded-[24px] flex-row items-center mt-6">
              <Star color="#F59E0B" fill="#F59E0B" size={24} />
              <Text className="text-amber-950 font-black text-xl font-fredoka ml-2">
                +{score * 5} Ngôi Sao ⭐
              </Text>
            </View>
          </View>

          <View className="pb-12 flex-row justify-center gap-4">
            <Pressable
              onPress={restartQuiz}
              className="bg-white border-2 border-slate-200 py-4 px-6 rounded-2xl border-b-4 flex-row items-center active:scale-95"
            >
              <RefreshCw color="#475569" size={16} />
              <Text className="text-slate-700 font-black text-sm font-quicksand ml-2">Chơi Lại</Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="bg-violet-600 py-4 px-8 rounded-2xl border-b-4 border-violet-850 flex-row items-center active:scale-95"
            >
              <Text className="text-white font-black text-sm font-quicksand">Bản Đồ Học 🗺️</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-[#FAF8F5] pt-14 flex-col justify-between">
        {/* Header */}
        <View className="px-6 flex-row items-center justify-between">
          <Pressable 
            onPress={() => router.back()}
            className="bg-white p-3 rounded-full border-2 border-slate-100 shadow-sm active:scale-90"
          >
            <ArrowLeft color="#1E293B" size={20} />
          </Pressable>
          <Text className="text-sm font-black text-slate-500 font-fredoka flex-1 text-center mr-8">
            Câu {quizIndex + 1} / {quizzes.length}
          </Text>
        </View>

        {/* Quiz panel */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}>
          <PremiumCard 
            glowColor="#FCD34D"
            className="border-amber-200 p-5 bg-white rounded-[28px] shadow-sm mb-6"
          >
            <View className="flex-row items-center mb-3">
              <HelpCircle color="#D97706" size={20} />
              <Text className="text-amber-800 text-xs font-black ml-1.5 uppercase font-quicksand">
                Câu Hỏi Trắc Nghiệm
              </Text>
            </View>
            <Text className="text-xl font-black text-slate-800 font-fredoka leading-6">
              {currentQuiz.question}
            </Text>
          </PremiumCard>

          {/* Options */}
          {currentQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = currentQuiz.answerIndex === idx;

            let borderClass = "border-slate-100";
            let bgClass = "bg-white";
            let textClass = "text-slate-700";

            if (isAnswered) {
              if (isCorrect) {
                borderClass = "border-emerald-300";
                bgClass = "bg-emerald-50";
                textClass = "text-emerald-950";
              } else if (isSelected) {
                borderClass = "border-rose-300";
                bgClass = "bg-rose-50";
                textClass = "text-rose-950";
              }
            } else if (isSelected) {
              borderClass = "border-amber-300 bg-amber-50";
            }

            return (
              <Pressable
                key={idx}
                disabled={isAnswered}
                onPress={() => handleSelectOption(idx)}
                className={`border-2 rounded-2xl p-4.5 mb-4 flex-row items-center shadow-sm active:scale-98 ${borderClass} ${bgClass}`}
              >
                <View className={`w-8 h-8 rounded-xl items-center justify-center border-b-2 mr-3 ${isSelected ? 'bg-amber-500 border-amber-600' : 'bg-slate-100 border-slate-200'}`}>
                  <Text className={`font-black font-fredoka ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text className={`text-base font-black font-quicksand flex-1 ${textClass}`}>
                  {option}
                </Text>
                {isAnswered && isCorrect && (
                  <CheckCircle2 color="#10B981" size={20} fill="#E6F4EA" />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Footer action bar */}
        <View className="px-6 pb-12 pt-4 items-center">
          {!isAnswered ? (
            <Pressable
              disabled={selectedOption === null}
              onPress={checkAnswer}
              className={`py-4 px-10 rounded-2xl border-b-4 flex-row items-center ${selectedOption === null ? 'bg-slate-100 border-slate-200 opacity-55' : 'bg-amber-500 border-amber-700 active:scale-95'}`}
            >
              <Text className={`font-black text-base font-quicksand ${selectedOption === null ? 'text-slate-400' : 'text-white'}`}>
                Kiểm Tra Đáp Án
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={nextQuiz}
              className="bg-violet-600 py-4 px-10 rounded-2xl border-b-4 border-violet-850 flex-row items-center active:scale-95"
            >
              <Text className="text-white font-black text-base font-quicksand mr-2">Tiếp Tục</Text>
              <ArrowRight color="#FFFFFF" size={18} />
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return null;
}
