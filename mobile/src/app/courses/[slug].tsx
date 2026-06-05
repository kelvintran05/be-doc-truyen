import React from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCourseDetail } from "../../features/courses/courses.hooks";
import { ArrowLeft, BookOpen, Gamepad2, Languages, Lock, Play, Star, Trophy, Sparkles } from "lucide-react-native";
import { PremiumCard } from "../../components/PremiumCard";

export default function CourseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: course, isLoading, error } = useCourseDetail(slug || "");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE]">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-violet-600 mt-5 font-black text-lg text-center px-6 leading-8 font-quicksand">
          ✨ Đang mở bản đồ phiêu lưu...
        </Text>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE] p-6">
        <Text className="text-red-500 text-lg font-black text-center font-quicksand">
          Không tìm thấy thông tin khóa học hoặc có lỗi xảy ra!
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

  return (
    <View className="flex-1 bg-[#FAF8F5] pt-14">
      {/* Header */}
      <View className="px-6 mb-4 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="bg-white p-3 rounded-full border-2 border-slate-100 shadow-sm active:scale-90"
        >
          <ArrowLeft color="#1E293B" size={20} />
        </Pressable>
        <Text className="text-lg font-black text-slate-800 font-fredoka flex-1 text-center mr-8" numberOfLines={1}>
          {course.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Banner */}
        <View className="px-6 mb-6">
          <PremiumCard 
            glowColor="#FDA4AF"
            className="border-violet-100/50 p-4 bg-white rounded-[32px] flex-row items-center"
          >
            <Image
              source={{ uri: course.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e" }}
              className="w-24 h-24 rounded-2xl border border-slate-100"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-xs font-black text-violet-500 uppercase tracking-widest font-quicksand">
                Bản đồ học tập 🗺️
              </Text>
              <Text className="text-xl font-black text-slate-850 font-fredoka mt-0.5 leading-6">
                Chinh Phục {course.units?.length || 4} Chủ Đề
              </Text>
              <Text className="text-xs font-bold text-slate-450 font-quicksand mt-1 leading-4" numberOfLines={2}>
                Hãy vượt qua các thử thách bài đọc và quiz để nhận cúp ngôi sao lấp lánh nhé!
              </Text>
            </View>
          </PremiumCard>
        </View>

        {/* Units / Adventure Path */}
        {course.units?.map((unit, unitIdx) => {
          const isFirstUnit = unitIdx === 0;
          return (
            <View key={unit.id} className="mb-10 px-6">
              {/* Unit Card Header */}
              <View className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-250 rounded-[28px] p-5 mb-6 relative overflow-hidden">
                <View className="absolute -top-3 -right-3 bg-amber-200/20 p-6 rounded-full" />
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-amber-800 text-xs font-black uppercase tracking-wider font-quicksand">
                    Chủ đề {unitIdx + 1}
                  </Text>
                  <View className="bg-amber-550 px-2 py-0.5 rounded-lg">
                    <Text className="text-white text-[10px] font-black font-quicksand">Mở Khóa 🔓</Text>
                  </View>
                </View>
                <Text className="text-lg font-black text-amber-950 font-fredoka leading-6 mb-1">
                  {unit.title}
                </Text>
                <Text className="text-amber-900 text-xs font-bold leading-4 font-quicksand">
                  {unit.description}
                </Text>
              </View>

              {/* Lessons Road */}
              <View className="pl-4 border-l-4 border-dashed border-violet-200">
                {unit.lessons.map((lesson, lessonIdx) => {
                  // Determine icon based on lesson type
                  let IconComponent = BookOpen;
                  let iconColor = "#8B5CF6";
                  let bgClass = "bg-violet-100 border-violet-200";
                  let label = "Bài Đọc";

                  if (lesson.type === "VOCABULARY") {
                    IconComponent = Languages;
                    iconColor = "#10B981";
                    bgClass = "bg-emerald-100 border-emerald-200";
                    label = "Từ Vựng";
                  } else if (lesson.type === "GAME") {
                    IconComponent = Gamepad2;
                    iconColor = "#F59E0B";
                    bgClass = "bg-amber-100 border-amber-250";
                    label = "Trò Chơi";
                  }

                  // Determine active status: let's unlock all for this prototype
                  const isLocked = false; 

                  return (
                    <View key={lesson.id} className="relative mb-6 pl-6">
                      {/* Node Bullet on Timeline */}
                      <View className={`absolute -left-[26px] top-4 w-7 h-7 rounded-full border-2 border-white items-center justify-center shadow-md ${isLocked ? 'bg-slate-300' : 'bg-violet-600'}`}>
                        {isLocked ? (
                          <Lock color="#FFFFFF" size={10} />
                        ) : (
                          <Star color="#FFFFFF" size={10} fill="#FFFFFF" />
                        )}
                      </View>

                      {/* Lesson Card */}
                      <Pressable
                        disabled={isLocked}
                        onPress={() => router.push(`/courses/lesson/${lesson.id}`)}
                        className={`bg-white border-2 border-slate-100 rounded-2xl p-4.5 flex-row justify-between items-center shadow-sm active:scale-98 ${isLocked ? 'opacity-60' : ''}`}
                      >
                        <View className="flex-row items-center flex-1 mr-3">
                          {/* Left Icon Panel */}
                          <View className={`w-12 h-12 rounded-xl border-b-4 items-center justify-center ${bgClass}`}>
                            <IconComponent color={iconColor} size={22} />
                          </View>
                          
                          {/* Text Panel */}
                          <View className="ml-3.5 flex-1">
                            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-wider font-quicksand">
                              {label} • +{lesson.points} Sao ⭐
                            </Text>
                            <Text className="text-base font-black text-slate-800 font-fredoka mt-0.5 leading-5" numberOfLines={2}>
                              {lesson.title}
                            </Text>
                          </View>
                        </View>

                        {/* Action play button */}
                        <View className={`p-2.5 rounded-full ${isLocked ? 'bg-slate-100' : 'bg-violet-50 active:bg-violet-100'}`}>
                          {isLocked ? (
                            <Lock color="#94A3B8" size={16} />
                          ) : (
                            <Play color="#8B5CF6" size={16} fill="#8B5CF6" />
                          )}
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
