import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, Headset, User } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#A78BFA" : "#7C3AED",
        tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8",
        tabBarStyle: {
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#334155" : "#F1F5F9",
          paddingBottom: insets.bottom,
          paddingTop: 8,
          height: 64 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Truyện Tranh",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: "Sách Nói",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Headset color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Của Bé",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
