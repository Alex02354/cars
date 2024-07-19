import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFD800", // Set background color to yellow
          paddingTop: 7,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "",
          headerShown: false,
          /* unmountOnBlur: true, */
          tabBarIcon: ({ size, focused }) => (
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
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="compass"
        options={{
          title: "",
          tabBarIcon: ({ size, focused }) => (
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
          tabBarIcon: ({ size, focused }) => (
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
          tabBarIcon: ({ size, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={"black"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add2"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="miesta"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="kemp"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="trasy"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="itinerar"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="pridat"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="objavit"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="miesta2"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="kemp2"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="itinerar2"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="trasy2"
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
