import { Text, TouchableOpacity } from "react-native";

export default function Button({ text, onPress, style, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} style={style.container} disabled={disabled}>
      <Text style={style.text}>{text}</Text>
    </TouchableOpacity>
  );
}
