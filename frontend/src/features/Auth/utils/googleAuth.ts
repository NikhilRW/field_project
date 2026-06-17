import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

let isConfigured = false;

const configureGoogleSignIn = () => {
  if (isConfigured) {
    return;
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

  if (!webClientId) {
    throw new Error("Google Sign-In is not configured for this app.");
  }

  GoogleSignin.configure({
    webClientId,
    scopes: ["profile", "email"],
  });

  isConfigured = true;
};

export const getGoogleIdToken = async () => {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });


  const response = await GoogleSignin.signIn();


  if (isCancelledResponse(response)) {
    return null;
  }

  if (!isSuccessResponse(response) || !response.data.idToken) {
    throw new Error("Google did not return a valid identity token.");
  }

  return response.data.idToken;
};

export const getGoogleSignInErrorMessage = (error: unknown) => {
  if (!isErrorWithCode(error)) {
    return error instanceof Error
      ? error.message
      : "Unable to continue with Google.";
  }

  switch (error.code) {
    case statusCodes.IN_PROGRESS:
      return "Google Sign-In is already in progress.";
    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      return "Google Play Services is not available or needs an update.";
    default:
      return "Unable to continue with Google.";
  }
};
