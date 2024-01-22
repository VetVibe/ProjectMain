import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TabsContainer({ tabs, activeTab, handleTabPress }) {
  return (
    <View style={styles.tabsContainer}>
      {Object.keys(tabs).map((key) => (
        <TouchableOpacity
          key={key}
          style={[styles.tabButton, activeTab === key && styles.activeTab]}
          onPress={() => handleTabPress(key)}
        >
          <Text style={styles.tabButtonText}>{tabs[key].title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFA500", // Bright orange
  },
  tabButtonText: {
    fontSize: 16,
  },
});
