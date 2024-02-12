import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function WorkingTimePicker({ start, end, setStart, setEnd }) {
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const [selectedStart, setSelectedStart] = useState(start || null);
  const [selectedEnd, setSelectedEnd] = useState(end || null);

  const handleConfirmStart = (time) => {
    setSelectedStart(time);
    setStart(time);
    setStartTimePickerVisible(false);
  };

  const handleConfirmEnd = (time) => {
    setSelectedEnd(time);
    setEnd(time);
    setEndTimePickerVisible(false);
  };
  return (
    <>
      <>
        <Text>From</Text>
        <TouchableOpacity onPress={setStartTimePickerVisible}>
          <Text>{start ? `${String(start.getHours()).padStart(2, "0")}:00` : "8:00"}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmStart}
          onCancel={() => setStartTimePickerVisible(false)}
        />
      </>
      <>
        <Text>To</Text>
        <TouchableOpacity onPress={setEndTimePickerVisible}>
          <Text>{end ? `${String(end.getHours()).padStart(2, "0")}:00` : "20:00"}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmEnd}
          onCancel={() => setEndTimePickerVisible(false)}
        />
      </>
    </>
  );
}
