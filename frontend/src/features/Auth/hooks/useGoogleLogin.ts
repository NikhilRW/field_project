export const useWebGoogleLogin = ({
  onLoginSuccess,
  onLoginError,
}: {
  onLoginSuccess: (codeResponse: string) => void;
  onLoginError: (errorTitle?: string, errorDescription?: any) => void;
}) => {
  const googleLogin = () => {};
  return googleLogin;
};
