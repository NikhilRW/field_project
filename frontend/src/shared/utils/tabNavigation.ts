import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export const hiddenTabOptions: Partial<BottomTabNavigationOptions> = {
  tabBarButton: () => null,
  tabBarItemStyle: { display: "none" as const },
};

export const hideTabIfUser = (
  isUser: boolean,
  options: Partial<BottomTabNavigationOptions>,
): Partial<BottomTabNavigationOptions> => {
  return isUser ? { ...hiddenTabOptions } : options;
};
