import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AppointmentCard({ appointment, onPressCancel }) {
  const { _id, vetId, petOwnerId, date, time, name, phoneNumber } = appointment;
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.date_container}>
          <View>
            <Text style={styles.date_text}>{day}</Text>
          </View>
          <View>
            <Text style={styles.month_text}>{month}</Text>
          </View>
        </View>
        <View style={styles.info_container}>
          <View style={styles.info}>
            <View>
              <Text style={styles.appType}>{name}</Text>
              <Text style={styles.appType}>{phoneNumber}</Text>
              <Text style={styles.time}>
                {`${String(time).padStart(2, "0")}:00 - ${String(time + 1).padStart(2, "0")}:00`}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onPressCancel}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
  date_container: {
    marginHorizontal: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  info_container: {
    flex: 1,
    justifyContent: "center",
  },
  date_text: {
    fontSize: 34,
  },
  month_text: {
    fontSize: 18,
  },
  appType: {
    fontSize: 18,
    padding: 8,
  },
  time: {
    fontSize: 14,
    padding: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
