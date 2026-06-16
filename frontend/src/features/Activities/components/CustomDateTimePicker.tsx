import React, { createElement } from "react";
import DateTimePicker,{ DatePickerOptions } from "@react-native-community/datetimepicker";
import { isWeb } from "@/shared/constants/platform";

const CustomDateTimePicker = ({
  value,
  display,
  maximumDate,
  minimumDate,
  onChange,
}: DatePickerOptions) => {
  if (isWeb) {
    return createElement("input", {
      type: "date",
      value: value instanceof Date ? value.toISOString().split("T")[0] : String(value),
      onInput: onChange,
    });
  }
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={onChange}
    />
  );
};

export default CustomDateTimePicker;
