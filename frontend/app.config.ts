import { ExpoConfig } from "expo/config";
export default (): ExpoConfig => ({
  name: "Helping Hands",
  slug: "frontend",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "helpinghands",
  userInterfaceStyle: "automatic",
  icon: "./assets/icon.png",
  ios: {
    associatedDomains: ["applinks:helpinghands.com"],
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "We use your location to pick activity locations on the map.",
      NSCameraUsageDescription:
        "We use your camera to capture donation item photos for NGO verification.",
    },
  },
  android: {
    icon: "./assets/splash-icon.png",
    googleServicesFile: "./personal/google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#fb0000",
    },
    predictiveBackGestureEnabled: false,
    package: "com.rn75.helpinghands",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA",
      "ACCESS_NETWORK_STATE",
      "ACCESS_WIFI_STATE",
      "POST_NOTIFICATIONS",
    ],
    intentFilters: [
      {
        action: "VIEW",
        data: [
          {
            scheme: "https",
            host: "helpinghands.com",
            pathPrefix: "/auth",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    output: "single",
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    ["expo-router"],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    "@react-native-google-signin/google-signin",
    [
      "expo-image-picker",
      {
        cameraPermission:
          "We use your camera to capture donation item photos for NGO verification.",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash-icon.png",
        imageWidth: 200,
      },
    ],
    "@react-native-community/datetimepicker",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  owner: "rn75",
});
