import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Pressable, ScrollView, Alert, Dimensions, useColorScheme, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStory } from "../../features/stories/stories.hooks";
import { Audio } from "expo-av";
import { ArrowLeft, BookOpen, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react-native";
import { ENV } from "../../core/config/env";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const storyId = parseInt(Array.isArray(id) ? id[0] : id, 10);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const { data: story, isLoading, error } = useStory(storyId);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Audio state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE] dark:bg-[#0F0D15]">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-violet-600 dark:text-violet-400 mt-5 font-black text-xl text-center px-6">
          🪄 Đang mở cuốn sách thần kỳ...
        </Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE] dark:bg-[#0F0D15] p-6">
        <Text className="text-red-500 font-black text-2xl mb-4 text-center">Bé ơi, quyển sách này bị lạc mất rồi! 😢</Text>
        <Pressable 
          onPress={() => router.back()} 
          className="bg-violet-500 px-8 py-4 rounded-3xl border-b-8 border-violet-755 active:scale-95 active:border-b-2"
        >
          <Text className="text-white font-black text-lg">Quay lại xứ sở cổ tích 🏰</Text>
        </Pressable>
      </View>
    );
  }

  let pages = [];
  try {
    pages = typeof story.pages === "string" ? JSON.parse(story.pages) : (story.pages || []);
  } catch (e) {
    console.warn("JSON parsing error on story details pages:", e);
  }
  const activePage = pages[currentPage];

  console.log(`[StoryReader] Opened story ${storyId} (${pages.length} pages). Active page ${currentPage} image:`, activePage?.image);

  // Start playing audio for a specific page index
  const startAudio = async (pageIndex: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setIsPlaying(true);
      const page = pages[pageIndex];
      const audioUrl = page?.audioUrl || `${ENV.API_URL}/cdn/audio/stories_e5b08a24-d8c6-4d0d-ad3a-cf213509936d_audio_page-1-vi.wav`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            // Audio completed playing!
            if (pageIndex < pages.length - 1) {
              const nextIndex = pageIndex + 1;
              setCurrentPage(nextIndex);
              startAudio(nextIndex);
            } else {
              setIsPlaying(false);
            }
          }
        }
      );
      soundRef.current = newSound;
    } catch (e) {
      console.error("Autoplay audio error:", e);
      setIsPlaying(false);
    }
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setIsPlaying(false);
    } catch (e) {
      console.error("Pause audio error:", e);
    }
  };

  const togglePlayAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      startAudio(currentPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      const nextIndex = currentPage + 1;
      setCurrentPage(nextIndex);
      if (isPlaying) {
        startAudio(nextIndex);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevIndex = currentPage - 1;
      setCurrentPage(prevIndex);
      if (isPlaying) {
        startAudio(prevIndex);
      }
    }
  };

  const handleReset = () => {
    setCurrentPage(0);
    if (isPlaying) {
      startAudio(0);
    } else {
      if (soundRef.current) {
        soundRef.current.stopAsync();
      }
      setIsPlaying(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF8F5] dark:bg-[#0C0A10]">
      {/* Top Glossy Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-6 pb-3 flex-row justify-between items-center z-10">
        <Pressable
          onPress={() => router.back()}
          className="bg-white dark:bg-slate-800 p-3.5 rounded-full shadow-md border-b-4 border-slate-200 dark:border-slate-950 active:scale-95 active:border-b-0 active:translate-y-1"
        >
          <ArrowLeft color="#7C3AED" size={24} />
        </Pressable>
        
        <View className="bg-[#FAF2DF] dark:bg-slate-900 px-5 py-2.5 rounded-[20px] border-2 border-[#FFEFA6] dark:border-slate-800 shadow-sm max-w-[50%]">
          <Text className="text-[10px] font-black text-amber-800 dark:text-violet-400 text-center uppercase tracking-wider">
            ✨ SÁCH TRUYỆN MÀU
          </Text>
          <Text className="text-sm font-black text-slate-800 dark:text-white text-center mt-0.5" numberOfLines={1}>
            {story.title}
          </Text>
        </View>

        <Pressable
          onPress={togglePlayAudio}
          className={`p-3.5 rounded-full shadow-md border-b-6 active:scale-95 active:border-b-0 active:translate-y-1 ${
            isPlaying ? "bg-red-500 border-red-700" : "bg-violet-500 border-violet-750"
          }`}
        >
          {isPlaying ? (
            <VolumeX color="#FFFFFF" size={24} />
          ) : (
            <Volume2 color="#FFFFFF" size={24} />
          )}
        </Pressable>
      </View>

      {/* Main Book Reader Frame */}
      <View className="flex-1 px-6 py-2">
        <View className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border-4 border-violet-100/50 dark:border-slate-850 flex-1 flex-col overflow-hidden">
          
          {/* Main Page Illustration using expo-image */}
          <View className="relative w-full h-[45%] bg-slate-100/30 border-b-2 border-slate-100 dark:border-slate-850">
            <Image
              source={{ uri: activePage?.image || story.coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Cute page ribbon decoration */}
            <View className="absolute top-0 left-5 bg-amber-400 px-4 py-2 rounded-b-2xl shadow">
              <Text className="text-white text-xs font-black">🌟 TRANG {currentPage + 1}</Text>
            </View>
          </View>

          {/* Page Text Area */}
          <ScrollView 
            className="p-5 flex-1" 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="flex-row items-center mb-2.5">
              <BookOpen color="#8B5CF6" size={16} />
              <Text className="text-violet-600 dark:text-violet-400 text-xs font-black ml-2 uppercase tracking-widest">
                ĐỌC CÙNG BÉ YÊU • {currentPage + 1} / {pages.length}
              </Text>
            </View>
            
            {/* Warm Paper-style background for reading ease */}
            <View className="bg-[#FFFDF6] dark:bg-slate-950 p-5 rounded-[24px] border border-violet-100/50 dark:border-slate-800 shadow-inner">
              <Text 
                className="text-lg font-bold leading-8 text-slate-700 dark:text-slate-200"
              >
                {activePage?.text || "Chuyện xưa kể rằng..."}
              </Text>
            </View>

            {/* Moral Lesson gold card on the last page */}
            {currentPage === pages.length - 1 && (
              <View className="bg-[#FFFDF2] dark:bg-slate-900/60 p-5 rounded-[24px] border-2 border-amber-300 dark:border-amber-900 mt-4 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <Sparkles color="#D97706" size={18} />
                  <Text className="text-amber-800 dark:text-amber-300 font-black text-xs ml-2 tracking-wider uppercase">
                    🌟 BÀI HỌC DÀNH CHO BÉ YÊU
                  </Text>
                </View>
                <Text className="text-sm font-bold text-amber-950 dark:text-slate-200 italic leading-6">
                  {story.moral}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Progress Page Dots indicator */}
      <View className="flex-row justify-center items-center py-2 px-6">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          {pages.map((_: any, index: number) => (
            <View 
              key={index} 
              className={`h-2.5 rounded-full mx-1 transition-all ${
                index === currentPage 
                  ? "w-6 bg-violet-600" 
                  : "w-2.5 bg-violet-200 dark:bg-slate-800"
              }`} 
            />
          ))}
        </ScrollView>
      </View>

      {/* Reader controls at the bottom */}
      <View style={{ paddingBottom: Math.max(insets.bottom + 12, 24) }} className="pt-1 px-6 flex-row justify-between items-center">
        {/* Previous page button */}
        <Pressable
          onPress={handlePrevPage}
          disabled={currentPage === 0}
          className={`flex-row items-center px-6 py-4 rounded-[22px] border-b-6 active:scale-95 active:border-b-0 active:translate-y-1 ${
            currentPage === 0 
              ? "bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-900 opacity-20" 
              : "bg-[#FFCCE1] border-pink-300 dark:bg-pink-950 dark:border-pink-900"
          }`}
          style={currentPage > 0 ? { borderBottomColor: "#F472B6" } : undefined}
        >
          <ChevronLeft color={currentPage === 0 ? "#94A3B8" : "#EC4899"} size={22} />
          <Text className={`font-black text-sm ml-1 ${
            currentPage === 0 ? "text-slate-400" : "text-[#D01C6A] dark:text-pink-200"
          }`}>
            Trang Trước
          </Text>
        </Pressable>

        {/* Reset button: show only if we have progressed */}
        {currentPage > 0 && (
          <Pressable
            onPress={handleReset}
            className="bg-[#ECE9F2] dark:bg-slate-850 p-3.5 rounded-full border-b-4 border-slate-300 dark:border-slate-950 active:scale-95 active:border-b-0 active:translate-y-1"
          >
            <RotateCcw color="#6D28D9" size={18} />
          </Pressable>
        )}

        {/* Next page / Finish button */}
        <Pressable
          onPress={handleNextPage}
          disabled={currentPage === pages.length - 1}
          className={`flex-row items-center px-7 py-4 rounded-[22px] border-b-6 active:scale-95 active:border-b-0 active:translate-y-1 ${
            currentPage === pages.length - 1 
              ? "bg-[#FFE699] border-amber-300 dark:bg-[#2F291B] dark:border-amber-950" 
              : "bg-[#B5F2CA] border-emerald-400"
          }`}
          style={currentPage < pages.length - 1 ? { borderBottomColor: "#34D399" } : { borderBottomColor: "#FBBF24" }}
        >
          <Text className={`font-black text-sm mr-1 ${
            currentPage === pages.length - 1 ? "text-[#A75D00] dark:text-amber-300" : "text-[#046C4E]"
          }`}>
            {currentPage === pages.length - 1 ? "🎉 Hết Truyện" : "Trang Tiếp"}
          </Text>
          {currentPage < pages.length - 1 && (
            <ChevronRight color="#046C4E" size={22} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
