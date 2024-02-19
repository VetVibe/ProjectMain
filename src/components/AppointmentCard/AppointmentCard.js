import { Text, View, StyleSheet, Alert } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { sizes, colors } from "../../constants";

export default function AppointmentCard({ appointment, onPressCancel }) {
  const { date, time, name, phoneNumber } = appointment;
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString("default", { month: "short" });

  const cancelAppointment = () => {
    Alert.alert("Cancel appointment", "Are you sure you want to cancel the appointment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => onPressCancel(),
      },
    ]);
  };

  return (
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
            <Text style={styles.title}>{name}</Text>
            <View style={styles.phone_container}>
              <Feather name="phone" size={16} color={colors.gray} />
              <Text style={styles.phone}>{phoneNumber}</Text>
            </View>
            <Text style={styles.time}>
              {`${String(time).padStart(2, "0")}:00 - ${String(time + 1).padStart(2, "0")}:00`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.delete_icon_container}>
        <MaterialIcons name="delete" size={24} onPress={cancelAppointment} />
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
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
  date_container: {
    backgroundColor: colors.secondary,
    marginHorizontal: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  info_container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  date_text: {
    fontSize: 34,
    color: colors.white,
  },
  month_text: {
    fontSize: 18,
    color: colors.white,
  },
  title: {
    fontSize: sizes.h2,
    paddingBottom: 8,
    fontWeight: "bold",
  },
  phone_container: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  phone: {
    fontSize: sizes.body1,
    paddingHorizontal: 8,
    color: colors.gray,
  },
  time: {
    fontSize: sizes.body1,
    color: colors.gray,
  },
  delete_icon_container: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    padding: 5,
  },
});
