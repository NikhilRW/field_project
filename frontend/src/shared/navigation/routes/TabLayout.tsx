import { Tabs } from "expo-router";
import { View } from "react-native";
import {
  LayoutDashboard,
  CalendarDays,
  HandCoins,
  CircleUser,
} from "lucide-react-native";
import { Colors } from "@/shared/constants/color";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  hiddenTabOptions,
  hideTabIfUser,
} from "@/shared/utils/tabNavigation";
import { tabLayoutStyles as styles } from "@/shared/styles/tabLayoutStyles";

export default function TabLayout() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isUser = !isAdmin;

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
        options={hideTabIfUser(isUser, {
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
        })}
      />
      <Tabs.Screen
        name="beneficiaries"
        options={hiddenTabOptions}
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
        options={{
          title: isAdmin ? "Funds" : "Donations",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <HandCoins
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.6}
              />
            </View>
          ),
        }}
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
