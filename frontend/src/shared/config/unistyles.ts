import { StyleSheet } from "react-native-unistyles";

StyleSheet.configure({
  themes: {
    light: {},
    dark: {},
  },
  settings: {
    initialTheme: () => "light" as never,
  },
});
