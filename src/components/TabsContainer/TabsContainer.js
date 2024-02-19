import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, sizes } from "../../constants";

export default function TabsContainer({ tabs, activeTab, handleTabPress }) {
  return (
    <View style={styles.tabsContainer}>
      {Object.keys(tabs).map((key) => (
        <TouchableOpacity
          key={key}
          style={activeTab === key ? styles.activeTab : styles.tabButton}
          onPress={() => handleTabPress(key)}
        >
          <Text style={activeTab === key ? styles.activeTabButtonText : styles.tabButtonText}>{tabs[key].title}</Text>
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
    borderBottomColor: "transparent",
  },
  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  activeTabButtonText: {
    fontSize: sizes.h4,
    color: colors.gray,
    fontWeight: "bold",
  },
  tabButtonText: {
    fontSize: sizes.h4,
    color: colors.light_gray,
    fontWeight: "bold",
  },
});
