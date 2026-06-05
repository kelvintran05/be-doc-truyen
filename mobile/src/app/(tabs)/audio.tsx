import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, Pressable, ScrollView, Alert, Animated, Easing, useColorScheme } from "react-native";
import { useStoriesList } from "../../features/stories/stories.hooks";
import { Audio } from "expo-av";
import { Headset, Play, Pause, Square, Music, Sparkles, Disc } from "lucide-react-native";
import { ENV } from "../../core/config/env";
import { PremiumCard } from "../../components/PremiumCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AudiobooksScreen() {
  const { data, isLoading } = useStoriesList(10);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<string>("00:00");
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Vinyl Rotation Animation
  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const rotationLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (playingId !== null) {
      // Start spinning
      spinAnim.setValue(0);
      rotationLoop.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      );
      rotationLoop.current.start();
    } else {
      // Stop spinning
      if (rotationLoop.current) {
        rotationLoop.current.stop();
      }
      spinAnim.setValue(0);
    }
  }, [playingId]);

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
      </View>
    );
  }

  const stories = data?.pages.flatMap((page) => page.stories) || [];
  const audioStories = stories.filter((story) => story.audio);

  // Play audio narration
  const togglePlayAudio = async (storyId: number, audioUrl: string) => {
    try {
      if (playingId === storyId && soundRef.current) {
        // Pause sound
        await soundRef.current.pauseAsync();
        setPlayingId(null);
        return;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setPlayingId(storyId);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            const currentSec = Math.floor(status.positionMillis / 1000);
            const totalSec = Math.floor(status.durationMillis ? status.durationMillis / 1000 : 0);
            
            const formatTime = (secs: number) => {
              const m = Math.floor(secs / 60);
              const s = secs % 60;
              return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
            };
            
            setPlaybackStatus(`${formatTime(currentSec)} / ${formatTime(totalSec)}`);

            if (status.didJustFinish) {
              setPlayingId(null);
              setPlaybackStatus("00:00");
            }
          }
        }
      );

      soundRef.current = newSound;
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi kết nối", "Không thể liên kết luồng âm thanh. Đang chạy giả lập phát...");
      
      // Standalone simulation for offline preview
      setPlayingId(storyId);
      let count = 0;
      const interval = setInterval(() => {
        if (playingId === storyId) {
          count++;
          setPlaybackStatus(`00:${count < 10 ? "0" + count : count} / 01:20`);
          if (count >= 80) {
            clearInterval(interval);
            setPlayingId(null);
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
    setPlayingId(null);
    setPlaybackStatus("00:00");
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#FAF8F5] dark:bg-[#0C0A10] px-6">
      {/* Header */}
      <View className="mb-5 mt-4">
        <Text className="text-xs font-black text-violet-500 uppercase tracking-widest">
          Phòng Nghe Sách Nói 📻
        </Text>
        <Text className="text-3xl font-black text-slate-800 dark:text-white mt-1">
          Vương Quốc Âm Thanh 🎧
        </Text>
      </View>

      {/* Hero Visual Audio Deck: NhacCuaTui inspired glossy gradient console */}
      <View 
        className="bg-violet-950 dark:bg-slate-900 rounded-[36px] p-6 mb-6 shadow-2xl relative overflow-hidden border-b-8 border-violet-900"
        style={{ borderBottomColor: "#4C1D95" }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[10px] font-black text-violet-200 uppercase tracking-widest bg-violet-800/60 px-3.5 py-1.5 rounded-full">
            NGHE THỬ GIỌNG ĐỌC AI VBEE 🌟
          </Text>
          <Sparkles color="#FBBF24" size={18} />
        </View>

        {/* Rotator Ring Deck */}
        <View className="flex-row items-center mb-5">
          <View className="relative bg-violet-900/40 p-1.5 rounded-full border border-violet-500/25">
            <Animated.View 
              style={{ transform: [{ rotate: spinRotation }] }}
              className="bg-violet-950 p-4 rounded-full border-4 border-violet-400"
            >
              <Disc color="#F472B6" size={44} />
            </Animated.View>
            <View className="absolute top-[28] left-[28] bg-violet-200 w-4 h-4 rounded-full border-2 border-violet-950 shadow-sm" />
          </View>

          <View className="flex-1 ml-4">
            <Text className="text-2xl font-black text-white" numberOfLines={1}>
              Sự Tích Hồ Gươm
            </Text>
            <Text className="text-xs text-violet-300 font-bold mt-0.5">
              Giọng đọc: Vbee Viral ngọt ngào 🎙️
            </Text>
            {playingId === 8 ? (
              <Text className="text-pink-300 text-sm font-black mt-2 tracking-wider">
                🎵 {playbackStatus}
              </Text>
            ) : (
              <Text className="text-violet-300/80 text-xs font-semibold mt-2">
                Trạng thái: Sẵn sàng phát thử
              </Text>
            )}
          </View>
        </View>

        {/* Play Control ribbon */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => togglePlayAudio(8, `${ENV.API_URL}/cdn/audio/stories_e5b08a24-d8c6-4d0d-ad3a-cf213509936d_audio_page-1-vi.wav`)}
            className="flex-1 bg-white rounded-2xl py-3.5 flex-row justify-center items-center border-b-4 border-slate-200 active:scale-95 active:border-b-0 active:translate-y-1"
          >
            {playingId === 8 ? (
              <>
                <Pause color="#7C3AED" fill="#7C3AED" size={20} />
                <Text className="text-violet-750 font-black text-sm ml-2">Tạm Dừng</Text>
              </>
            ) : (
              <>
                <Play color="#7C3AED" fill="#7C3AED" size={20} />
                <Text className="text-violet-750 font-black text-sm ml-2">Nghe Thử Ngay</Text>
              </>
            )}
          </Pressable>

          {playingId === 8 && (
            <Pressable
              onPress={stopAudio}
              className="bg-red-500 rounded-2xl px-5 py-3.5 items-center justify-center border-b-4 border-red-750 active:scale-95 active:border-b-0 active:translate-y-1"
            >
              <Square color="#FFFFFF" fill="#FFFFFF" size={16} />
            </Pressable>
          )}
        </View>
      </View>

      <Text className="text-xl font-black text-slate-800 dark:text-white mb-4">
        Kho sách nói của bé 📻
      </Text>

      {/* Audio Stories List */}
      <FlatList
        data={audioStories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => {
          let parsedPages = [];
          try {
            parsedPages = typeof item.pages === "string" ? JSON.parse(item.pages) : (item.pages || []);
          } catch (e) {
            console.warn("JSON parsing error on Sách Nói pages:", e);
          }
          const firstPageAudio = parsedPages?.[0]?.audioUrl || `${ENV.API_URL}/cdn/audio/stories_e5b08a24-d8c6-4d0d-ad3a-cf213509936d_audio_page-1-vi.wav`;
          const isItemPlaying = playingId === item.id;

          return (
            <PremiumCard 
              glowColor={isItemPlaying ? "#C084FC" : undefined}
              className={`p-3.5 mb-4 flex-row items-center border border-violet-100/50 dark:border-slate-800/80 ${isItemPlaying ? "bg-violet-50/40 border-violet-250" : ""}`}
            >
              <Image
                source={{ uri: item.coverImageUrl }}
                className="w-16 h-16 rounded-2xl mr-4 border border-slate-100 dark:border-slate-800"
              />
              <View className="flex-1 mr-2">
                <Text className="text-base font-black text-slate-800 dark:text-white leading-5">
                  {item.title}
                </Text>
                <Text className="text-xs text-slate-400 font-semibold mt-1">
                  ⏱️ {item.duration} • Tác giả: {item.author}
                </Text>
              </View>

              <Pressable
                onPress={() => togglePlayAudio(item.id, firstPageAudio)}
                className={`rounded-2xl p-3.5 border-b-4 active:scale-90 active:border-b-0 active:translate-y-0.5 ${isItemPlaying ? "bg-red-500 border-red-750" : "bg-violet-100 dark:bg-violet-900/40 border-violet-250 dark:border-violet-950"}`}
              >
                {isItemPlaying ? (
                  <Pause color={isItemPlaying ? "#FFFFFF" : "#8B5CF6"} fill={isItemPlaying ? "#FFFFFF" : "#8B5CF6"} size={16} />
                ) : (
                  <Play color="#8B5CF6" fill="#8B5CF6" size={16} />
                )}
              </Pressable>
            </PremiumCard>
          );
        }}
      />
    </View>
  );
}
