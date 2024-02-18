import { Text, TouchableOpacity } from "react-native";

export default function Button({ text, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <Text style={style.text}>{text}</Text>
    </TouchableOpacity>
  );
}
