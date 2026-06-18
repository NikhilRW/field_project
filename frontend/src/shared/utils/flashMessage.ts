import { MessageOptions, showMessage } from "react-native-flash-message";

export const showAppMessage = ({
  description,
  message,
  type = "info",
}: {
  message: string;
  description: string;
  type: MessageOptions["type"];
}) => {
  showMessage({
    message,
    description,
    type,
  });
};
