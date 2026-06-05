import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../features/auth/auth.store";
import { apiClient } from "../../core/api/client";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginForm) => {
    setIsSubmitting(true);
    try {
      // Direct call to NestJS api endpoint
      const response = await apiClient.post("/auth/login", values);
      const { user, accessToken, refreshToken } = response.data;
      
      await setAuth(user, accessToken, refreshToken);
      Alert.alert("Thành công", `Chào mừng quay trở lại, ${user.name}!`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
      // Fallback if backend auth endpoints are not completed yet
      if (values.email === "demo@miniread.vn" && values.password === "123456") {
        const mockUser = { id: 1, email: "demo@miniread.vn", name: "Bé Khôi", role: "user" };
        await setAuth(mockUser, "mock-access-token", "mock-refresh-token");
        Alert.alert("Chế độ Demo", "Đã đăng nhập thành công tài khoản Demo!");
      } else {
        Alert.alert("Lỗi đăng nhập", msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-violet-50 dark:bg-slate-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="px-6">
        <View className="items-center mb-8">
          <Text className="text-5xl font-extrabold text-violet-800 dark:text-violet-400 mb-2 font-quicksand">
            BéĐọc 📖
          </Text>
          <Text className="text-base text-slate-500 dark:text-slate-400 text-center font-bevietnam">
            Đăng nhập để đọc hàng trăm cuốn truyện tranh cổ tích hấp dẫn
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
          <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-6 font-quicksand">
            Đăng Nhập
          </Text>

          <Text className="text-slate-600 dark:text-slate-300 mb-1.5 font-semibold">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-1 font-bevietnam"
                placeholder="email@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs mb-4">{errors.email.message}</Text>}

          <Text className="text-slate-600 dark:text-slate-300 mt-2 mb-1.5 font-semibold">Mật khẩu</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-600 mb-1 font-bevietnam"
                placeholder="••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text className="text-red-500 text-xs mb-4">{errors.password.message}</Text>}

          <TouchableOpacity
            className="w-full bg-violet-600 dark:bg-violet-700 py-4 rounded-2xl items-center mt-6 shadow-lg shadow-violet-300 dark:shadow-none"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-lg font-bold font-quicksand">Bắt Đầu Đọc 🚀</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-500 dark:text-slate-400">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-violet-600 dark:text-violet-400 font-bold">Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 items-center bg-violet-100 dark:bg-slate-800/50 p-4 rounded-2xl">
          <Text className="text-xs text-violet-800 dark:text-violet-300 text-center font-bevietnam">
            💡 Gợi ý thử nghiệm: Sử dụng tài khoản demo bên dưới nếu API chưa cấu hình:
          </Text>
          <Text className="text-xs font-bold text-violet-900 dark:text-violet-200 mt-1 selection:bg-violet-300">
            Email: demo@miniread.vn | Mật khẩu: 123456
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
