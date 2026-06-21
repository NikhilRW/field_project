import React, { useImperativeHandle, useRef } from "react";

type Props = {
  onFile: (file: { uri: string; name: string; type: string }) => void;
};

export type WebFileInputRef = { open: () => void };

const WebFileInput = React.forwardRef<WebFileInputRef, Props>(
  function WebFileInput({ onFile }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const uri = URL.createObjectURL(file);
      onFile({ uri, name: file.name, type: file.type });
      e.target.value = "";
    };

    return (
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    );
  },
);

export default WebFileInput;
