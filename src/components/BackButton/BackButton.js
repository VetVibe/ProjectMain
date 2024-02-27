import { Ionicons } from "@expo/vector-icons";
export default function BackButton({ navigation }) {
  return (
    <Ionicons name="chevron-back-sharp" size={24} style={{ marginLeft: 12 }} onPress={() => navigation.goBack()} />
  );
}
