import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, Pressable, TextInput, RefreshControl, ScrollView, useColorScheme } from "react-native";
import { useStoriesList } from "../../features/stories/stories.hooks";
import { router } from "expo-router";
import { Search, Sparkles, BookOpen, Star, ArrowRight, Heart, Flame, Clock } from "lucide-react-native";
import { PremiumCard } from "../../components/PremiumCard";

export default function HomeScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useStoriesList(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE] dark:bg-[#0F0D15]">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-violet-600 dark:text-violet-400 mt-5 font-black text-xl text-center px-6 leading-8 font-quicksand">
          🪄 Đang mở rương sách cổ tích nhiệm màu...
        </Text>
      </View>
    );
  }

  const getDisplayCategory = (storyCategory: string | undefined): string => {
    if (!storyCategory) return "Khác";
    const cat = storyCategory.toLowerCase();
    if (cat.includes("cổ tích") || cat.includes("fantasy") || cat.includes("fairy")) return "Cổ Tích";
    if (cat.includes("giáo dục") || cat.includes("learning") || cat.includes("educational") || cat.includes("ngụ ngôn")) return "Bài Học";
    if (cat.includes("lịch sử") || cat.includes("history")) return "Lịch Sử";
    if (cat.includes("động vật") || cat.includes("animals") || cat.includes("animal")) return "Động Vật";
    if (cat.includes("family") || cat.includes("tình bạn") || cat.includes("thiếu nhi") || cat.includes("hài hước") || cat.includes("đời sống")) return "Đời Sống";
    if (cat.includes("phiêu lưu") || cat.includes("adventure")) return "Phiêu Lưu";
    return storyCategory;
  };

  const stories = data?.pages.flatMap((page) => page.stories) || [];

  // Filtered stories for search queries
  const filteredStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           story.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Featured and Hot stories slices (only when search query is empty)
  const featuredStory = stories.length > 0 ? stories[0] : null;
  const newStories = stories.length > 1 ? stories.slice(1, 4) : [];
  const feedStories = searchQuery ? filteredStories : stories.slice(2);

  const renderHeader = () => {
    if (searchQuery) return null; // Hide sections during search

    return (
      <View className="mb-4">
        {/* English Course Promo Card */}
        <Pressable
          onPress={() => router.push("/courses")}
          className="mb-8 active:scale-98"
        >
          <PremiumCard
            glowColor="#A78BFA"
            className="border-violet-100/50 dark:border-slate-800/80 p-5 bg-violet-100 dark:bg-violet-950/30 rounded-[32px] flex-row items-center justify-between"
          >
            <View className="flex-1 mr-4">
              <View className="flex-row items-center mb-1.5">
                <Sparkles color="#8B5CF6" size={16} fill="#A78BFA" />
                <Text className="text-violet-750 dark:text-violet-400 text-[10px] font-black uppercase tracking-wider ml-1.5 font-quicksand">
                  Học Tiếng Anh Hay 🇬🇧
                </Text>
              </View>
              <Text className="text-xl font-black text-slate-850 dark:text-white font-fredoka leading-6 mb-1">
                English For Kids! 🦄
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs font-bold font-quicksand leading-4" numberOfLines={2}>
                Chinh phục từ vựng và bài đọc với giọng đọc Mỹ chuẩn từ Vbee cùng game tương tác vui nhộn!
              </Text>
            </View>
            <View className="bg-violet-600 py-3.5 px-4.5 rounded-2xl border-b-4 border-violet-850">
              <Text className="text-white font-black text-xs font-quicksand">Bắt Đầu</Text>
            </View>
          </PremiumCard>
        </Pressable>

        {/* Featured Story Section */}
        {featuredStory && (
          <View className="mb-8">
            <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Truyện Nổi Bật Nhất 🌟
            </Text>
            <Pressable 
              onPress={() => router.push(`/story/${featuredStory.id}`)}
              className="active:scale-98"
            >
              <PremiumCard 
                glowColor="#EC4899"
                className="border-violet-100/50 dark:border-slate-800/80 p-0 overflow-hidden rounded-[32px] bg-white dark:bg-slate-900/90"
              >
                <View className="relative">
                  <Image
                    source={{ uri: featuredStory.coverImageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e" }}
                    className="w-full h-56"
                    resizeMode="cover"
                  />
                  <View className="absolute top-4 left-4 bg-rose-600 px-3.5 py-1.5 rounded-full flex-row items-center">
                    <Sparkles color="#FFFFFF" size={12} />
                    <Text className="text-white text-[10px] font-black uppercase ml-1">Đọc Nhiều Nhất</Text>
                  </View>
                  <View className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full flex-row items-center">
                    <Clock color="#FFFFFF" size={12} />
                    <Text className="text-white text-xs font-black ml-1">{featuredStory.duration}</Text>
                  </View>
                </View>
                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-2xl font-black text-slate-850 dark:text-white flex-1 mr-2" numberOfLines={1}>
                      {featuredStory.title}
                    </Text>
                    <View className="flex-row items-center bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/50">
                      <Star color="#F59E0B" fill="#F59E0B" size={11} />
                      <Text className="text-amber-800 dark:text-amber-300 text-xs font-black ml-1">{featuredStory.rating}</Text>
                    </View>
                  </View>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-5 mb-4" numberOfLines={2}>
                    {featuredStory.description}
                  </Text>
                  <View className="flex-row items-center justify-between border-t border-slate-50 dark:border-slate-850/50 pt-4">
                    <Text className="text-xs font-black text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-full">
                      {getDisplayCategory(featuredStory.category)} • Tuổi: {featuredStory.age}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-violet-600 dark:text-violet-400 font-black text-sm mr-1">Đọc Ngay</Text>
                      <ArrowRight color={isDark ? "#A78BFA" : "#7C3AED"} size={16} />
                    </View>
                  </View>
                </View>
              </PremiumCard>
            </Pressable>
          </View>
        )}

        {/* New Stories Horizontal Scroll */}
        {newStories.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Truyện Mới Cập Nhật 🔥
              </Text>
              <Text className="text-xs font-black text-violet-500">Xem tất cả</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {newStories.map((story) => {
                const cardGlow = 
                  getDisplayCategory(story.category) === "Cổ Tích" ? "#FDA4AF" :
                  getDisplayCategory(story.category) === "Bài Học" ? "#FCD34D" :
                  "#7DD3FC";
                return (
                  <Pressable
                    key={story.id}
                    onPress={() => router.push(`/story/${story.id}`)}
                    className="mr-4 active:scale-98"
                  >
                    <PremiumCard 
                      glowColor={cardGlow}
                      className="w-64 p-0 overflow-hidden border-violet-100/40 dark:border-slate-800/80 bg-white dark:bg-slate-900/90"
                    >
                      <Image
                        source={{ uri: story.coverImageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e" }}
                        className="w-full h-36"
                        resizeMode="cover"
                      />
                      <View className="p-4">
                        <Text className="text-base font-black text-slate-850 dark:text-white mb-1" numberOfLines={1}>
                          {story.title}
                        </Text>
                        <Text className="text-slate-400 text-xs font-bold mb-3" numberOfLines={1}>
                          ⏱️ {story.duration} • {getDisplayCategory(story.category)}
                        </Text>
                        <View className="flex-row justify-between items-center border-t border-slate-50 dark:border-slate-850/50 pt-2.5">
                          <Text className="text-[10px] font-black text-violet-500 bg-violet-50 dark:bg-violet-950/30 px-2.5 py-1 rounded-full">
                            Tuổi: {story.age}
                          </Text>
                          <ArrowRight color={isDark ? "#A78BFA" : "#7C3AED"} size={14} />
                        </View>
                      </View>
                    </PremiumCard>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Section Title for Feed list */}
        <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Tất Cả Sách Truyện Cổ Tích 📚
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#FAF8F5] dark:bg-[#0C0A10] pt-14">
      {/* Premium Header */}
      <View className="px-6 mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-xs font-black text-violet-500 dark:text-violet-400 uppercase tracking-widest">
            BéĐọc App v2.5 🦄
          </Text>
          <Text className="text-3xl font-black text-slate-800 dark:text-white mt-1">
            Chào bé yêu! 👋
          </Text>
          <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            Hôm nay mình đọc gì thế nhỉ? 🌟
          </Text>
        </View>
        <Pressable className="bg-amber-100 dark:bg-amber-950/40 p-3 rounded-full border-2 border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-250 active:scale-90">
          <Sparkles color="#D97706" size={24} />
        </Pressable>
      </View>

      {/* Glossy Search Input Bar */}
      <View className="px-6 mb-5">
        <View className="bg-white dark:bg-slate-900/90 rounded-[28px] flex-row items-center px-5 py-4 shadow-xl shadow-slate-100 dark:shadow-none border-2 border-violet-100/60 dark:border-slate-800">
          <Search color="#8B5CF6" size={22} />
          <TextInput
            placeholder="Tìm kiếm truyện tranh bách khoa..."
            placeholderTextColor={isDark ? "#4B5563" : "#C084FC"}
            className="flex-1 text-slate-800 dark:text-white font-bold ml-3 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stories Grid */}
      <FlatList
        data={feedStories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#8B5CF6"]} />
        }
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => {
          const isFavorite = favorites.includes(item.id);
          const displayCat = getDisplayCategory(item.category);
          
          const cardGlow = 
            displayCat === "Cổ Tích" ? "#FDA4AF" :
            displayCat === "Bài Học" ? "#FCD34D" :
            displayCat === "Động Vật" ? "#A7F3D0" :
            displayCat === "Lịch Sử" ? "#FCA5A5" :
            displayCat === "Đời Sống" ? "#FBCFE8" :
            "#7DD3FC";

          const badgeBg = 
            displayCat === "Cổ Tích" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" :
            displayCat === "Bài Học" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" :
            displayCat === "Động Vật" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" :
            displayCat === "Lịch Sử" ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300" :
            displayCat === "Đời Sống" ? "bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300" :
            "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300";

          return (
            <PremiumCard 
              glowColor={cardGlow}
              className="border-violet-100/50 dark:border-slate-800/80 p-4.5 mb-5 overflow-hidden"
            >
              {/* Cover Image & Favorite Badge */}
              <View className="relative mb-4">
                <Image
                  source={{ uri: item.coverImageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e" }}
                  className="w-full h-48 rounded-[24px] border border-slate-100 dark:border-slate-800"
                  resizeMode="cover"
                />
                
                {/* Favorite Heart Button */}
                <Pressable
                  onPress={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 p-3 rounded-full shadow-md active:scale-90"
                >
                  <Heart
                    color="#EF4444"
                    fill={isFavorite ? "#EF4444" : "none"}
                    size={18}
                  />
                </Pressable>

                {/* Duration Badge */}
                <View className="absolute bottom-3 left-3 bg-black/50 px-3 py-1.5 rounded-full">
                  <Text className="text-white text-xs font-black font-quicksand">
                    ⏱️ {item.duration}
                  </Text>
                </View>
              </View>

              {/* Title & Info */}
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                  <Text className="text-2xl font-black text-slate-800 dark:text-white leading-7" numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                
                {/* Rating */}
                <View className="flex-row items-center bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-900">
                  <Star color="#F59E0B" fill="#F59E0B" size={13} />
                  <Text className="text-amber-800 dark:text-amber-300 text-xs font-black ml-1">
                    {item.rating}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 leading-5" numberOfLines={2}>
                {item.description}
              </Text>

              {/* Action Toolbar */}
              <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-4">
                <Text className={`text-xs font-black px-3.5 py-2 rounded-full ${badgeBg}`}>
                  {displayCat} • Tuổi: {item.age}
                </Text>
                
                <Pressable 
                  onPress={() => router.push(`/story/${item.id}`)}
                  className="bg-violet-600 hover:bg-violet-750 py-3 px-5 rounded-2xl flex-row items-center border-b-4 border-violet-850 active:scale-95 active:translate-y-0.5 active:border-b-0"
                >
                  <Text className="text-white font-black text-sm mr-1.5">Đọc Ngay</Text>
                  <ArrowRight color="#FFFFFF" size={16} />
                </Pressable>
              </View>
            </PremiumCard>
          );
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-slate-400 dark:text-slate-500 font-bold text-center">
              Không tìm thấy truyện nào phù hợp rồi bé ơi 😢
            </Text>
          </View>
        }
      />
    </View>
  );
}
