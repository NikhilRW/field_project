import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const signOutFromGoogle = async () => {
  await GoogleSignin.signOut();
};