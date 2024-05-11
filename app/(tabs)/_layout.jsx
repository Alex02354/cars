import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFD800", // Set background color to yellow
          paddingTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon
              name={focused ? "home-sharp" : "home-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="compass"
        options={{
          title: "",
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon
              name={focused ? "compass" : "compass-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "",
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
