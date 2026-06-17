import { MessageOptions, showMessage } from "react-native-flash-message";

export const showAppMessage = (
  message: string,
  description: string,
  type: MessageOptions["type"] = "info",
) => {
  showMessage({
    message,
    description,
    type,
  });
};
