import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, useColorScheme } from "react-native";
import { useAuthStore } from "../../features/auth/auth.store";
import { LogOut, Shield, Award, Heart, HelpCircle, Star, ChevronRight, Settings, Flame, BookOpen, Bell, Sparkles } from "lucide-react-native";
import { PremiumCard } from "../../components/PremiumCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bé có chắc chắn muốn đăng xuất tài khoản không?",
      [
        { text: "Ở lại đọc tiếp", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const activityOptions = [
    { title: "Truyện bé yêu thích", icon: <Heart color="#EF4444" size={20} />, value: "12 truyện", bg: "bg-rose-50 dark:bg-rose-950/30" },
    { title: "Huy hiệu đã đạt", icon: <Award color="#F59E0B" size={20} />, value: "4 huy hiệu", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { title: "Lịch sử đọc của bé", icon: <BookOpen color="#8B5CF6" size={20} />, value: "8 bộ truyện", bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  const supportOptions = [
    { title: "Thông báo & Nhắc nhở", icon: <Bell color="#3B82F6" size={20} />, bg: "bg-blue-50 dark:bg-blue-950/30" },
    { title: "Điều khoản & Bảo mật", icon: <Shield color="#10B981" size={20} />, bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { title: "Hỗ trợ khách hàng", icon: <HelpCircle color="#64748B" size={20} />, bg: "bg-slate-50 dark:bg-slate-800/50" },
  ];

  return (
    <ScrollView 
      style={{ paddingTop: insets.top }} 
      className="flex-1 bg-[#FAF8F5] dark:bg-[#0C0A10]"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header bar */}
      <View className="px-6 mt-4 flex-row justify-between items-center">
        <Text className="text-3xl font-black text-slate-800 dark:text-white">
          Của Bé 🦄
        </Text>
        <TouchableOpacity className="bg-white dark:bg-slate-900 p-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95">
          <Settings color={isDark ? "#FFFFFF" : "#475569"} size={20} />
        </TouchableOpacity>
      </View>

      {/* Profile Card & Avatar */}
      <View className="items-center px-6 mt-6">
        <View className="relative">
          {/* Neon/Premium Gold Glow ring wrapper */}
          <View className="p-1 rounded-full bg-amber-400 dark:bg-amber-500/80 shadow-lg shadow-amber-400/50">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" }}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900"
            />
          </View>
          <View className="absolute -bottom-2 self-center bg-amber-500 rounded-full px-3 py-1 border-2 border-white dark:border-slate-900 shadow-md flex-row items-center justify-center">
            <Sparkles color="#FFFFFF" size={10} />
            <Text className="text-[10px] text-white font-black ml-1 uppercase">BÉ THÔNG THÁI</Text>
          </View>
        </View>

        <Text className="text-2xl font-black text-slate-800 dark:text-white mt-5">
          {user?.name || "Bé Đọc"}
        </Text>
        <Text className="text-sm text-slate-400 dark:text-slate-500 font-bold mt-1">
          ID: {user?.email || "demo@miniread.vn"}
        </Text>
      </View>

      {/* Progress & Stats Dashboard (Vietinbank/Nhaccuatui styled highlight card) */}
      <View className="px-6 mt-6">
        <PremiumCard 
          glowColor="#8B5CF6"
          className="border-violet-100/50 dark:border-slate-850 p-5 overflow-hidden"
        >
          {/* Target Title */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-black text-slate-700 dark:text-slate-200">
              Mục tiêu đọc tuần này 🎯
            </Text>
            <Text className="text-xs font-black text-violet-600 dark:text-violet-400">
              120 / 300 phút
            </Text>
          </View>

          {/* Custom styled dynamic progress bar */}
          <View className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
            <View 
              style={{ width: "40%" }} 
              className="h-full bg-violet-600 rounded-full"
            />
          </View>

          {/* Stats Items */}
          <View className="flex-row justify-around items-center pt-2">
            <View className="items-center">
              <View className="bg-orange-50 dark:bg-orange-950/40 p-2.5 rounded-full mb-1">
                <Flame color="#F97316" size={20} />
              </View>
              <Text className="text-base font-black text-slate-850 dark:text-white">2 ngày</Text>
              <Text className="text-[10px] text-slate-400 font-bold mt-0.5">Chuỗi đọc</Text>
            </View>

            <View className="w-[1] h-8 bg-slate-100 dark:bg-slate-800" />

            <View className="items-center">
              <View className="bg-violet-50 dark:bg-violet-950/40 p-2.5 rounded-full mb-1">
                <BookOpen color="#8B5CF6" size={20} />
              </View>
              <Text className="text-base font-black text-slate-850 dark:text-white">12 truyện</Text>
              <Text className="text-[10px] text-slate-400 font-bold mt-0.5">Đã đọc</Text>
            </View>

            <View className="w-[1] h-8 bg-slate-100 dark:bg-slate-800" />

            <View className="items-center">
              <View className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-full mb-1">
                <Star color="#F59E0B" fill="#F59E0B" size={20} />
              </View>
              <Text className="text-base font-black text-slate-850 dark:text-white">1,200 xu</Text>
              <Text className="text-[10px] text-slate-400 font-bold mt-0.5">Điểm tích lũy</Text>
            </View>
          </View>
        </PremiumCard>
      </View>

      {/* Option Group 1: Hoạt động */}
      <View className="px-6 mt-4">
        <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
          Hoạt động của bé
        </Text>
        <PremiumCard className="p-0 border-slate-100/60 dark:border-slate-850 overflow-hidden">
          {activityOptions.map((opt, idx) => (
            <TouchableOpacity
              key={opt.title}
              className={`flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-slate-850/50 active:bg-slate-50 dark:active:bg-slate-900/50 ${
                idx === activityOptions.length - 1 ? "border-b-0" : ""
              }`}
            >
              <View className="flex-row items-center">
                <View className={`p-2 rounded-xl ${opt.bg}`}>
                  {opt.icon}
                </View>
                <Text className="text-slate-700 dark:text-slate-200 text-sm font-black ml-3">
                  {opt.title}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold mr-2">
                  {opt.value}
                </Text>
                <ChevronRight color={isDark ? "#475569" : "#CBD5E1"} size={16} />
              </View>
            </TouchableOpacity>
          ))}
        </PremiumCard>
      </View>

      {/* Option Group 2: Tài khoản & Hỗ trợ */}
      <View className="px-6 mt-4">
        <Text className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">
          Ứng dụng & Hỗ trợ
        </Text>
        <PremiumCard className="p-0 border-slate-100/60 dark:border-slate-850 overflow-hidden">
          {supportOptions.map((opt, idx) => (
            <TouchableOpacity
              key={opt.title}
              className={`flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-slate-850/50 active:bg-slate-50 dark:active:bg-slate-900/50 ${
                idx === supportOptions.length - 1 ? "border-b-0" : ""
              }`}
            >
              <View className="flex-row items-center">
                <View className={`p-2 rounded-xl ${opt.bg}`}>
                  {opt.icon}
                </View>
                <Text className="text-slate-700 dark:text-slate-200 text-sm font-black ml-3">
                  {opt.title}
                </Text>
              </View>
              <ChevronRight color={isDark ? "#475569" : "#CBD5E1"} size={16} />
            </TouchableOpacity>
          ))}
        </PremiumCard>
      </View>

      {/* Logout button */}
      <View className="px-6 mt-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 py-4.5 rounded-[20px] flex-row justify-center items-center active:scale-98"
        >
          <LogOut color="#EF4444" size={18} />
          <Text className="text-rose-500 font-black text-base ml-2">
            Đăng Xuất Tài Khoản
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
