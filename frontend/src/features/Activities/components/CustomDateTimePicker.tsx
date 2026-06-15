import React, { createElement } from "react";
import { DatePickerOptions } from "@react-native-community/datetimepicker";
import { isWeb } from "@/shared/constants/platform";
import DateTimePicker from "@react-native-community/datetimepicker";

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
      value: value,
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
