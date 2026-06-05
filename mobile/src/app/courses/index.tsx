import React from "react";
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useCoursesList } from "../../features/courses/courses.hooks";
import { ArrowLeft, BookOpen, Star, Trophy, Sparkles } from "lucide-react-native";
import { PremiumCard } from "../../components/PremiumCard";

export default function CoursesScreen() {
  const { data: courses, isLoading, error } = useCoursesList();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF6EE]">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-violet-600 mt-5 font-black text-lg text-center px-6 leading-8 font-quicksand">
          ✨ Đang tải bản đồ phiêu lưu tiếng Anh...
        </Text>
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
        <Text className="text-xl font-black text-slate-800 font-fredoka flex-1 text-center mr-8">
          Khóa Học Tiếng Anh 🇬🇧
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        {/* Intro Banner */}
        <View className="bg-violet-100 border-2 border-violet-200 rounded-[32px] p-6 mb-8 relative overflow-hidden">
          <View className="absolute top-0 right-0 w-24 h-24 bg-violet-200/30 rounded-full blur-xl pointer-events-none" />
          <View className="flex-row items-center mb-3">
            <Sparkles color="#8B5CF6" size={24} fill="#C084FC" />
            <Text className="text-violet-800 text-sm font-black uppercase ml-2 tracking-widest font-quicksand">
              Học Mà Chơi, Chơi Mà Học
            </Text>
          </View>
          <Text className="text-2xl font-black text-violet-950 font-fredoka mb-2 leading-7">
            Hành trình chinh phục Tiếng Anh của Bé!
          </Text>
          <Text className="text-violet-750 text-sm font-bold leading-5 font-quicksand">
            Bé sẽ được khám phá các câu chuyện từ vựng qua giọng đọc tiếng Anh chuẩn Mỹ từ Vbee và tham gia các trò chơi tương tác thú vị.
          </Text>
        </View>

        <Text className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          Khóa Học Dành Cho Bé 🌟
        </Text>

        {/* Courses List */}
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            return (
              <Pressable
                key={course.id}
                onPress={() => router.push(`/courses/${course.slug}`)}
                className="mb-6 active:scale-98"
              >
                <PremiumCard 
                  glowColor="#FDA4AF"
                  className="border-violet-100/50 p-0 overflow-hidden bg-white rounded-[32px]"
                >
                  <View className="relative">
                    <Image
                      source={{ uri: course.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e" }}
                      className="w-full h-44"
                      resizeMode="cover"
                    />
                    <View className="absolute top-4 left-4 bg-amber-500 px-3.5 py-1.5 rounded-full flex-row items-center border border-amber-600 shadow-sm">
                      <Trophy color="#FFFFFF" size={12} fill="#FFFFFF" />
                      <Text className="text-white text-[10px] font-black uppercase ml-1">Độ tuổi: 3-6</Text>
                    </View>
                  </View>
                  
                  <View className="p-6">
                    <Text className="text-[#8B5CF6] text-xs font-black uppercase tracking-wider mb-1 font-quicksand">
                      Trình độ: {course.level}
                    </Text>
                    <Text className="text-2xl font-black text-slate-800 font-fredoka mb-2 leading-7">
                      {course.title}
                    </Text>
                    <Text className="text-slate-500 text-sm font-bold leading-5 mb-5 font-quicksand">
                      {course.description}
                    </Text>
                    
                    <View className="flex-row items-center justify-between border-t border-slate-50 pt-4">
                      <View className="flex-row items-center">
                        <BookOpen color="#8B5CF6" size={16} />
                        <Text className="text-slate-500 text-xs font-black ml-1.5 font-quicksand">
                          {course.units?.length || 4} Chủ đề chính
                        </Text>
                      </View>
                      
                      <View className="bg-violet-600 py-3 px-5 rounded-2xl border-b-4 border-violet-850">
                        <Text className="text-white font-black text-sm font-quicksand">Khám Phá</Text>
                      </View>
                    </View>
                  </View>
                </PremiumCard>
              </Pressable>
            );
          })
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-slate-400 font-bold text-center font-quicksand">
              Chưa có khóa học nào được đăng ký rồi bé ơi 😢
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
