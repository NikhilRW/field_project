import { useGoogleLogin } from "@react-oauth/google";

export const useWebGoogleLogin = ({
  onLoginSuccess,
  onLoginError,
}: {
  onLoginSuccess: (codeResponse: string) => void;
  onLoginError: (errorTitle?: string, errorDescription?: any) => void;
}) => {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "postmessage",
    onSuccess: (codeResponse) => {
      codeResponse.code && onLoginSuccess(codeResponse.code);
    },
    onError(errorResponse) {
      onLoginError(errorResponse.error, errorResponse.error_description);
    },
  });
  return googleLogin;
};
