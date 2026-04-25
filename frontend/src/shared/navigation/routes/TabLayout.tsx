import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  HandCoins,
  CircleUser,
} from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";

export default function TabLayout() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isUser = !isAdmin;
  // TODO: make all react files follow react best practices.
  const hiddenTabOptions = {
    tabBarButton: () => null,
    tabBarItemStyle: { display: "none" as const },
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <LayoutDashboard
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.6}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="beneficiaries"
        options={
          isUser
            ? hiddenTabOptions
            : {
                title: "People",
                tabBarIcon: ({ color, focused }) => (
                  <View
                    style={[styles.iconWrap, focused && styles.iconWrapActive]}
                  >
                    <Users
                      size={20}
                      color={color}
                      strokeWidth={focused ? 2.2 : 1.6}
                    />
                  </View>
                ),
              }
        }
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Activities",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <CalendarDays
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.6}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="donations"
        options={
          isUser
            ? hiddenTabOptions
            : {
                title: "Funds",
                tabBarIcon: ({ color, focused }) => (
                  <View
                    style={[styles.iconWrap, focused && styles.iconWrapActive]}
                  >
                    <HandCoins
                      size={20}
                      color={color}
                      strokeWidth={focused ? 2.2 : 1.6}
                    />
                  </View>
                ),
              }
        }
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <CircleUser
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.6}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    // backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.8)",
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 0,
    ...(Platform.OS === "web" ? { height: 68 } : {}),
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabItem: {
    paddingTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryLight,
  },
});
