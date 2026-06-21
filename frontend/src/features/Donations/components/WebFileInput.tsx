import React from "react";

type Props = {
  onFile: (file: { uri: string; name: string; type: string }) => void;
};

export type WebFileInputRef = { open: () => void };

export default React.forwardRef<WebFileInputRef, Props>(function WebFileInput(
  _props: Props,
  _ref,
) {
  return null;
});
