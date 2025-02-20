import React, { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DateTimePickerComponentProps {
  onChange?: (value: string | null) => void;
  size?: "small" | "medium";
}

export default function DateTimePickerComponent({
  onChange,
  size = "small",
}: DateTimePickerComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (onChange) {
      onChange(newDate ? newDate.toISOString() : null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={selectedDate}
        onChange={handleDateChange}
        slotProps={{
          textField: {
            size: size,
            sx: {
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Default border color
                  ".dark &": { borderColor: "white" }, // White border in dark mode
                },
                "&:hover fieldset": {
                  borderColor: "gray",
                  ".dark &": { borderColor: "white" },
                },
                "&.Mui-focused fieldset": {
                  borderColor: "blue",
                  ".dark &": { borderColor: "white" },
                },
              },
              "& .MuiInputBase-input": {
                color: "black", // Default text color
                ".dark &": { color: "white" }, // White text in dark mode
              },
              "& .MuiInputLabel-root": {
                color: "gray", // Default label color
                ".dark &": { color: "white" }, // White label in dark mode
              },
            },
          },
          openPickerButton: {
            sx: {
              color: "gray", // Default icon color
              ".dark &": { color: "white" }, // White icon in dark mode
              "&:hover": { color: "#ddd" },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
